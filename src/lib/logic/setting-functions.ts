import {writable} from "svelte/store";

export function localStoredSetting<TWritableType>(key: string, defaultValue: string, mapper: (savedValue: string) => TWritableType) {
  const localStoredValue = localStorage.getItem(key) ?? defaultValue;

  const writableToReturn = writable(mapper(localStoredValue));

  writableToReturn.subscribe(newVal => localStorage.setItem(key, newVal + ''));

  return writableToReturn;
}

export function localStoredMappedSetting<TWritableType>(
  key: string,
  storedToValue: (savedValue: string) => TWritableType,
  valueToStored: (currentValue: TWritableType) => string
) {
  const localStoredValue = localStorage.getItem(key);

  const writableToReturn = writable(storedToValue(localStoredValue));

  writableToReturn.subscribe(newVal => localStorage.setItem(key, valueToStored(newVal)));

  return writableToReturn;
}
