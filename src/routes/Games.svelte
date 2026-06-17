<script>
  import { push } from '../utils/router.js';
  import { Search, Users, Clock, Filter } from '@lucide/svelte';
  import { games, gamesByZone } from '../stores/games.js';

  let searchQuery = '';
  let selectedZone = 'all';
  let sortBy = 'queue';

  const zones = ['all', 'A区', 'B区', 'C区', 'D区'];
  const sortOptions = [
    { value: 'queue', label: '排队最多' },
    { value: 'name', label: '名称' },
    { value: 'duration', label: '试玩时长' }
  ];

  $: filteredGames = $games.filter(game => {
    if (searchQuery && !game.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !game.developer.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedZone !== 'all') {
      const gameZone = game.boothId?.split('-')[1]?.[0]?.toUpperCase() + '区';
      if (gameZone !== selectedZone) return false;
    }
    return true;
  });

  $: sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'queue':
        return b.queueCount - a.queueCount;
      case 'name':
        return a.name.localeCompare(b.name, 'zh-CN');
      case 'duration':
        return a.demoDuration - b.demoDuration;
      default:
        return 0;
    }
  });
</script>

<div class="games-page">
  <div class="page-header">
    <h1 class="page-title">游戏列表</h1>
  </div>

  <div class="search-bar">
    <div class="search-input-wrapper">
      <Search class="search-icon" />
      <input 
        type="text" 
        placeholder="搜索游戏或开发者..."
        bind:value={searchQuery}
        class="search-input"
      />
    </div>
    <button class="filter-btn">
      <Filter class="filter-icon" />
    </button>
  </div>

  <div class="filter-tabs">
    <div class="zone-filters">
      {#each zones as zone}
        <button 
          class="zone-btn {selectedZone === zone ? 'active' : ''}"
          on:click={() => selectedZone = zone}
        >
          {zone === 'all' ? '全部' : zone}
        </button>
      {/each}
    </div>
  </div>

  <div class="sort-bar">
    <span class="sort-label">排序：</span>
    <select bind:value={sortBy} class="sort-select">
      {#each sortOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    <span class="game-count">共 {sortedGames.length} 款</span>
  </div>

  <div class="games-list">
    {#each sortedGames as game}
      <div class="game-card" on:click={() => push(`/game/${game.id}`)}>
        <div class="game-cover-wrapper">
          <img src={game.cover} alt={game.name} class="game-cover" />
          <div class="game-status-badge {game.status}">
            {game.status === 'available' ? '开放' : game.status === 'limited' ? '限时' : '维护'}
          </div>
        </div>
        <div class="game-content">
          <h2 class="game-name">{game.name}</h2>
          <p class="game-developer">{game.developer}</p>
          <div class="game-tags">
            {#each game.tags.slice(0, 3) as tag}
              <span class="game-tag">{tag}</span>
            {/each}
          </div>
          <div class="game-footer">
            <div class="game-stat">
              <Users class="stat-icon" />
              <span class="stat-text">{game.queueCount} 人排队</span>
            </div>
            <div class="game-stat">
              <Clock class="stat-icon" />
              <span class="stat-text">{game.demoDuration} 分钟</span>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if sortedGames.length === 0}
    <div class="empty-state">
      <p class="empty-text">没有找到相关游戏</p>
    </div>
  {/if}
</div>

<style>
  .games-page {
    min-height: 100vh;
    padding-bottom: 90px;
    background: #0a0a14;
  }

  .page-header {
    padding: 20px 16px 12px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  .search-bar {
    display: flex;
    gap: 10px;
    padding: 0 16px 16px;
  }

  .search-input-wrapper {
    flex: 1;
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #666;
  }

  .search-input {
    width: 100%;
    height: 44px;
    padding: 0 16px 0 42px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #fff;
    font-size: 14px;
    box-sizing: border-box;
  }

  .search-input::placeholder {
    color: #666;
  }

  .search-input:focus {
    outline: none;
    border-color: #00ffff;
  }

  .filter-btn {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #00ffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .filter-icon {
    width: 20px;
    height: 20px;
  }

  .filter-tabs {
    padding: 0 16px 12px;
    overflow-x: auto;
  }

  .zone-filters {
    display: flex;
    gap: 8px;
  }

  .zone-btn {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #888;
    font-size: 13px;
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap;
  }

  .zone-btn.active {
    background: rgba(0, 255, 255, 0.15);
    border-color: #00ffff;
    color: #00ffff;
  }

  .sort-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px 12px;
  }

  .sort-label {
    font-size: 13px;
    color: #888;
  }

  .sort-select {
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 13px;
    border-radius: 8px;
  }

  .game-count {
    margin-left: auto;
    font-size: 12px;
    color: #666;
  }

  .games-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 16px;
  }

  .game-card {
    display: flex;
    gap: 14px;
    padding: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .game-card:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.06);
  }

  .game-cover-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .game-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .game-status-badge {
    position: absolute;
    top: 6px;
    left: 6px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 600;
    border-radius: 6px;
    backdrop-filter: blur(4px);
  }

  .game-status-badge.available {
    background: rgba(0, 255, 136, 0.9);
    color: #000;
  }

  .game-status-badge.limited {
    background: rgba(255, 170, 0, 0.9);
    color: #000;
  }

  .game-status-badge.maintenance {
    background: rgba(102, 102, 102, 0.9);
    color: #fff;
  }

  .game-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .game-name {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .game-developer {
    font-size: 12px;
    color: #888;
    margin: 0 0 8px;
  }

  .game-tags {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .game-tag {
    padding: 2px 8px;
    background: rgba(0, 255, 255, 0.1);
    color: #00ffff;
    font-size: 10px;
    border-radius: 6px;
  }

  .game-footer {
    display: flex;
    gap: 16px;
    margin-top: auto;
  }

  .game-stat {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .stat-icon {
    width: 14px;
    height: 14px;
    color: #666;
  }

  .stat-text {
    font-size: 12px;
    color: #888;
  }

  .empty-state {
    padding: 60px 20px;
    text-align: center;
  }

  .empty-text {
    font-size: 14px;
    color: #666;
  }
</style>
