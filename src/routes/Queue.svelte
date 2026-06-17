<script>
  import { push } from '../utils/router.js';
  import { Clock, ChevronRight, AlertTriangle, X, MapPin } from '@lucide/svelte';
  import { myQueue, activeQueue, queueHistory } from '../stores/queue.js';
  import { games } from '../stores/games.js';
  import { booths } from '../stores/booths.js';

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  };

  const getGame = (gameId) => {
    let game;
    games.subscribe(g => game = g.find(item => item.id === gameId))();
    return game;
  };

  const getBooth = (boothId) => {
    let booth;
    booths.subscribe(b => booth = b.find(item => item.id === boothId))();
    return booth;
  };

  const cancelQueue = (queueId) => {
    myQueue.removeFromQueue(queueId);
  };

  const viewGame = (gameId) => {
    push(`/game/${gameId}`);
  };
</script>

<div class="queue-page">
  <div class="page-header">
    <h1 class="page-title">我的排队</h1>
  </div>

  {#if $activeQueue.length === 0}
    <div class="empty-state">
      <Clock class="empty-icon" />
      <h2 class="empty-title">暂无排队</h2>
      <p class="empty-desc">浏览游戏列表，添加你想玩的游戏到排队</p>
      <button class="browse-btn" on:click={() => push('/games')}>
        去浏览游戏
      </button>
    </div>
  {:else}
    <div class="queue-list">
      {#each $activeQueue as item (item.id)}
        <div class="queue-card">
          <div class="queue-header">
            <div class="queue-number-badge">
              <span class="queue-number-label">你的号码</span>
              <span class="queue-number">A{item.queueNumber}</span>
            </div>
            <div class="queue-status waiting">
              <span class="status-dot"></span>
              排队中
            </div>
          </div>

          <div class="queue-game-info" on:click={() => viewGame(item.gameId)}>
            {#if getGame(item.gameId)}
              <img 
                src={getGame(item.gameId).cover} 
                alt="" 
                class="game-thumb"
              />
            {/if}
            <div class="game-meta">
              <h3 class="game-name">{item.gameName}</h3>
              {#if getGame(item.gameId)}
                <div class="game-location">
                  <MapPin class="location-icon" />
                  <span>{getBooth(getGame(item.gameId).boothId)?.name || '未知展位'}</span>
                </div>
              {/if}
            </div>
            <ChevronRight class="arrow-icon" />
          </div>

          <div class="queue-stats">
            <div class="stat">
              <span class="stat-value">
                {#if getGame(item.gameId)}
                  A{getGame(item.gameId).currentNumber}
                {/if}
              </span>
              <span class="stat-label">当前叫号</span>
            </div>
            <div class="stat">
              <span class="stat-value">{item.estimatedWaitMinutes} 分钟</span>
              <span class="stat-label">预计等待</span>
            </div>
            <div class="stat">
              <span class="stat-value">{formatTime(item.joinTime)}</span>
              <span class="stat-label">排队时间</span>
            </div>
          </div>

          <div class="queue-actions">
            <button class="cancel-btn" on:click={() => cancelQueue(item.id)}>
              <X class="btn-icon" />
              取消排队
            </button>
          </div>

          <div class="cancel-warning">
            <AlertTriangle class="warning-icon" />
            <span>取消后需重新排队，预计等待时间会更长</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if $queueHistory.length > 0}
    <div class="history-section">
      <h2 class="section-title">历史记录</h2>
      <div class="history-list">
        {#each $queueHistory.slice(0, 5) as item}
          <div class="history-item">
            <span class="history-name">{item.gameName}</span>
            <span class="history-status {item.status}">
              {item.status === 'completed' ? '已完成' : '已取消'}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .queue-page {
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

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 20px;
    text-align: center;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    color: #333;
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #888;
    margin: 0 0 8px;
  }

  .empty-desc {
    font-size: 14px;
    color: #666;
    margin: 0 0 24px;
  }

  .browse-btn {
    padding: 12px 32px;
    background: linear-gradient(135deg, #00ffff, #0080ff);
    color: #000;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }

  .queue-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 16px;
  }

  .queue-card {
    padding: 20px;
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.08) 0%, rgba(255, 0, 255, 0.08) 100%);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 16px;
  }

  .queue-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .queue-number-badge {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .queue-number-label {
    font-size: 12px;
    color: #888;
  }

  .queue-number {
    font-size: 28px;
    font-weight: 700;
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  .queue-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 20px;
  }

  .queue-status.waiting {
    background: rgba(255, 170, 0, 0.15);
    color: #ffaa00;
  }

  .queue-status.ready {
    background: rgba(0, 255, 136, 0.15);
    color: #00ff88;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: blink 1.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .queue-game-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 16px;
  }

  .game-thumb {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
  }

  .game-meta {
    flex: 1;
    min-width: 0;
  }

  .game-name {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .game-location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #888;
  }

  .location-icon {
    width: 12px;
    height: 12px;
  }

  .arrow-icon {
    width: 18px;
    height: 18px;
    color: #666;
    flex-shrink: 0;
  }

  .queue-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .stat {
    text-align: center;
    padding: 10px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
  }

  .stat-value {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 11px;
    color: #888;
  }

  .queue-actions {
    margin-bottom: 10px;
  }

  .cancel-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    background: rgba(255, 51, 102, 0.15);
    border: 1px solid rgba(255, 51, 102, 0.4);
    color: #ff3366;
    font-size: 14px;
    font-weight: 500;
    border-radius: 10px;
    cursor: pointer;
  }

  .btn-icon {
    width: 16px;
    height: 16px;
  }

  .cancel-warning {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
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

  .history-section {
    padding: 24px 16px 0;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #888;
    margin: 0 0 12px;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
  }

  .history-name {
    font-size: 14px;
    color: #666;
  }

  .history-status {
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 6px;
  }

  .history-status.completed {
    background: rgba(0, 255, 136, 0.1);
    color: #00ff88;
  }

  .history-status.cancelled {
    background: rgba(255, 51, 102, 0.1);
    color: #ff3366;
  }
</style>
