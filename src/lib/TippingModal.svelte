<script lang="ts">
  import { ActionIcon, Alert, Code, CopyIcon, Modal } from "@svelteuidev/core";
  import { showTippingModal } from "./store";
  import { modalSize } from "./constants";
  import { copyText } from 'svelte-copy';
  import { useViewportSize } from "@svelteuidev/composables";


  const tipWallet = '0x0eB4B25D17c72D435ca430c233E9f64Ac409efe4';

  $: opened = $showTippingModal;

  const viewport = useViewportSize();
  $: size = $modalSize;

  async function handleCopyToClipboard () {
    try {
      await copyText(tipWallet);
      alert('Wallet Address copied to your clipboard.');
    } catch (e) {
      alert(`There was an error: ${e.message}`)
    }
  }
</script>

<Modal {opened} on:close={() => $showTippingModal = false} title="If you like to tip :)" {size}>
  <Alert title="Beware of the selected chain">
    This Wallet is on:
    <Code>ETH</Code>, <Code>BSC</Code>, <Code>Polygon</Code> and <Code>Arbitrum</Code>
  </Alert>

  <br/>
  If you have any spare <Code>ETH</Code>, <Code>BNB</Code>, <Code>BUSD</Code>, <Code>USDT</Code> or <Code>VFX</Code>
  laying around I'll gladly accept em :)

  <br/>
  <br/>

  <div style="display: flex; gap: 0.5rem">
    <input readonly aria-readonly="true" style="flex: 1" value={tipWallet}/>


    <ActionIcon color="teal" size="lg" variant="light"
                on:click={() => handleCopyToClipboard()}>
      <CopyIcon></CopyIcon>
    </ActionIcon>
  </div>
</Modal>
