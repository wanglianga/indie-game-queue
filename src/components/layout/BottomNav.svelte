<script>
  import { Map, List, Clock, Calendar, Heart } from '@lucide/svelte';
  import { link } from 'svelte-spa-router';
  import { queueCount } from '../../stores/queue.js';
  import { ui } from '../../stores/ui.js';
</script>

<nav class="bottom-nav">
  <a href="/" use:link class="nav-item">
    <div class="nav-icon-wrapper">
      <Map class="nav-icon" />
    </div>
    <span class="nav-label">首页</span>
  </a>
  
  <a href="/games" use:link class="nav-item">
    <div class="nav-icon-wrapper">
      <List class="nav-icon" />
    </div>
    <span class="nav-label">列表</span>
  </a>
  
  <a href="/queue" use:link class="nav-item">
    <div class="nav-icon-wrapper">
      <Clock class="nav-icon" />
      {#if $queueCount > 0}
        <span class="badge">{$queueCount}</span>
      {/if}
    </div>
    <span class="nav-label">排队</span>
  </a>
  
  <a href="#/events" class="nav-item">
    <div class="nav-icon-wrapper">
      <Calendar class="nav-icon" />
    </div>
    <span class="nav-label">活动</span>
  </a>
  
  <a href="#/favorites" class="nav-item">
    <div class="nav-icon-wrapper">
      <Heart class="nav-icon" />
    </div>
    <span class="nav-label">收藏</span>
  </a>
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: rgba(10, 10, 20, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 255, 255, 0.2);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 20%;
    height: 100%;
    color: #666;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .nav-item:active {
    transform: scale(0.95);
  }

  :global(.is-active) .nav-item,
  .nav-item:global(.active) {
    color: #00ffff;
  }

  :global(.is-active) .nav-icon-wrapper,
  .nav-item:global(.active) .nav-icon-wrapper {
    filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.8));
  }

  .nav-icon-wrapper {
    position: relative;
    width: 28px;
    height: 28px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-icon {
    width: 24px;
    height: 24px;
    stroke-width: 1.5;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -8px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    background: #ff3366;
    color: white;
    font-size: 10px;
    font-weight: bold;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(255, 51, 102, 0.6);
  }
</style>
