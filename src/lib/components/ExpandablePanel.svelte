<script>
  // copied from https://svelte.dev/repl/74ff0da7cb074d4788b996e2d91258d3?version=3.23.0
  import { slide } from "svelte/transition";

  export let label;
  let isOpen = false
  const toggle = () => isOpen = !isOpen
</script>
<style lang="scss">
  button {
    border: none;
    background: none;
    display: block;
    color: inherit;
    cursor: pointer;
    margin: 0;
    padding-left: 0;
    padding-bottom: 0.5em;
    padding-top: 0.5em
  }

  svg {
    transition: transform 0.1s;
    transition-delay: 0;

    &.rotated {
      transform: rotate(0.25turn);
    }
  }


</style>
<button on:pointerdown={toggle} aria-expanded={isOpen}>
  <svg width="20" height="20" fill="none" stroke-linecap="round"
       stroke-linejoin="round" stroke-width="2"
       viewBox="0 0 24 24" stroke="currentColor"
       class:rotated={isOpen}>
    <path d="M9 5l7 7-7 7"></path>
  </svg>
  {label}
</button>
{#if isOpen}
  <div transition:slide={{ duration: 300 }}>
    <slot></slot>
  </div>
{/if}
