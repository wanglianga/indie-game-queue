<script>
  import { onMount, onDestroy } from 'svelte';
  import { push } from '../utils/router.js';
  import { Clock, ChevronRight, AlertTriangle, X, MapPin, Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, PauseCircle, Zap, User, Clock8 } from '@lucide/svelte';
  import { myQueue, activeQueue, queueHistory, highRiskQueue } from '../stores/queue.js';
  import { games } from '../stores/games.js';
  import { booths } from '../stores/booths.js';

  let refreshInterval = null;
  let conflictPanelOpen = false;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  };

  const formatRelativeTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    const hours = Math.floor(minutes / 60);
    return `${hours} 小时前`;
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

  const syncQueue = () => {
    myQueue.syncWithServer();
  };

  const dismissResult = (queueId) => {
    myQueue.clearReconnectResult(queueId);
  };

  const handleDelay = (queueId) => {
    cancelQueue(queueId);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return '#ff3366';
      case 'medium': return '#ffaa00';
      default: return '#00ff88';
    }
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case 'high': return '高风险';
      case 'medium': return '中风险';
      default: return '低风险';
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'called': return CheckCircle;
      case 'booth_paused': return PauseCircle;
      default: return CheckCircle;
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'called': return '#00ff88';
      case 'booth_paused': return '#ffaa00';
      default: return '#00ffff';
    }
  };

  const getResultBg = (type) => {
    switch (type) {
      case 'called': return 'rgba(0, 255, 136, 0.1)';
      case 'booth_paused': return 'rgba(255, 170, 0, 0.1)';
      default: return 'rgba(0, 255, 255, 0.1)';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ff3366';
      case 'high': return '#ffaa00';
      default: return '#00ffff';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'rgba(255, 51, 102, 0.15)';
      case 'high': return 'rgba(255, 170, 0, 0.15)';
      default: return 'rgba(0, 255, 255, 0.15)';
    }
  };

  const getConflictTypeLabel = (type) => {
    switch (type) {
      case 'overlap': return '时间重叠';
      case 'tight': return '时间紧张';
      case 'signing_conflict': return '签售冲突';
      case 'event_conflict': return '活动冲突';
      default: return '时间冲突';
    }
  };

  onMount(() => {
    refreshInterval = setInterval(() => {
      myQueue.refreshAllMissRisk();
    }, 60000);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        myQueue.setOnlineStatus(true);
        myQueue.syncWithServer();
      });
      window.addEventListener('offline', () => {
        myQueue.markAsOffline();
      });

      myQueue.setOnlineStatus(navigator.onLine);
      if (!navigator.onLine) {
        myQueue.markAsOffline();
      }
    }
  });

  onDestroy(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    }
  });
</script>

<div class="queue-page">
  <div class="page-header">
    <h1 class="page-title">我的排队</h1>
    <div class="header-actions">
      <button class="sync-btn" class:online={$myQueue.syncStatus?.isOnline} on:click={syncQueue}>
        {#if $myQueue.syncStatus?.isOnline}
          <Wifi class="btn-icon" />
          <span>在线</span>
        {:else}
          <WifiOff class="btn-icon" />
          <span>离线</span>
        {/if}
        <RefreshCw class="refresh-icon" />
      </button>
    </div>
  </div>

  {#if $myQueue.syncStatus?.isOnline === false}
    <div class="offline-banner">
      <WifiOff class="banner-icon" />
      <div class="banner-content">
        <span class="banner-title">当前处于离线模式</span>
        <span class="banner-desc">排队凭证已保存在本地，网络恢复后将自动同步</span>
      </div>
    </div>
  {/if}

  {#if $myQueue.conflictWarnings && $myQueue.conflictWarnings.length > 0}
    <div class="conflict-section">
      <button class="conflict-header" on:click={() => conflictPanelOpen = !conflictPanelOpen}>
        <div class="conflict-header-left">
          <Zap class="conflict-icon" style="color: {getSeverityColor($myQueue.conflictWarnings[0]?.severity)}" />
          <span class="conflict-title">时间冲突提醒</span>
          <span class="conflict-count">{$myQueue.conflictWarnings.length} 个</span>
        </div>
        <ChevronRight class="chevron {conflictPanelOpen ? 'open' : ''}" />
      </button>
      
      {#if conflictPanelOpen}
        <div class="conflict-list">
          {#each $myQueue.conflictWarnings as conflict (conflict.id)}
            <div class="conflict-card" style="border-color: {getSeverityColor(conflict.severity)}; background: {getSeverityBg(conflict.severity)}">
              <div class="conflict-card-header">
                <AlertTriangle class="conflict-card-icon" style="color: {getSeverityColor(conflict.severity)}" />
                <span class="conflict-type">{getConflictTypeLabel(conflict.type)}</span>
              </div>
              
              <div class="conflict-items">
                <div class="conflict-item">
                  <Clock class="item-icon" />
                  <span class="item-name">{conflict.items[0]?.gameName}</span>
                  <span class="item-time">{formatTime(conflict.items[0]?.estimatedTurnTime)}</span>
                </div>
                <div class="conflict-arrow">
                  {#if conflict.walkingTime}
                    <span class="walk-time">步行 {conflict.walkingTime} 分钟</span>
                  {/if}
                </div>
                <div class="conflict-item">
                  <Clock class="item-icon" />
                  <span class="item-name">{conflict.items[1]?.gameName}</span>
                  <span class="item-time">{formatTime(conflict.items[1]?.estimatedTurnTime)}</span>
                </div>
              </div>

              {#if conflict.relatedEvent}
                <div class="event-note">
                  <User class="event-icon" />
                  <span>{conflict.relatedEvent.title || conflict.relatedEvent.gameName + ' 签售'} - {formatTime(new Date(conflict.relatedEvent.startTime).getTime())}</span>
                </div>
              {/if}

              <div class="conflict-recommendation">
                <div class="recommendation-title">
                  <CheckCircle class="rec-icon" />
                  <span>建议</span>
                </div>
                <p class="recommendation-text">{conflict.recommendation?.reason}</p>
                <div class="recommendation-actions">
                  <div class="keep-item">
                    <CheckCircle class="keep-icon" />
                    <span>保留：{conflict.recommendation?.keepName}</span>
                  </div>
                  {#if conflict.recommendation?.delay && conflict.recommendation?.delay !== conflict.recommendation?.keep}
                    <button class="delay-btn" on:click={() => handleDelay(conflict.recommendation?.delay)}>
                      <X class="delay-icon" />
                      <span>取消 {conflict.recommendation?.delayName}</span>
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

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
        <div class="queue-card" class:offline={!$myQueue.syncStatus?.isOnline} class:suspended={item.status === 'suspended'}>
          {#if $myQueue.reconnectResults && $myQueue.reconnectResults[item.id]}
            {@const result = $myQueue.reconnectResults[item.id]}
            <div class="reconnect-result" style="background: {getResultBg(result.type)}; border-color: {getResultColor(result.type)}">
              <svelte:component this={getResultIcon(result.type)} class="result-icon" style="color: {getResultColor(result.type)}" />
              <div class="result-content">
                <span class="result-title" style="color: {getResultColor(result.type)}">{result.message}</span>
                <span class="result-game">{result.gameName}</span>
              </div>
              <button class="dismiss-btn" on:click={() => dismissResult(item.id)}>
                <X class="dismiss-icon" />
              </button>
            </div>
          {/if}

          {#if item.status === 'suspended'}
            <div class="suspended-banner">
              <PauseCircle class="suspended-icon" />
              <span>展位暂停服务，请留意后续通知</span>
            </div>
          {/if}

          <div class="queue-header">
            <div class="queue-number-badge">
              <span class="queue-number-label">你的号码</span>
              <span class="queue-number">A{item.queueNumber}</span>
            </div>
            <div class="queue-status {item.status === 'ready' ? 'ready' : item.status === 'suspended' ? 'suspended' : 'waiting'}">
              <span class="status-dot"></span>
              {#if item.status === 'ready'}
                已叫号
              {:else if item.status === 'suspended'}
                已暂停
              {:else}
                排队中
              {/if}
            </div>
          </div>

          <div class="offline-credential">
            <div class="credential-header">
              <MapPin class="credential-icon" />
              <span class="credential-title">排号卡</span>
              {#if !$myQueue.syncStatus?.isOnline}
                <span class="offline-badge">离线凭证</span>
              {/if}
            </div>
            <div class="credential-info">
              <div class="credential-row">
                <span class="credential-label">作品名</span>
                <span class="credential-value">{item.gameName}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">展位</span>
                <span class="credential-value">{item.boothName} ({item.zone})</span>
              </div>
              {#if item.station}
                <div class="credential-row">
                  <span class="credential-label">机位</span>
                  <span class="credential-value">{item.station}</span>
                </div>
              {/if}
              <div class="credential-row">
                <span class="credential-label">最近同步</span>
                <span class="credential-value">{formatRelativeTime(item.lastSyncTime)}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">预计开始</span>
                <span class="credential-value">{formatTime(item.estimatedTurnTime)}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">过号风险</span>
                <span class="credential-value" style="color: {getRiskColor(item.missRisk)}">
                  {getRiskLabel(item.missRisk)}
                </span>
              </div>
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
              <div class="game-location">
                <MapPin class="location-icon" />
                <span>{getBooth(getGame(item.gameId)?.boothId)?.name || item.boothName}</span>
              </div>
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

          {#if item.missRisk === 'high' && item.status === 'waiting'}
            <div class="high-risk-warning">
              <AlertCircle class="risk-icon" />
              <span>即将轮到你，请尽快前往展位</span>
            </div>
          {/if}

          <div class="queue-actions">
            <button class="cancel-btn" on:click={() => cancelQueue(item.id)}>
              <X class="btn-icon" />
              取消排队
            </button>
          </div>

          {#if item.status !== 'suspended'}
            <div class="cancel-warning">
              <AlertTriangle class="warning-icon" />
              <span>取消后需重新排队，预计等待时间会更长</span>
            </div>
          {/if}
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
              {item.status === 'completed' ? '已完成' : item.status === 'suspended' ? '已暂停' : '已取消'}
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 16px 12px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .sync-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    color: #888;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .sync-btn.online {
    color: #00ff88;
    border-color: rgba(0, 255, 136, 0.3);
  }

  .sync-btn .btn-icon {
    width: 14px;
    height: 14px;
  }

  .sync-btn .refresh-icon {
    width: 12px;
    height: 12px;
    margin-left: 4px;
  }

  .offline-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 16px 16px;
    padding: 14px 16px;
    background: rgba(255, 170, 0, 0.1);
    border: 1px solid rgba(255, 170, 0, 0.3);
    border-radius: 12px;
  }

  .banner-icon {
    width: 24px;
    height: 24px;
    color: #ffaa00;
    flex-shrink: 0;
  }

  .banner-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .banner-title {
    font-size: 14px;
    font-weight: 600;
    color: #ffaa00;
  }

  .banner-desc {
    font-size: 12px;
    color: #888;
  }

  .conflict-section {
    margin: 0 16px 16px;
    background: rgba(255, 170, 0, 0.05);
    border: 1px solid rgba(255, 170, 0, 0.2);
    border-radius: 12px;
    overflow: hidden;
  }

  .conflict-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .conflict-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .conflict-icon {
    width: 20px;
    height: 20px;
  }

  .conflict-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .conflict-count {
    font-size: 12px;
    padding: 2px 8px;
    background: rgba(255, 51, 102, 0.2);
    color: #ff3366;
    border-radius: 10px;
    font-weight: 600;
  }

  .chevron {
    width: 18px;
    height: 18px;
    color: #888;
    transition: transform 0.2s;
  }

  .chevron.open {
    transform: rotate(90deg);
  }

  .conflict-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 16px 16px;
  }

  .conflict-card {
    padding: 14px;
    border: 1px solid;
    border-radius: 10px;
  }

  .conflict-card-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .conflict-card-icon {
    width: 16px;
    height: 16px;
  }

  .conflict-type {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
  }

  .conflict-items {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .conflict-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
  }

  .item-icon {
    width: 14px;
    height: 14px;
    color: #00ffff;
  }

  .item-name {
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-time {
    font-size: 11px;
    color: #00ffff;
    font-weight: 600;
  }

  .conflict-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .walk-time {
    font-size: 10px;
    color: #888;
    white-space: nowrap;
  }

  .event-note {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    background: rgba(138, 43, 226, 0.1);
    border-radius: 6px;
    margin-bottom: 12px;
  }

  .event-icon {
    width: 14px;
    height: 14px;
    color: #8a2be2;
  }

  .event-note span {
    font-size: 11px;
    color: #ccc;
  }

  .conflict-recommendation {
    padding: 10px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
  }

  .recommendation-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .rec-icon {
    width: 14px;
    height: 14px;
    color: #00ff88;
  }

  .recommendation-title span {
    font-size: 12px;
    font-weight: 600;
    color: #00ff88;
  }

  .recommendation-text {
    font-size: 12px;
    color: #ccc;
    margin: 0 0 10px;
    line-height: 1.5;
  }

  .recommendation-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .keep-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #00ff88;
  }

  .keep-icon {
    width: 14px;
    height: 14px;
  }

  .delay-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(255, 51, 102, 0.15);
    border: 1px solid rgba(255, 51, 102, 0.3);
    border-radius: 6px;
    color: #ff3366;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }

  .delay-icon {
    width: 12px;
    height: 12px;
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
    position: relative;
  }

  .queue-card.offline {
    border-color: rgba(255, 170, 0, 0.5);
  }

  .queue-card.suspended {
    opacity: 0.7;
  }

  .reconnect-result {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: -20px -20px 16px;
    padding: 14px 16px;
    border-bottom: 1px solid;
    border-radius: 16px 16px 0 0;
  }

  .result-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  .result-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .result-title {
    font-size: 14px;
    font-weight: 600;
  }

  .result-game {
    font-size: 12px;
    color: #888;
  }

  .dismiss-btn {
    padding: 4px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .dismiss-icon {
    width: 16px;
    height: 16px;
    color: #888;
  }

  .suspended-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: -20px -20px 16px;
    padding: 12px 16px;
    background: rgba(255, 170, 0, 0.1);
    border-bottom: 1px solid rgba(255, 170, 0, 0.3);
    border-radius: 16px 16px 0 0;
  }

  .suspended-icon {
    width: 18px;
    height: 18px;
    color: #ffaa00;
  }

  .suspended-banner span {
    font-size: 12px;
    color: #ffaa00;
    font-weight: 500;
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

  .queue-status.suspended {
    background: rgba(136, 136, 136, 0.15);
    color: #888;
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

  .offline-credential {
    margin-bottom: 16px;
    padding: 14px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(0, 255, 255, 0.2);
    border-radius: 10px;
  }

  .credential-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }

  .credential-icon {
    width: 14px;
    height: 14px;
    color: #00ffff;
  }

  .credential-title {
    font-size: 13px;
    font-weight: 600;
    color: #00ffff;
  }

  .offline-badge {
    font-size: 10px;
    padding: 2px 6px;
    background: rgba(255, 170, 0, 0.2);
    color: #ffaa00;
    border-radius: 8px;
    font-weight: 600;
  }

  .credential-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .credential-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .credential-label {
    font-size: 11px;
    color: #666;
  }

  .credential-value {
    font-size: 11px;
    color: #fff;
    font-weight: 500;
    text-align: right;
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

  .high-risk-warning {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 12px;
    background: rgba(255, 51, 102, 0.1);
    border: 1px solid rgba(255, 51, 102, 0.3);
    border-radius: 8px;
  }

  .risk-icon {
    width: 18px;
    height: 18px;
    color: #ff3366;
    flex-shrink: 0;
  }

  .high-risk-warning span {
    font-size: 13px;
    color: #ff3366;
    font-weight: 500;
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

  .history-status.suspended {
    background: rgba(136, 136, 136, 0.1);
    color: #888;
  }
</style>
