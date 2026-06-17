import { writable, derived, get } from 'svelte/store';
import { games } from './games.js';

const STORAGE_KEY = 'indie-expo-queue';

const loadFromStorage = () => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (queue) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // ignore
  }
};

const createQueueStore = () => {
  const initialQueue = loadFromStorage();
  const { subscribe, set, update } = writable(initialQueue);

  subscribe(value => saveToStorage(value));

  const addToQueue = (gameId, gameName, station = null) => {
    const game = games.getGameById(gameId);
    if (!game) return null;

    const queueNumber = game.currentNumber + game.queueCount + 1;
    const estimatedWaitMinutes = game.queueCount * game.demoDuration / Math.max(1, game.stations.filter(s => s.status === 'playing').length);

    const queueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      gameId,
      gameName,
      queueNumber,
      status: 'waiting',
      station,
      joinTime: Date.now(),
      estimatedWaitMinutes: Math.round(estimatedWaitMinutes),
      demoDuration: game.demoDuration
    };

    update(queue => [...queue, queueItem]);
    games.joinQueue(gameId);

    return queueItem;
  };

  const removeFromQueue = (queueId) => {
    let removedItem = null;
    update(queue => {
      const item = queue.find(q => q.id === queueId);
      if (item) {
        removedItem = item;
        games.leaveQueue(item.gameId);
      }
      return queue.filter(q => q.id !== queueId);
    });
    return removedItem;
  };

  const updateQueueStatus = (queueId, status) => {
    update(queue => 
      queue.map(item => 
        item.id === queueId ? { ...item, status } : item
      )
    );
  };

  const getQueueByGameId = (gameId) => {
    let result;
    subscribe(queue => result = queue.filter(q => q.gameId === gameId && q.status === 'waiting'))();
    return result;
  };

  return {
    subscribe,
    set,
    update,
    addToQueue,
    removeFromQueue,
    updateQueueStatus,
    getQueueByGameId
  };
};

export const myQueue = createQueueStore();

export const activeQueue = derived(myQueue, $queue => 
  $queue.filter(q => q.status === 'waiting' || q.status === 'ready')
);

export const queueHistory = derived(myQueue, $queue => 
  $queue.filter(q => q.status === 'completed' || q.status === 'cancelled')
    .sort((a, b) => b.joinTime - a.joinTime)
);

export const queueCount = derived(myQueue, $queue => 
  $queue.filter(q => q.status === 'waiting').length
);

export const nextUpQueue = derived(myQueue, $queue => 
  $queue.filter(q => q.status === 'waiting')
    .sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes)
    .slice(0, 3)
);
