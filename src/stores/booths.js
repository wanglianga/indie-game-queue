import { writable, derived } from 'svelte/store';
import { booths as initialBooths } from '../data/mockData.js';

const createBoothsStore = () => {
  const { subscribe, set, update } = writable(initialBooths);

  const getBoothById = (boothId) => {
    let booth;
    subscribe(b => booth = b.find(item => item.id === boothId))();
    return booth;
  };

  const getNearbyBooths = (x, y, radius = 15) => {
    let nearby = [];
    subscribe(booths => {
      nearby = booths.filter(booth => {
        const dx = (booth.x + booth.width / 2) - x;
        const dy = (booth.y + booth.height / 2) - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= radius;
      });
    })();
    return nearby;
  };

  const updateCrowdLevel = (boothId, crowdLevel) => {
    update(booths => 
      booths.map(booth => 
        booth.id === boothId ? { ...booth, crowdLevel } : booth
      )
    );
  };

  return {
    subscribe,
    set,
    update,
    getBoothById,
    getNearbyBooths,
    updateCrowdLevel
  };
};

export const booths = createBoothsStore();

export const crowdZones = writable([
  { id: 'zone-a', name: 'A区', level: 'high', count: 120 },
  { id: 'zone-b', name: 'B区', level: 'medium', count: 85 },
  { id: 'zone-c', name: 'C区', level: 'medium', count: 75 },
  { id: 'zone-d', name: 'D区', level: 'high', count: 110 }
]);

export const boothsByZone = derived(booths, $booths => {
  const zones = {};
  $booths.forEach(booth => {
    const zone = booth.zone || '其他';
    if (!zones[zone]) zones[zone] = [];
    zones[zone].push(booth);
  });
  return zones;
});

export const highCrowdBooths = derived(booths, $booths => 
  $booths.filter(b => b.crowdLevel === 'high')
);

export const boothsWithGames = derived(booths, $booths => 
  $booths.filter(b => b.gameId)
);
