import Home from './routes/Home.svelte';
import Map from './routes/Map.svelte';
import Games from './routes/Games.svelte';
import GameDetail from './routes/GameDetail.svelte';
import Queue from './routes/Queue.svelte';
import Favorites from './routes/Favorites.svelte';
import Events from './routes/Events.svelte';
import Signing from './routes/Signing.svelte';
import Dashboard from './routes/admin/Dashboard.svelte';
import Control from './routes/admin/Control.svelte';

const routes = {
  '/': Home,
  '/map': Map,
  '/games': Games,
  '/game/:id': GameDetail,
  '/queue': Queue,
  '/favorites': Favorites,
  '/events': Events,
  '/signing': Signing,
  '/admin': Dashboard,
  '/admin/control': Control,
  '*': Home
};

export default routes;
