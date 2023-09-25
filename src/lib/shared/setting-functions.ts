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

export interface TTLTuple<TValue = unknown> {
  value: TValue;
  ttl: number;
}

export function localStoredTTLValue<TValue>(
  key: string
): TTLTuple<TValue> | null {
  const localStoredJsonString = localStorage.getItem(key);


  if (localStoredJsonString) {
    const item = JSON.parse(localStoredJsonString)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
    } else {
      return item;
    }
  }

  return null;
}

export function saveLocalStoredTTLValue(
  key: string,
  ttl: number, newVal: unknown
) {
  const now = new Date()

  const item = {
    value: newVal,
    expiry: now.getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export function localStoredTTLWritable<TWritableType>(
  key: string,
  ttl: number,
  defaultValue: TWritableType
) {
  const tupleResult = localStoredTTLValue<TWritableType>(key);

  let localStoredValue = tupleResult?.value ?? defaultValue;

  const writableToReturn = writable(localStoredValue);

  writableToReturn.subscribe(newVal => {
    if (newVal === localStoredValue) {
      return;
    }

    saveLocalStoredTTLValue(key, ttl, newVal);
    localStoredValue = newVal;
  });

  return writableToReturn;
}

export function daysToMs(days: number) {
  return days * 24 * 60 * 60 * 1000;
}
