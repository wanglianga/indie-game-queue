<script>
  import { onMount, onDestroy } from 'svelte';
  import Router from 'svelte-spa-router';
  import routes from './routes.js';
  import BottomNav from './components/layout/BottomNav.svelte';

  let currentPath = '';
  let isAdminPage = false;

  const updatePath = () => {
    const hash = window.location.hash || '#/';
    currentPath = hash.replace('#', '');
    isAdminPage = currentPath.startsWith('/admin');
  };

  onMount(() => {
    updatePath();
    window.addEventListener('hashchange', updatePath);
  });

  onDestroy(() => {
    window.removeEventListener('hashchange', updatePath);
  });
</script>

<div class="app-container">
  <main class="main-content">
    <Router {routes} />
  </main>
  
  {#if !isAdminPage}
    <BottomNav />
  {/if}
</div>

<style>
  .app-container {
    min-height: 100vh;
    background: #0a0a14;
  }

  .main-content {
    min-height: 100vh;
  }

  :global(*) {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #0a0a14;
    color: #fff;
    overflow-x: hidden;
  }

  :global(#app) {
    width: 100%;
    max-width: 100%;
    margin: 0;
    text-align: left;
    border: none;
    min-height: 100svh;
    display: block;
  }

  :global(img) {
    max-width: 100%;
    display: block;
  }

  :global(button) {
    font-family: inherit;
  }

  :global(input) {
    font-family: inherit;
  }

  :global(a) {
    color: inherit;
    text-decoration: none;
  }
</style>
