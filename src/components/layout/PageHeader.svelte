<script>
  import { ChevronLeft, Settings } from '@lucide/svelte';
  import { push } from '../../utils/router.js';

  export let title = '';
  export let showBack = false;
  export let showSettings = true;

  const goBack = () => {
    history.back();
  };

  const goSettings = () => {
    push('/settings');
  };
</script>

<header class="page-header">
  <div class="header-left">
    {#if showBack}
      <button class="icon-btn" on:click={goBack}>
        <ChevronLeft class="icon" />
      </button>
    {/if}
    <h1 class="title">{title}</h1>
  </div>
  <div class="header-right">
    {#if showSettings}
      <button class="icon-btn" on:click={goSettings}>
        <Settings class="icon" />
      </button>
    {/if}
  </div>
</header>

<style>
  .page-header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: rgba(10, 10, 20, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 50;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: #00ffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .icon-btn:hover {
    background: rgba(0, 255, 255, 0.1);
  }

  .icon-btn:active {
    transform: scale(0.95);
  }

  .icon {
    width: 22px;
    height: 22px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
</style>
