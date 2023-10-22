<script lang="ts">
  import {watchResize} from "svelte-watch-resize";

  import Treemap from 'treemap-chart';
  import {get, writable} from "svelte/store";
  import {Paper} from "@svelteuidev/core";
  import {useDebounce} from "@svelteuidev/composables";
  import {type ChartData, stringToColor} from "./pulse-map-utils";
  import {getWalletInformationsByChunk, getWalletList, type WalletData, type WalletType} from "./pulse-contract";
  import {formatNumber, formatNumber3Digits, formatNumberUSD} from "@pulse/shared/utils";
  import {SimpleTable} from "@a-luna/svelte-simple-tables";
  import {columnSettings, tableSettings} from "./pulse-table-settings";
  import HeaderRow from "./HeaderRow.svelte";
  import LoadingMessage from "@pulse/reusable-parts/LoadingMessage.svelte";
  import ShowAnkrGasChangeModalButton from "@pulse/reusable-parts/ShowAnkrGasChangeModalButton.svelte";

  const mapData = writable<ChartData>(
    {
      wallet: "", walletShort: "",
      name: "root",
      children: []
    }
  );

  let divEl: HTMLDivElement;

  const mapColorCache = {};
  const myChart = Treemap();
  myChart.color((obj: ChartData) => mapColorCache[obj.wallet] ?? (mapColorCache[obj.wallet] = stringToColor(obj.wallet)));
  myChart.label((obj: ChartData) => '$ ' + formatNumber(obj.value)
    + (obj.index < 20
        ? '\n(Profit: ' + '$ ' + formatNumber(obj.profitMade) + ')'
        : ''
    ));
  // disable clip to zoom, for now?
  myChart.onClick(node => {
  });
  myChart.excludeRoot(true);
  myChart.sort((a: ChartData, b: ChartData) => b.value - a.value);
  myChart.tooltipTitle((node: ChartData) => node.name);
  myChart.tooltipContent((node: ChartData) => {

    const parts = [];

    parts.push('Profit: ' + '$ ' + formatNumber(node.profitMade) + ' (' + formatNumberUSD(node.profitMade / node.value * 100) + '%)');

    parts.push('');
    parts.push('Wallet is ' + formatNumber3Digits(node.percentOfPool * 100) + '% of Pulse Funds');
    parts.push('');

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
    const contractWalletData: Record<string, WalletData> = {};
    const contractWalletTypes: Record<string, WalletType> = {};

    const chunkSize = 20;
    for (let i = 0; i < walletList.length; i += chunkSize) {
      const chunk = walletList.slice(i, i + chunkSize);

      const result = await getWalletInformationsByChunk(chunk);

      Object.assign(contractWalletData, result.walletData);
      Object.assign(contractWalletTypes, result.walletTypes);
    }

    mapData.update(mapDataInner => {
      let summaryOfFunds = 0; // TODO read from contract

      for (const [key, data] of Object.entries(contractWalletData)) {
        mapDataInner.children.push({
          name: '$ ' + formatNumber(data.amount),
          value: data.amount,
          profitMade: data.amount - data.share,
          wallet: key,
          walletShort: key.substring(0, 6),
          isVIP: contractWalletTypes[key]?.isVIP ?? false,
          isElite: contractWalletTypes[key]?.isElite ?? false,
        });

        summaryOfFunds += data.amount;
      }

      const sorted = mapDataInner.children.sort((a: ChartData, b: ChartData) => b.value - a.value);

      for (let i = 0; i < sorted.length; i++) {
        const chartDate = sorted[i];

        chartDate.index = i;
        chartDate.percentOfPool = chartDate.value / summaryOfFunds;
      }

      myChart.data(mapDataInner)
      return mapDataInner;
    });

    /*setTimeout(() => {
      const foundSVGElement: SVGElement = divEl.getElementsByTagName('svg').item(0);

      const newElement = document.createElement('defs');
      newElement.innerHTML = `
    <pattern id="img1" patternUnits="userSpaceOnUse" width="100" height="100">
         <img src="http://placekitten.com/100/100" x="0" y="0" width="100" height="100" />
    </pattern>
    `;


      foundSVGElement.appendChild(newElement);

    }, 500)*/
  }

  updateTheMap();

  function handleResize() {
    const appWidth = document.getElementById('svelte').clientWidth;

    myChart.width(appWidth - 46);
  }

  const debouncedResize = useDebounce(handleResize, 400);


</script>

<HeaderRow></HeaderRow>

<ShowAnkrGasChangeModalButton/>

{#if !$mapData.children.length}
   <LoadingMessage/>
{:else }
   <Paper use={[[watchResize, debouncedResize]]}>
      <div class="the-tree-map" bind:this={divEl}></div>
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

