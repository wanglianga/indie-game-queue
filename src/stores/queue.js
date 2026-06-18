import { writable, derived, get } from 'svelte/store';
import { games } from './games.js';
import { booths } from './booths.js';
import { detectConflicts } from '../utils/conflictDetector.js';

const STORAGE_KEY = 'indie-expo-queue';
const OFFLINE_CREDENTIAL_KEY = 'indie-expo-offline-credentials';
const SYNC_STATUS_KEY = 'indie-expo-sync-status';

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

const loadOfflineCredentials = () => {
  if (typeof localStorage === 'undefined') return {};
  try {
    const data = localStorage.getItem(OFFLINE_CREDENTIAL_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveOfflineCredentials = (credentials) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_CREDENTIAL_KEY, JSON.stringify(credentials));
  } catch {
    // ignore
  }
};

const loadSyncStatus = () => {
  if (typeof localStorage === 'undefined') return { isOnline: true, lastSyncTime: Date.now() };
  try {
    const data = localStorage.getItem(SYNC_STATUS_KEY);
    return data ? JSON.parse(data) : { isOnline: true, lastSyncTime: Date.now() };
  } catch {
    return { isOnline: true, lastSyncTime: Date.now() };
  }
};

const saveSyncStatus = (status) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
  } catch {
    // ignore
  }
};

const calculateMissRisk = (queueItem, game) => {
  if (!game) return 'low';
  const positionAhead = queueItem.queueNumber - game.currentNumber;
  const availableStations = game.stations.filter(s => s.status === 'playing').length;
  const timePerTurn = game.demoDuration / Math.max(1, availableStations);
  const estimatedMinutesToTurn = positionAhead * timePerTurn;
  const timeSinceLastSync = (Date.now() - (queueItem.lastSyncTime || queueItem.joinTime)) / 60000;
  const driftFactor = timeSinceLastSync / Math.max(1, estimatedMinutesToTurn);

  if (positionAhead <= 2 || driftFactor > 0.5) return 'high';
  if (positionAhead <= 5 || driftFactor > 0.3) return 'medium';
  return 'low';
};

const estimateTurnTime = (queueItem, game) => {
  if (!game) return null;
  const positionAhead = queueItem.queueNumber - game.currentNumber;
  if (positionAhead <= 0) return Date.now();
  const availableStations = game.stations.filter(s => s.status === 'playing').length;
  const timePerTurn = game.demoDuration / Math.max(1, availableStations);
  const estimatedMinutesToTurn = positionAhead * timePerTurn;
  return Date.now() + estimatedMinutesToTurn * 60000;
};

const createQueueStore = () => {
  const initialQueue = loadFromStorage();
  const initialCredentials = loadOfflineCredentials();
  const initialSyncStatus = loadSyncStatus();

  const { subscribe, set, update } = writable(initialQueue);
  const offlineCredentials = writable(initialCredentials);
  const syncStatus = writable(initialSyncStatus);
  const reconnectResults = writable({});
  const conflictWarnings = writable([]);

  subscribe(value => saveToStorage(value));
  offlineCredentials.subscribe(value => saveOfflineCredentials(value));
  syncStatus.subscribe(value => saveSyncStatus(value));

  const setOnlineStatus = (isOnline) => {
    syncStatus.update(status => ({ ...status, isOnline, lastSyncTime: isOnline ? Date.now() : status.lastSyncTime }));
  };

  const addToQueue = (gameId, gameName, station = null) => {
    const game = games.getGameById(gameId);
    if (!game) return null;

    const booth = booths.getBoothById(game.boothId);
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
      lastSyncTime: Date.now(),
      estimatedWaitMinutes: Math.round(estimatedWaitMinutes),
      demoDuration: game.demoDuration,
      boothId: game.boothId,
      boothName: booth?.name || '未知展位',
      zone: booth?.zone || '其他',
      boothX: booth?.x || 0,
      boothY: booth?.y || 0,
      missRisk: 'low',
      estimatedTurnTime: null,
      syncStatus: 'synced'
    };

    queueItem.estimatedTurnTime = estimateTurnTime(queueItem, game);
    queueItem.missRisk = calculateMissRisk(queueItem, game);

    const credential = {
      id: queueItem.id,
      gameId,
      gameName,
      queueNumber,
      station,
      boothId: game.boothId,
      boothName: booth?.name || '未知展位',
      zone: booth?.zone || '其他',
      boothX: booth?.x || 0,
      boothY: booth?.y || 0,
      joinTime: queueItem.joinTime,
      lastSyncTime: queueItem.lastSyncTime,
      demoDuration: game.demoDuration,
      missRisk: queueItem.missRisk,
      estimatedTurnTime: queueItem.estimatedTurnTime,
      isOffline: false
    };

    update(queue => [...queue, queueItem]);
    offlineCredentials.update(creds => ({ ...creds, [queueItem.id]: credential }));
    games.joinQueue(gameId);

    checkConflicts();

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
    offlineCredentials.update(creds => {
      const newCreds = { ...creds };
      delete newCreds[queueId];
      return newCreds;
    });
    reconnectResults.update(results => {
      const newResults = { ...results };
      delete newResults[queueId];
      return newResults;
    });

    checkConflicts();

    return removedItem;
  };

  const updateQueueStatus = (queueId, status) => {
    update(queue => 
      queue.map(item => 
        item.id === queueId ? { ...item, status, lastSyncTime: Date.now() } : item
      )
    );
    offlineCredentials.update(creds => {
      if (creds[queueId]) {
        return {
          ...creds,
          [queueId]: {
            ...creds[queueId],
            status,
            lastSyncTime: Date.now()
          }
        };
      }
      return creds;
    });
  };

  const getQueueByGameId = (gameId) => {
    let result;
    subscribe(queue => result = queue.filter(q => q.gameId === gameId && q.status === 'waiting'))();
    return result;
  };

  const syncWithServer = () => {
    const currentQueue = get(myQueue);
    const currentCredentials = get(offlineCredentials);
    const $games = get(games);
    const results = {};

    currentQueue.forEach(item => {
      if (item.status !== 'waiting' && item.status !== 'ready') return;

      const game = $games.find(g => g.id === item.gameId);
      if (!game) {
        results[item.id] = { type: 'booth_paused', message: '展位暂停服务', gameName: item.gameName };
        updateQueueStatus(item.id, 'suspended');
        return;
      }

      if (game.status === 'paused' || game.status === 'suspended') {
        results[item.id] = { type: 'booth_paused', message: '展位暂停服务', gameName: item.gameName };
        updateQueueStatus(item.id, 'suspended');
        return;
      }

      const currentNumber = game.currentNumber;
      if (item.queueNumber < currentNumber) {
        results[item.id] = { type: 'called', message: '已被叫到，请尽快前往', gameName: item.gameName };
        updateQueueStatus(item.id, 'ready');
      } else if (item.queueNumber === currentNumber) {
        results[item.id] = { type: 'called', message: '现在轮到你了！', gameName: item.gameName };
        updateQueueStatus(item.id, 'ready');
      } else {
        results[item.id] = { type: 'unchanged', message: '排位未变', gameName: item.gameName };
      }

      update(queue => 
        queue.map(q => 
          q.id === item.id ? { 
            ...q, 
            lastSyncTime: Date.now(), 
            estimatedTurnTime: estimateTurnTime(q, game),
            missRisk: calculateMissRisk(q, game),
            estimatedWaitMinutes: Math.max(0, Math.round((q.queueNumber - currentNumber) * game.demoDuration / Math.max(1, game.stations.filter(s => s.status === 'playing').length)))
          } : q
        )
      );

      if (currentCredentials[item.id]) {
        offlineCredentials.update(creds => ({
          ...creds,
          [item.id]: {
            ...creds[item.id],
            lastSyncTime: Date.now(),
            estimatedTurnTime: estimateTurnTime(item, game),
            missRisk: calculateMissRisk(item, game),
            isOffline: false
          }
        }));
      }
    });

    reconnectResults.set(results);
    syncStatus.update(status => ({ ...status, isOnline: true, lastSyncTime: Date.now() }));

    checkConflicts();

    return results;
  };

  const markAsOffline = () => {
    setOnlineStatus(false);
    offlineCredentials.update(creds => {
      const updated = { ...creds };
      Object.keys(updated).forEach(key => {
        updated[key] = { ...updated[key], isOffline: true };
      });
      return updated;
    });
    update(queue => 
      queue.map(item => ({ ...item, syncStatus: 'offline' }))
    );
  };

  const refreshAllMissRisk = () => {
    const $games = get(games);
    update(queue => 
      queue.map(item => {
        if (item.status !== 'waiting') return item;
        const game = $games.find(g => g.id === item.gameId);
        return {
          ...item,
          missRisk: calculateMissRisk(item, game),
          estimatedTurnTime: estimateTurnTime(item, game)
        };
      })
    );
  };

  const checkConflicts = () => {
    const currentQueue = get(myQueue);
    const waitingItems = currentQueue.filter(q => q.status === 'waiting');
    
    if (waitingItems.length >= 2) {
      const $games = get(games);
      const conflicts = detectConflicts(waitingItems, $games);
      conflictWarnings.set(conflicts);
    } else {
      conflictWarnings.set([]);
    }
  };

  const clearReconnectResult = (queueId) => {
    reconnectResults.update(results => {
      const newResults = { ...results };
      delete newResults[queueId];
      return newResults;
    });
  };

  return {
    subscribe,
    set,
    update,
    addToQueue,
    removeFromQueue,
    updateQueueStatus,
    getQueueByGameId,
    syncWithServer,
    markAsOffline,
    setOnlineStatus,
    refreshAllMissRisk,
    checkConflicts,
    clearReconnectResult,
    offlineCredentials,
    syncStatus,
    reconnectResults,
    conflictWarnings
  };
};

export const myQueue = createQueueStore();

export const activeQueue = derived(myQueue, $queue => 
  $queue.filter(q => q.status === 'waiting' || q.status === 'ready' || q.status === 'suspended')
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

export const highRiskQueue = derived(myQueue, $queue => 
  $queue.filter(q => q.status === 'waiting' && q.missRisk === 'high')
);
