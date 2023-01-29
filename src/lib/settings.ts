import { localStoredSetting } from "./store-functions";

export const noConfigModal = localStoredSetting('noConfigModal', 'false', val => val === 'true');
export const showDisclaimer = localStoredSetting('showDisclaimer', 'true', val => val === 'true');
export const isDarkMode = localStoredSetting('darkMode', 'true', val => val === 'true');
