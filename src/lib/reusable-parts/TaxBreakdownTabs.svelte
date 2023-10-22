<script lang="ts">
  import {Tabs} from "@svelteuidev/core";
  import TaxFeeBreakdownKeyValue from "@pulse/reusable-parts/TaxFeeBreakdownKeyValue.svelte";
  import TaxFeeBreakdownTable from "@pulse/reusable-parts/TaxFeeBreakdownTable.svelte";
  import {type Fees, feesConstant} from "../apps/calculator/logic/pulseTaxStructure.js";

  export let fees: Fees = feesConstant;

</script>

<Tabs color="green" grow>
   <Tabs.Tab label="Splitted">
      <TaxFeeBreakdownKeyValue {fees} fullWidth={true}></TaxFeeBreakdownKeyValue>
   </Tabs.Tab>
   <Tabs.Tab label='Daily Detail'>
      <TaxFeeBreakdownTable {fees}></TaxFeeBreakdownTable>
   </Tabs.Tab>
</Tabs>
