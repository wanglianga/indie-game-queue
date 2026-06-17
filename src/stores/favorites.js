import { writable, derived } from 'svelte/store';

const STORAGE_KEY = 'indie-expo-favorites';

const loadFromStorage = () => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (favorites) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // ignore
  }
};

const createFavoritesStore = () => {
  const initialFavorites = loadFromStorage();
  const { subscribe, set, update } = writable(initialFavorites);

  subscribe(value => saveToStorage(value));

  const toggleFavorite = (itemId, itemType, extraData = {}) => {
    update(favorites => {
      const exists = favorites.find(f => f.id === itemId && f.type === itemType);
      if (exists) {
        return favorites.filter(f => !(f.id === itemId && f.type === itemType));
      }
      return [...favorites, {
        id: itemId,
        type: itemType,
        addedAt: Date.now(),
        ...extraData
      }];
    });
  };

  const isFavorite = (itemId, itemType) => {
    let result = false;
    subscribe(favorites => {
      result = favorites.some(f => f.id === itemId && f.type === itemType);
    })();
    return result;
  };

  return {
    subscribe,
    set,
    update,
    toggleFavorite,
    isFavorite
  };
};

export const favorites = createFavoritesStore();

export const favoriteGames = derived(favorites, $favorites => 
  $favorites.filter(f => f.type === 'game')
);

export const favoriteBooths = derived(favorites, $favorites => 
  $favorites.filter(f => f.type === 'booth')
);

export const favoriteEvents = derived(favorites, $favorites => 
  $favorites.filter(f => f.type === 'event')
);

export const favoritesCount = derived(favorites, $favorites => 
  $favorites.length
);
