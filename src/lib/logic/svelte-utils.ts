import type {Writable} from "svelte/store";
import {get_store_value} from "svelte/internal";

export function push<TInner>(writable: Writable<TInner[]>, ...itemsToAdd: TInner[]) {
  writable.set([...get_store_value(writable), ...itemsToAdd]);
}
