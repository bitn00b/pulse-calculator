import {get, type Writable} from "svelte/store";

export function push<TInner>(writable: Writable<TInner[]>, ...itemsToAdd: TInner[]) {
  writable.set([...get(writable), ...itemsToAdd]);
}
