import { writable } from 'svelte/store';

const STORAGE_KEY = 'indie-expo-user';

const generateUserId = () => {
  return 'user-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

const loadFromStorage = () => {
  if (typeof localStorage === 'undefined') {
    return { id: generateUserId(), displayName: '', settings: {} };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  const newUser = { id: generateUserId(), displayName: '', settings: {} };
  saveToStorage(newUser);
  return newUser;
};

const saveToStorage = (user) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
};

const createUserStore = () => {
  const initialUser = loadFromStorage();
  const { subscribe, set, update } = writable(initialUser);

  subscribe(value => saveToStorage(value));

  const updateUser = (data) => {
    update(user => ({ ...user, ...data }));
  };

  const resetUser = () => {
    const newUser = { id: generateUserId(), displayName: '', settings: {} };
    set(newUser);
  };

  return {
    subscribe,
    set,
    update,
    updateUser,
    resetUser
  };
};

export const user = createUserStore();
