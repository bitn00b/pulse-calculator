<script lang="ts">
  import {Alert, Button, Modal} from "@svelteuidev/core";
  import {showAnkrGasChangeModal} from '@pulse/shared/globalState';
  import {modalSize} from "@pulse/shared/computed.ts";
  import HiSolidExternalLink from "svelte-icons-pack/hi/HiSolidExternalLink";
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import {InfoCircled} from "radix-icons-svelte";

  $: opened = $showAnkrGasChangeModal;
  $: size = $modalSize;


</script>

<Modal {opened} on:close={() => $showAnkrGasChangeModal = false} {size}>
   <h3 style="margin-top: -3rem">Saving up on some gas for Compounding</h3>

   <Alert icon={InfoCircled} title="Disclaimer"
          color="yellow">
      I don't know yet if this will work for Claim or Withdrawals.

      <br/>
      <br/>

      So far this "Tutorial" is for Metamask Desktop Users, if you managed to add it to Wallet XYZ - ping me with some
      text
      and/or images and then we add all tutorials in here.
   </Alert>


   <br/>
   <br/>

   These steps have to be done on each wallet, but I only the "knowhow" for MetaMask Desktop, but you can probably find
   how to do X for Wallet XYZ.

   <br/>

   1. Add the Ankr RPC to your Wallet:
   <Button target="_blank" href="https://www.ankr.com/rpc/bsc/"
           variant="outline"
           style="display: inline-block">
      <div class="inner-button-centered">
         <div style="color: white" class="inner-icon-path-color">
            <Icon size={24} src={HiSolidExternalLink}/>
         </div>
         Ankr RPC
      </div>
   </Button>
   this has a simple Button to add that BSC Chain to the Wallet.

   <br/>
   <br/>

   2. After this is added to MetaMask you need to switch to that "new chain" (but this is still BSC, just a different
   Entry-Point)

   <img width="312" alt="image"
        src="https://user-images.githubusercontent.com/109045767/270672803-0165eee1-103c-41e0-ab0c-f63060b30d32.png">

   <br/>
   <br/>

   3. When you are doing something, like Compounding, you'll see a Dialog which also includes the Gas-Fee, this one can
   be changed, here click on "Market"

   <img width="316" alt="image"
        src="https://user-images.githubusercontent.com/109045767/270673442-90b6d68b-60d2-4421-97ff-36824010cd53.png">

   <br/>
   <br/>


   4. Then this "Edit gas fee" Settings pop up:
   <img width="314" alt="image"
        src="https://user-images.githubusercontent.com/109045767/270673563-db22087f-4dde-4dd9-ab05-b02ca5bf0e8e.png">
   <br/>

   In there you select "Advanced".
   <br/>
   <br/>

   5. In this View you can edit the "Max base fee" and "Priority Fee", these are the settings I Used: <br/>

   <img width="326" alt="image"
        src="https://user-images.githubusercontent.com/109045767/270673643-ac01fac9-5cea-47a8-a3de-6477d5eae930.png">


</Modal>

<style lang="scss">
  .inner-button-centered {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 0.5rem;
  }
</style>
