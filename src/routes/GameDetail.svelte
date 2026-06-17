<script>
  import { push } from '../utils/router.js';
  import { ChevronLeft, Heart, Users, Clock, Monitor, MapPin, AlertTriangle } from '@lucide/svelte';
  import { games } from '../stores/games.js';
  import { myQueue, queueCount } from '../stores/queue.js';
  import { favorites } from '../stores/favorites.js';
  import { booths } from '../stores/booths.js';

  export let params = {};

  const gameId = params.id;

  $: game = $games.find(g => g.id === gameId);
  
  $: isFav = $favorites.some(f => f.id === gameId && f.type === 'game');
  
  $: booth = $booths.find(b => b.id === game?.boothId);
  
  $: inQueue = $myQueue.some(q => q.gameId === gameId && q.status === 'waiting');
  $: myQueueItem = $myQueue.find(q => q.gameId === gameId && q.status === 'waiting');
  
  $: availableStations = game?.stations.filter(s => s.status === 'playing').length || 0;
  $: totalStations = game?.stations.length || 0;
  
  $: estimatedWait = game 
    ? Math.round(game.queueCount * game.demoDuration / Math.max(1, availableStations))
    : 0;

  const toggleFav = () => {
    favorites.toggleFavorite(gameId, 'game', { 
      name: game.name, 
      cover: game.cover,
      developer: game.developer 
    });
  };

  const joinGameQueue = () => {
    if (game && !inQueue) {
      myQueue.addToQueue(game.id, game.name);
    }
  };

  const leaveGameQueue = () => {
    if (myQueueItem) {
      myQueue.removeFromQueue(myQueueItem.id);
    }
  };

  const goToMap = () => {
    push('/map');
  };
</script>

{#if game}
  <div class="game-detail-page">
    <div class="game-header">
      <button class="back-btn" on:click={() => history.back()}>
        <ChevronLeft class="back-icon" />
      </button>
      <button class="fav-btn {isFav ? 'active' : ''}" on:click={toggleFav}>
        <Heart class="fav-icon" fill={isFav ? 'currentColor' : 'none'} />
      </button>
    </div>

    <div class="cover-section">
      <img src={game.cover} alt={game.name} class="game-cover-large" />
      <div class="cover-glow"></div>
    </div>

    <div class="game-info-section">
      <div class="game-title-row">
        <h1 class="game-title">{game.name}</h1>
        <span class="status-badge {game.status}">
          {game.status === 'available' ? '开放' : game.status === 'limited' ? '限时' : '维护'}
        </span>
      </div>
      
      <p class="game-developer">{game.developer}</p>
      
      <div class="game-tags">
        {#each game.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>

      <p class="game-description">{game.description}</p>
    </div>

    <div class="info-cards">
      <div class="info-card">
        <Users class="info-card-icon" />
        <div class="info-card-content">
          <span class="info-card-value">{game.queueCount}</span>
          <span class="info-card-label">人排队</span>
        </div>
      </div>
      <div class="info-card">
        <Clock class="info-card-icon" />
        <div class="info-card-content">
          <span class="info-card-value">{game.demoDuration}分钟</span>
          <span class="info-card-label">试玩时长</span>
        </div>
      </div>
      <div class="info-card">
        <Monitor class="info-card-icon" />
        <div class="info-card-content">
          <span class="info-card-value">{availableStations}/{totalStations}</span>
          <span class="info-card-label">可用机位</span>
        </div>
      </div>
    </div>

    {#if booth}
      <div class="location-card" on:click={goToMap}>
        <MapPin class="location-icon" />
        <div class="location-info">
          <span class="location-name">{booth.name}</span>
          <span class="location-zone">{booth.zone}</span>
        </div>
        <ChevronLeft class="location-arrow" />
      </div>
    {/if}

    <div class="stations-section">
      <h2 class="section-title">试玩机位</h2>
      <div class="stations-grid">
        {#each game.stations as station}
          <div class="station-card {station.status}">
            <span class="station-name">{station.name}</span>
            <span class="station-status">
              {station.status === 'playing' ? '使用中' : 
               station.status === 'available' ? '空闲' : 
               station.status === 'maintenance' ? '维护中' : '暂停'}
            </span>
            {#if station.currentPlayer}
              <span class="station-player">{station.currentPlayer}</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    {#if inQueue && myQueueItem}
      <div class="my-queue-card">
        <div class="mq-header">
          <Clock class="mq-icon pulse" />
          <span class="mq-title">你正在排队</span>
        </div>
        <div class="mq-number">
          <span class="mq-number-label">你的号码</span>
          <span class="mq-number-value">A{myQueueItem.queueNumber}</span>
        </div>
        <div class="mq-estimate">
          <span>预计等待约 {myQueueItem.estimatedWaitMinutes} 分钟</span>
          <span>当前叫号: A{game.currentNumber}</span>
        </div>
        <button class="cancel-btn" on:click={leaveGameQueue}>
          取消排队
        </button>
        <div class="cancel-warning">
          <AlertTriangle class="warning-icon" />
          <span>取消后需重新排队，可能需要等待更久</span>
        </div>
      </div>
    {:else if game.status !== 'maintenance'}
      <div class="queue-cta">
        <button class="join-queue-btn" on:click={joinGameQueue}>
          加入排队
        </button>
        <p class="queue-estimate">预计等待约 {estimatedWait} 分钟</p>
      </div>
    {/if}
  </div>
{:else}
  <div class="loading-state">
    <p>加载中...</p>
  </div>
{/if}

<style>
  .game-detail-page {
    min-height: 100vh;
    padding-bottom: 120px;
    background: #0a0a14;
  }

  .game-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    background: linear-gradient(180deg, rgba(10, 10, 20, 0.9) 0%, transparent 100%);
    z-index: 10;
  }

  .back-btn, .fav-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fav-btn.active {
    color: #ff3366;
  }

  .back-icon, .fav-icon {
    width: 22px;
    height: 22px;
  }

  .cover-section {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
  }

  .game-cover-large {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cover-glow {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to top, #0a0a14, transparent);
  }

  .game-info-section {
    padding: 0 16px 20px;
    margin-top: -40px;
    position: relative;
    z-index: 2;
  }

  .game-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .game-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .status-badge {
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .status-badge.available {
    background: rgba(0, 255, 136, 0.2);
    color: #00ff88;
  }

  .status-badge.limited {
    background: rgba(255, 170, 0, 0.2);
    color: #ffaa00;
  }

  .status-badge.maintenance {
    background: rgba(102, 102, 102, 0.2);
    color: #888;
  }

  .game-developer {
    font-size: 14px;
    color: #888;
    margin: 0 0 12px;
  }

  .game-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .tag {
    padding: 4px 10px;
    background: rgba(0, 255, 255, 0.1);
    color: #00ffff;
    font-size: 12px;
    border-radius: 8px;
  }

  .game-description {
    font-size: 14px;
    color: #ccc;
    line-height: 1.6;
    margin: 0;
  }

  .info-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 0 16px 20px;
  }

  .info-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }

  .info-card-icon {
    width: 24px;
    height: 24px;
    color: #00ffff;
  }

  .info-card-content {
    text-align: center;
  }

  .info-card-value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }

  .info-card-label {
    font-size: 11px;
    color: #888;
  }

  .location-card {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 16px 20px;
    padding: 14px;
    background: rgba(255, 0, 255, 0.08);
    border: 1px solid rgba(255, 0, 255, 0.2);
    border-radius: 12px;
    cursor: pointer;
  }

  .location-icon {
    width: 20px;
    height: 20px;
    color: #ff00ff;
  }

  .location-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .location-name {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }

  .location-zone {
    font-size: 12px;
    color: #888;
  }

  .location-arrow {
    width: 18px;
    height: 18px;
    color: #888;
    transform: rotate(180deg);
  }

  .stations-section {
    padding: 0 16px 20px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 12px;
  }

  .stations-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .station-card {
    padding: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    text-align: center;
  }

  .station-card.playing {
    border-color: rgba(255, 51, 102, 0.4);
    background: rgba(255, 51, 102, 0.05);
  }

  .station-card.available {
    border-color: rgba(0, 255, 136, 0.4);
    background: rgba(0, 255, 136, 0.05);
  }

  .station-card.maintenance, .station-card.paused {
    opacity: 0.5;
  }

  .station-name {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
  }

  .station-status {
    display: block;
    font-size: 12px;
    color: #888;
    margin-bottom: 4px;
  }

  .station-card.playing .station-status {
    color: #ff3366;
  }

  .station-card.available .station-status {
    color: #00ff88;
  }

  .station-player {
    display: block;
    font-size: 11px;
    color: #666;
  }

  .my-queue-card {
    position: fixed;
    bottom: 80px;
    left: 16px;
    right: 16px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.15) 0%, rgba(255, 0, 255, 0.15) 100%);
    border: 1px solid rgba(0, 255, 255, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    z-index: 20;
  }

  .mq-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .mq-icon {
    width: 20px;
    height: 20px;
    color: #00ffff;
  }

  .mq-icon.pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .mq-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .mq-number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .mq-number-label {
    font-size: 14px;
    color: #888;
  }

  .mq-number-value {
    font-size: 32px;
    font-weight: 700;
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  .mq-estimate {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #ccc;
    margin-bottom: 16px;
  }

  .cancel-btn {
    width: 100%;
    padding: 12px;
    background: rgba(255, 51, 102, 0.2);
    border: 1px solid rgba(255, 51, 102, 0.5);
    color: #ff3366;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .cancel-warning {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
  }

  .warning-icon {
    width: 14px;
    height: 14px;
    color: #ffaa00;
  }

  .cancel-warning span {
    font-size: 11px;
    color: #888;
  }

  .queue-cta {
    position: fixed;
    bottom: 80px;
    left: 16px;
    right: 16px;
    padding: 16px;
    background: rgba(10, 10, 20, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 16px 16px 0 0;
    z-index: 20;
    text-align: center;
  }

  .join-queue-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #00ffff, #0080ff);
    color: #000;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-bottom: 8px;
  }

  .join-queue-btn:active {
    transform: scale(0.98);
  }

  .queue-estimate {
    font-size: 12px;
    color: #888;
    margin: 0;
  }

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    color: #888;
  }
</style>
