import {localStoredSetting} from "@pulse/shared/setting-functions.ts";

export const showDisclaimer = localStoredSetting('showDisclaimer', 'true', val => val === 'true');
export const isDarkMode = localStoredSetting('darkMode', 'true', val => val === 'true');
export const enableAnimations = localStoredSetting('animations', 'true', val => val === 'true');
