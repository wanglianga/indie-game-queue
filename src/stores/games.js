import { writable, derived } from 'svelte/store';
import { games as initialGames } from '../data/mockData.js';

const createGamesStore = () => {
  const { subscribe, set, update } = writable(initialGames);

  const joinQueue = (gameId) => {
    update(games => 
      games.map(game => 
        game.id === gameId 
          ? { ...game, queueCount: game.queueCount + 1 }
          : game
      )
    );
  };

  const leaveQueue = (gameId) => {
    update(games => 
      games.map(game => 
        game.id === gameId && game.queueCount > 0
          ? { ...game, queueCount: game.queueCount - 1 }
          : game
      )
    );
  };

  const updateGameStatus = (gameId, status) => {
    update(games => 
      games.map(game => 
        game.id === gameId ? { ...game, status } : game
      )
    );
  };

  const addStation = (gameId, station) => {
    update(games => 
      games.map(game => 
        game.id === gameId 
          ? { ...game, stations: [...game.stations, station] }
          : game
      )
    );
  };

  const updateStationStatus = (gameId, stationId, status) => {
    update(games => 
      games.map(game => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          stations: game.stations.map(st => 
            st.id === stationId ? { ...st, status } : st
          )
        };
      })
    );
  };

  const callNextNumber = (gameId) => {
    update(games => 
      games.map(game => 
        game.id === gameId && game.queueCount > 0
          ? { 
              ...game, 
              currentNumber: game.currentNumber + 1,
              queueCount: game.queueCount - 1
            }
          : game
      )
    );
  };

  const getGameById = (gameId) => {
    let game;
    subscribe(g => game = g.find(item => item.id === gameId))();
    return game;
  };

  return {
    subscribe,
    set,
    update,
    joinQueue,
    leaveQueue,
    updateGameStatus,
    addStation,
    updateStationStatus,
    callNextNumber,
    getGameById
  };
};

export const games = createGamesStore();

export const availableGames = derived(games, $games => 
  $games.filter(g => g.status === 'available')
);

export const playingGames = derived(games, $games => 
  $games.filter(g => g.stations.some(s => s.status === 'playing'))
);

export const gamesByZone = derived(games, $games => {
  const zones = {};
  $games.forEach(game => {
    const zone = game.boothId?.split('-')[1]?.[0]?.toUpperCase() + '区' || '其他';
    if (!zones[zone]) zones[zone] = [];
    zones[zone].push(game);
  });
  return zones;
});

export const highQueueGames = derived(games, $games => 
  [...$games].sort((a, b) => b.queueCount - a.queueCount).slice(0, 5)
);
