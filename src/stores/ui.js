import { writable, derived } from 'svelte/store';

const STORAGE_KEY = 'indie-expo-ui';

const defaultSettings = {
  brightness: 100,
  contrast: 100,
  highContrast: false,
  fontSize: 'medium',
  reduceMotion: false,
  theme: 'dark',
  soundEnabled: true,
  vibrationEnabled: true
};

const loadFromStorage = () => {
  if (typeof localStorage === 'undefined') return defaultSettings;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const saveToStorage = (settings) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
};

const createUiStore = () => {
  const initialSettings = loadFromStorage();
  const { subscribe, set, update } = writable(initialSettings);

  subscribe(value => saveToStorage(value));

  const setBrightness = (value) => {
    update(ui => ({ ...ui, brightness: Math.max(0, Math.min(100, value)) }));
  };

  const setContrast = (value) => {
    update(ui => ({ ...ui, contrast: Math.max(50, Math.min(200, value)) }));
  };

  const toggleHighContrast = () => {
    update(ui => ({ ...ui, highContrast: !ui.highContrast }));
  };

  const setFontSize = (size) => {
    update(ui => ({ ...ui, fontSize: size }));
  };

  const toggleReduceMotion = () => {
    update(ui => ({ ...ui, reduceMotion: !ui.reduceMotion }));
  };

  const setTheme = (theme) => {
    update(ui => ({ ...ui, theme }));
  };

  const toggleSound = () => {
    update(ui => ({ ...ui, soundEnabled: !ui.soundEnabled }));
  };

  const toggleVibration = () => {
    update(ui => ({ ...ui, vibrationEnabled: !ui.vibrationEnabled }));
  };

  const resetSettings = () => {
    set(defaultSettings);
  };

  return {
    subscribe,
    set,
    update,
    setBrightness,
    setContrast,
    toggleHighContrast,
    setFontSize,
    toggleReduceMotion,
    setTheme,
    toggleSound,
    toggleVibration,
    resetSettings
  };
};

export const ui = createUiStore();

export const appliedBrightness = derived(ui, $ui => $ui.brightness);

export const appliedContrast = derived(ui, $ui => 
  $ui.highContrast ? 200 : $ui.contrast
);

export const isDarkTheme = derived(ui, $ui => $ui.theme === 'dark');

export const accessibilitySettings = derived(ui, $ui => ({
  highContrast: $ui.highContrast,
  reduceMotion: $ui.reduceMotion,
  fontSize: $ui.fontSize,
  soundEnabled: $ui.soundEnabled,
  vibrationEnabled: $ui.vibrationEnabled
}));
