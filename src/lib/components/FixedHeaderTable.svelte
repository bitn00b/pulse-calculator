<script lang="ts">
  export let data: unknown[];
</script>


<table style="width: 100%;" class="fixed-table-header">
  <tr>
    <slot name="headerRow"></slot>
  </tr>
  <!-- actual data for the hidden row, to have the same-ish header widths -->
  <tr style="opacity: 0; height: 0">
    <slot name="hiddenDataRow" data={data[data.length -1]}></slot>
  </tr>
</table>
<div class="scroll">
  <table style="width: 100%;" class="scrolling-table background-rows">
    <tr style="opacity: 0">
      <slot name="headerRow"></slot>
    </tr>
    <tbody>
      <slot></slot>
    </tbody>
  </table>
</div>

<style lang="scss">
  .scroll {
    height: 18rem;
    overflow: auto
  }

  .fixed-table-header {
    margin-bottom: -2rem;;
  }

  .scrolling-table {
    margin-top: -2rem;
  }
</style>
