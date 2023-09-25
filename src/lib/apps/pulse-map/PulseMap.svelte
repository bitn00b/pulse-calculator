<script lang="ts">
  import {watchResize} from "svelte-watch-resize";

  import Treemap from 'treemap-chart';
  import {get, writable} from "svelte/store";
  import {Paper} from "@svelteuidev/core";
  import {useDebounce} from "@svelteuidev/composables";
  import {type ChartData, stringToColor} from "./pulse-map-utils";
  import {getWalletInformationsByChunk, getWalletList, type WalletType} from "./pulse-contract";
  import {formatNumber} from "@pulse/shared/utils";
  import {SimpleTable} from "@a-luna/svelte-simple-tables";
  import {columnSettings, tableSettings} from "./pulse-table-settings";
  import HeaderRow from "./HeaderRow.svelte";
  import LoadingMessage from "@pulse/reusable-parts/LoadingMessage.svelte";

  const mapData = writable<ChartData>(
    {
      name: "root",
      children: []
    }
  );

  let divEl: HTMLDivElement;

  const mapColorCache = {};
  const myChart = Treemap();
  myChart.color((obj: ChartData) => mapColorCache[obj.wallet] ?? (mapColorCache[obj.wallet] = stringToColor(obj.wallet)));
  // disable clip to zoom, for now?
  myChart.onClick(node => {
  });
  myChart.excludeRoot(true);
  myChart.sort((a: ChartData, b: ChartData) => b.value - a.value);
  myChart.tooltipContent((node: ChartData) => {

    const parts = [];
    if (node.isVIP) {
      parts.push('Recurring: VIP');
    } else if (node.isElite) {
      parts.push('Recurring: Elite');
    }

    parts.push('Wallet: ' + node.walletShort.substring(0, 6))

    return parts.join('<br/>');
  })

  $: if (divEl) {
    divEl.textContent = '';
    myChart.data(get(mapData))(divEl);

    debouncedResize();
  }

  async function updateTheMap() {
    const walletList = await getWalletList();
    const contractWalletAmounts: Record<string, number> = {};
    const contractWalletTypes: Record<string, WalletType> = {};

    const chunkSize = 20;
    for (let i = 0; i < walletList.length; i += chunkSize) {
      const chunk = walletList.slice(i, i + chunkSize);

      const result = await getWalletInformationsByChunk(chunk);

      Object.assign(contractWalletAmounts, result.walletAmount);
      Object.assign(contractWalletTypes, result.walletTypes);
    }

    mapData.update(mapDataInner => {
      for (const [key, amount] of Object.entries(contractWalletAmounts)) {
        mapDataInner.children.push({
          name: '$ ' + formatNumber(amount),
          value: amount,
          wallet: key,
          walletShort: key.substring(0, 6),
          isVIP: contractWalletTypes[key]?.isVIP ?? false,
          isElite: contractWalletTypes[key]?.isElite ?? false,
        })
      }
      myChart.data(mapDataInner)
      return mapDataInner;
    })
  }

  updateTheMap();

  function handleResize(node: HTMLElement) {
    const appWidth = document.getElementById('svelte').clientWidth;

    myChart.width(appWidth - 46);
  }

  const debouncedResize = useDebounce(handleResize, 400);


</script>

<HeaderRow></HeaderRow>

{#if !$mapData.children.length}
   <LoadingMessage/>
{:else }
   <Paper use={[[watchResize, debouncedResize]]}>
      <div bind:this={divEl}></div>
   </Paper>
{/if}

<br/>

{#if $mapData.children.length !== 0 && false}
   <Paper>
      <SimpleTable data={$mapData.children} {columnSettings} {tableSettings}/>
   </Paper>
{/if}

<svelte:head>
   <style>
       .treemap-viz text {
           white-space: pre;
       }
   </style>
</svelte:head>

