import { writable } from "svelte/store";

export const initialAmountSelected = writable(100)
export const iterations = writable(4)
export const percentADay = writable(100.5)
export const days = writable(60)
export const first70Days = writable(false)
export const additionalAmount = writable(0)
export const additionalInterval = writable('daily')


const noConfigModalLocalStorage = localStorage.getItem('noConfigModal') ?? 'false';
export const noConfigModal = writable(noConfigModalLocalStorage === 'true');

noConfigModal.subscribe(newVal => localStorage.setItem('noConfigModal', newVal + ''))
