<script>
  import { push } from '../utils/router.js';
  import { Heart, Gamepad2, Calendar, MapPin, Trash2 } from '@lucide/svelte';
  import { favorites, favoriteGames, favoriteEvents, favoriteBooths } from '../stores/favorites.js';
  import { games } from '../stores/games.js';
  import { events } from '../stores/events.js';

  let activeTab = 'games';

  const tabs = [
    { id: 'games', label: '游戏', icon: Gamepad2 },
    { id: 'events', label: '活动', icon: Calendar },
    { id: 'booths', label: '展位', icon: MapPin }
  ];

  const getGame = (gameId) => {
    let game;
    games.subscribe(g => game = g.find(item => item.id === gameId))();
    return game;
  };

  const getEvent = (eventId) => {
    let event;
    events.subscribe(e => event = e.find(item => item.id === eventId))();
    return event;
  };

  const removeFavorite = (itemId, itemType) => {
    favorites.toggleFavorite(itemId, itemType);
  };
</script>

<div class="favorites-page">
  <div class="page-header">
    <h1 class="page-title">我的收藏</h1>
    <span class="fav-count">{$favorites.length} 项</span>
  </div>

  <div class="tabs">
    {#each tabs as tab}
      <button 
        class="tab-btn {activeTab === tab.id ? 'active' : ''}"
        on:click={() => activeTab = tab.id}
      >
        <svelte:component this={tab.icon} class="tab-icon" />
        <span class="tab-label">{tab.label}</span>
      </button>
    {/each}
  </div>

  <div class="tab-content">
    {#if activeTab === 'games'}
      {#if $favoriteGames.length === 0}
        <div class="empty-state">
          <Heart class="empty-icon" />
          <p class="empty-text">还没有收藏的游戏</p>
          <button class="action-btn" on:click={() => push('/games')}>
            去发现游戏
          </button>
        </div>
      {:else}
        <div class="fav-list">
          {#each $favoriteGames as fav}
            <div class="fav-item" on:click={() => push(`/game/${fav.id}`)}>
              {#if getGame(fav.id)}
                <img src={getGame(fav.id).cover} alt="" class="fav-cover" />
                <div class="fav-info">
                  <h3 class="fav-name">{fav.name}</h3>
                  <p class="fav-desc">{getGame(fav.id).developer}</p>
                  <div class="fav-meta">
                    <span class="meta-item">{getGame(fav.id).queueCount} 人排队</span>
                    <span class="meta-item">{getGame(fav.id).demoDuration} 分钟</span>
                  </div>
                </div>
              {/if}
              <button 
                class="remove-btn" 
                on:click|stopPropagation={() => removeFavorite(fav.id, 'game')}
              >
                <Trash2 class="remove-icon" />
              </button>
            </div>
          {/each}
        </div>
      {/if}
    {:else if activeTab === 'events'}
      {#if $favoriteEvents.length === 0}
        <div class="empty-state">
          <Calendar class="empty-icon" />
          <p class="empty-text">还没有收藏的活动</p>
          <button class="action-btn" on:click={() => push('/events')}>
            去查看活动
          </button>
        </div>
      {:else}
        <div class="fav-list">
          {#each $favoriteEvents as fav}
            <div class="fav-item">
              <div class="fav-info">
                <h3 class="fav-name">{fav.title || '活动'}</h3>
                <p class="fav-desc">{fav.location || '主舞台'}</p>
              </div>
              <button 
                class="remove-btn" 
                on:click={() => removeFavorite(fav.id, 'event')}
              >
                <Trash2 class="remove-icon" />
              </button>
            </div>
          {/each}
        </div>
      {/if}
    {:else}
      {#if $favoriteBooths.length === 0}
        <div class="empty-state">
          <MapPin class="empty-icon" />
          <p class="empty-text">还没有收藏的展位</p>
          <button class="action-btn" on:click={() => push('/map')}>
            去查看地图
          </button>
        </div>
      {:else}
        <div class="fav-list">
          {#each $favoriteBooths as fav}
            <div class="fav-item">
              <div class="fav-info">
                <h3 class="fav-name">{fav.name || '展位'}</h3>
                <p class="fav-desc">{fav.zone || ''}</p>
              </div>
              <button 
                class="remove-btn" 
                on:click={() => removeFavorite(fav.id, 'booth')}
              >
                <Trash2 class="remove-icon" />
              </button>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .favorites-page {
    min-height: 100vh;
    padding-bottom: 90px;
    background: #0a0a14;
  }

  .page-header {
    padding: 20px 16px 12px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  .fav-count {
    font-size: 14px;
    color: #888;
  }

  .tabs {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
  }

  .tab-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #888;
    border-radius: 10px;
    cursor: pointer;
  }

  .tab-btn.active {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.4);
    color: #00ffff;
  }

  .tab-icon {
    width: 20px;
    height: 20px;
  }

  .tab-label {
    font-size: 11px;
  }

  .tab-content {
    padding: 0 16px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    text-align: center;
  }

  .empty-icon {
    width: 48px;
    height: 48px;
    color: #333;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 14px;
    color: #666;
    margin: 0 0 20px;
  }

  .action-btn {
    padding: 10px 24px;
    background: linear-gradient(135deg, #00ffff, #0080ff);
    color: #000;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .fav-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .fav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    cursor: pointer;
  }

  .fav-cover {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .fav-info {
    flex: 1;
    min-width: 0;
  }

  .fav-name {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fav-desc {
    font-size: 12px;
    color: #888;
    margin: 0 0 6px;
  }

  .fav-meta {
    display: flex;
    gap: 12px;
  }

  .meta-item {
    font-size: 11px;
    color: #666;
  }

  .remove-btn {
    width: 36px;
    height: 36px;
    background: rgba(255, 51, 102, 0.1);
    border: none;
    color: #ff3366;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .remove-icon {
    width: 16px;
    height: 16px;
  }
</style>
