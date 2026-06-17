import { writable, derived } from 'svelte/store';
import { events as initialEvents, signings as initialSignings } from '../data/mockData.js';

const createEventsStore = () => {
  const { subscribe, set, update } = writable(initialEvents);

  const getUpcomingEvents = () => {
    let events;
    subscribe(e => events = e.filter(ev => ev.status === 'upcoming')
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    )();
    return events;
  };

  const getOngoingEvents = () => {
    let events;
    subscribe(e => events = e.filter(ev => ev.status === 'ongoing'))();
    return events;
  };

  const updateEventStatus = (eventId, status) => {
    update(events => 
      events.map(ev => ev.id === eventId ? { ...ev, status } : ev)
    );
  };

  return {
    subscribe,
    set,
    update,
    getUpcomingEvents,
    getOngoingEvents,
    updateEventStatus
  };
};

export const events = createEventsStore();

const createSigningsStore = () => {
  const { subscribe, set, update } = writable(initialSignings);

  const updateSigningStatus = (signingId, status) => {
    update(signings => 
      signings.map(s => s.id === signingId ? { ...s, status } : s)
    );
  };

  const joinSigningQueue = (signingId) => {
    update(signings => 
      signings.map(s => 
        s.id === signingId && s.queueCount < s.maxQueue
          ? { ...s, queueCount: s.queueCount + 1 }
          : s
      )
    );
  };

  return {
    subscribe,
    set,
    update,
    updateSigningStatus,
    joinSigningQueue
  };
};

export const signings = createSigningsStore();

export const upcomingEvents = derived(events, $events => 
  $events.filter(e => e.status === 'upcoming')
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
);

export const ongoingEvents = derived(events, $events => 
  $events.filter(e => e.status === 'ongoing')
);

export const eventsByType = derived(events, $events => {
  const types = {};
  $events.forEach(event => {
    if (!types[event.type]) types[event.type] = [];
    types[event.type].push(event);
  });
  return types;
});

export const upcomingSignings = derived(signings, $signings => 
  $signings.filter(s => s.status === 'upcoming')
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
);

export const ongoingSignings = derived(signings, $signings => 
  $signings.filter(s => s.status === 'ongoing')
);

export const nextEvents = derived([upcomingEvents, upcomingSignings], 
  ([$upcomingEvents, $upcomingSignings]) => {
    const combined = [
      ...$upcomingEvents.slice(0, 3).map(e => ({ ...e, typeLabel: '活动', category: 'event' })),
      ...$upcomingSignings.slice(0, 3).map(s => ({ ...s, typeLabel: '签售', category: 'signing', title: s.gameName + ' 签售' }))
    ];
    return combined
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);
  }
);
