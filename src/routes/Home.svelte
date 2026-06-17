<script>
  import { push } from '../utils/router.js';
  import { Map, List, Clock, Calendar, Users, Gamepad2, Star } from '@lucide/svelte';
  import { games, highQueueGames } from '../stores/games.js';
  import { queueCount, nextUpQueue } from '../stores/queue.js';
  import { crowdZones } from '../stores/booths.js';
  import { nextEvents } from '../stores/events.js';
  import { floorMap } from '../data/mockData.js';

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  };
</script>

<div class="home-page">
  <div class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">2026 独立游戏展</h1>
      <p class="hero-subtitle">Indie Game Expo</p>
      <div class="hero-stats">
        <div class="stat-item">
          <Gamepad2 class="stat-icon" />
          <span class="stat-value">{$games.length}</span>
          <span class="stat-label">款游戏</span>
        </div>
        <div class="stat-item">
          <Users class="stat-icon" />
          <span class="stat-value">
            {$crowdZones.reduce((sum, z) => sum + z.count, 0)}
          </span>
          <span class="stat-label">人在馆</span>
        </div>
      </div>
    </div>
    <div class="hero-glow"></div>
  </div>

  {#if $queueCount > 0}
    <div class="quick-queue-card" on:click={() => push('/queue')}>
      <div class="qq-header">
        <Clock class="qq-icon pulse" />
        <span class="qq-title">我的排队</span>
        <span class="qq-badge">{$queueCount} 个</span>
      </div>
      <div class="qq-content">
        {#each $nextUpQueue.slice(0, 2) as item}
          <div class="qq-item">
            <span class="qq-game">{item.gameName}</span>
            <span class="qq-number">第 {item.queueNumber} 号</span>
            <span class="qq-time">约 {item.estimatedWaitMinutes} 分钟</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="quick-actions">
    <button class="action-card" on:click={() => push('/map')}>
      <div class="action-icon map-icon">
        <Map class="icon" />
      </div>
      <span class="action-label">楼层地图</span>
    </button>
    <button class="action-card" on:click={() => push('/games')}>
      <div class="action-icon list-icon">
        <List class="icon" />
      </div>
      <span class="action-label">游戏列表</span>
    </button>
    <button class="action-card" on:click={() => push('/events')}>
      <div class="action-icon event-icon">
        <Calendar class="icon" />
      </div>
      <span class="action-label">舞台活动</span>
    </button>
    <button class="action-card" on:click={() => push('/signing')}>
      <div class="action-icon sign-icon">
        <Star class="icon" />
      </div>
      <span class="action-label">开发者签售</span>
    </button>
  </div>

  <div class="section">
    <div class="section-header">
      <h2 class="section-title">即将开始</h2>
      <button class="see-all" on:click={() => push('/events')}>查看全部</button>
    </div>
    <div class="event-list">
      {#each $nextEvents.slice(0, 3) as event}
        <div class="event-card">
          <div class="event-time">
            <span class="time-start">{formatTime(event.startTime)}</span>
            <span class="event-type-tag">{event.typeLabel}</span>
          </div>
          <div class="event-info">
            <h3 class="event-name">{event.title}</h3>
            <p class="event-location">{event.location || event.boothId}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2 class="section-title">热门排队</h2>
      <button class="see-all" on:click={() => push('/games')}>更多</button>
    </div>
    <div class="hot-games">
      {#each $highQueueGames.slice(0, 4) as game}
        <div class="hot-game-card" on:click={() => push(`/game/${game.id}`)}>
          <div class="game-cover-wrapper">
            <img src={game.cover} alt={game.name} class="game-cover" />
            <div class="queue-badge">
              <Users class="badge-icon" />
              {game.queueCount}
            </div>
          </div>
          <div class="game-info">
            <h3 class="game-name">{game.name}</h3>
            <p class="game-genre">{game.genre}</p>
            <div class="game-meta">
              <span class="demo-time">{game.demoDuration}分钟</span>
              <span class="station-count">{game.stations.filter(s => s.status === 'playing').length}台</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="crowd-overview">
    <h2 class="section-title">人流概况</h2>
    <div class="crowd-zones">
      {#each $crowdZones as zone}
        <div class="crowd-zone {zone.level}">
          <span class="zone-name">{zone.name}</span>
          <span class="zone-count">{zone.count}人</span>
          <div class="zone-bar">
            <div class="zone-fill" style="width: {Math.min(100, zone.count / 2)}%"></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .home-page {
    min-height: 100vh;
    padding-bottom: 90px;
    background: linear-gradient(180deg, #0a0a14 0%, #0d0d1a 100%);
  }

  .hero-section {
    position: relative;
    padding: 40px 20px 30px;
    overflow: hidden;
  }

  .hero-glow {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 4px;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  .hero-subtitle {
    font-size: 14px;
    color: #00ffff;
    margin: 0 0 20px;
    letter-spacing: 2px;
  }

  .hero-stats {
    display: flex;
    gap: 24px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stat-icon {
    width: 20px;
    height: 20px;
    color: #00ffff;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }

  .stat-label {
    font-size: 12px;
    color: #888;
  }

  .quick-queue-card {
    margin: 0 16px 20px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .quick-queue-card:active {
    transform: scale(0.98);
  }

  .qq-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .qq-icon {
    width: 20px;
    height: 20px;
    color: #00ffff;
  }

  .qq-icon.pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .qq-title {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .qq-badge {
    padding: 4px 10px;
    background: #ff3366;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    border-radius: 12px;
  }

  .qq-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .qq-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .qq-game {
    flex: 1;
    font-size: 14px;
    color: #fff;
  }

  .qq-number {
    font-size: 14px;
    font-weight: 600;
    color: #00ffff;
  }

  .qq-time {
    font-size: 12px;
    color: #888;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 0 16px 24px;
  }

  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-card:active {
    transform: scale(0.95);
  }

  .action-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .map-icon {
    background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
  }

  .list-icon {
    background: linear-gradient(135deg, #ff00ff 0%, #8000ff 100%);
  }

  .event-icon {
    background: linear-gradient(135deg, #ffaa00 0%, #ff6600 100%);
  }

  .sign-icon {
    background: linear-gradient(135deg, #00ff88 0%, #00aa55 100%);
  }

  .icon {
    width: 22px;
    height: 22px;
    color: #fff;
  }

  .action-label {
    font-size: 12px;
    color: #ccc;
  }

  .section {
    padding: 0 16px 24px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 12px;
  }

  .section-header .section-title {
    margin-bottom: 0;
  }

  .see-all {
    font-size: 12px;
    color: #00ffff;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
  }

  .event-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .event-card {
    display: flex;
    gap: 16px;
    padding: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }

  .event-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 60px;
  }

  .time-start {
    font-size: 18px;
    font-weight: 700;
    color: #00ffff;
  }

  .event-type-tag {
    padding: 2px 8px;
    background: rgba(0, 255, 255, 0.2);
    color: #00ffff;
    font-size: 10px;
    border-radius: 8px;
  }

  .event-info {
    flex: 1;
  }

  .event-name {
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 4px;
  }

  .event-location {
    font-size: 12px;
    color: #888;
    margin: 0;
  }

  .hot-games {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .hot-game-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .hot-game-card:active {
    transform: scale(0.97);
  }

  .game-cover-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%;
  }

  .game-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .queue-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: rgba(255, 51, 102, 0.9);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    border-radius: 12px;
    backdrop-filter: blur(4px);
  }

  .badge-icon {
    width: 12px;
    height: 12px;
  }

  .game-info {
    padding: 10px;
  }

  .game-name {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .game-genre {
    font-size: 11px;
    color: #888;
    margin: 0 0 6px;
  }

  .game-meta {
    display: flex;
    gap: 10px;
  }

  .demo-time, .station-count {
    font-size: 11px;
    color: #00ffff;
  }

  .crowd-overview {
    padding: 0 16px 24px;
  }

  .crowd-zones {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .crowd-zone {
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
  }

  .crowd-zone.high {
    border-left: 3px solid #ff3366;
  }

  .crowd-zone.medium {
    border-left: 3px solid #ffaa00;
  }

  .crowd-zone.low {
    border-left: 3px solid #00ff88;
  }

  .zone-name {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }

  .zone-count {
    float: right;
    font-size: 14px;
    font-weight: 600;
    color: #888;
  }

  .zone-bar {
    margin-top: 8px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .zone-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ffff, #ff00ff);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
</style>
