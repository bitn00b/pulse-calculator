import { writable } from "svelte/store";
import type { Readable } from "svelte/types/runtime/store";
import { Observable } from "rxjs";

export function localStoredSetting<TWritableType> (key: string, defaultValue: string, mapper: (savedValue: string) => TWritableType) {
  const localStoredValue = localStorage.getItem(key) ?? defaultValue;

  const writableToReturn = writable(mapper(localStoredValue));

  writableToReturn.subscribe(newVal => localStorage.setItem(key, newVal + ''));

  return writableToReturn;
}

export function asRxObservable<T> (svelteStore: Readable<T>): Observable<T> {
  return new Observable(subscriber => {
    const unsub = svelteStore.subscribe(value => {
      subscriber.next(value);
    });

    return () => {
      unsub();
    }
  })
}


