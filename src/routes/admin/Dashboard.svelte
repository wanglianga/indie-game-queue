<script>
  import { onMount, onDestroy } from 'svelte';
  import { Users, Gamepad2, Clock, AlertTriangle, TrendingUp, MapPin } from '@lucide/svelte';
  import { games, highQueueGames } from '../../stores/games.js';
  import { crowdZones, highCrowdBooths } from '../../stores/booths.js';
  import { upcomingEvents, ongoingEvents } from '../../stores/events.js';

  let currentTime = new Date();
  let timer = null;

  onMount(() => {
    timer = setInterval(() => {
      currentTime = new Date();
    }, 1000);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });

  const formatTime = (date) => {
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0') + ':' +
           date.getSeconds().toString().padStart(2, '0');
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${month}月${day}日 ${weekdays[date.getDay()]}`;
  };

  const formatEventTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  };

  const getCrowdColor = (level) => {
    switch (level) {
      case 'high': return '#ff3366';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff88';
      default: return '#666';
    }
  };

  const getCrowdLabel = (level) => {
    switch (level) {
      case 'high': return '拥挤';
      case 'medium': return '适中';
      case 'low': return '宽松';
      default: return '未知';
    }
  };

  const totalVisitors = 490;
</script>

<div class="admin-dashboard">
  <header class="dashboard-header">
    <div class="header-left">
      <h1 class="dashboard-title">INDIE GAME EXPO 2026</h1>
      <p class="dashboard-subtitle">主办方监控大屏</p>
    </div>
    <div class="header-center">
      <div class="current-time">{formatTime(currentTime)}</div>
      <div class="current-date">{formatDate(currentTime)}</div>
    </div>
    <div class="header-right">
      <div class="visitor-counter">
        <Users class="counter-icon" />
        <span class="counter-value">{totalVisitors}</span>
        <span class="counter-label">在馆人数</span>
      </div>
    </div>
  </header>

  <div class="dashboard-content">
    <div class="left-panel">
      <div class="panel crowd-panel">
        <h2 class="panel-title">
          <TrendingUp class="title-icon" />
          区域人流热力
        </h2>
        <div class="crowd-zones">
          {#each $crowdZones as zone}
            <div class="crowd-zone-card">
              <div class="zone-header">
                <span class="zone-name">{zone.name}</span>
                <span class="zone-level" style="color: {getCrowdColor(zone.level)}">
                  {getCrowdLabel(zone.level)}
                </span>
              </div>
              <div class="zone-count">{zone.count} <span class="unit">人</span></div>
              <div class="zone-bar">
                <div 
                  class="zone-fill" 
                  style="width: {Math.min(100, zone.count / 2)}%; background: {getCrowdColor(zone.level)}"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="panel warnings-panel">
        <h2 class="panel-title">
          <AlertTriangle class="title-icon warning" />
          拥挤预警
        </h2>
        <div class="warning-list">
          {#each $highQueueGames.slice(0, 3) as game}
            <div class="warning-item high">
              <Gamepad2 class="warning-icon" />
              <div class="warning-info">
                <span class="warning-name">{game.name}</span>
                <span class="warning-desc">{game.queueCount} 人排队，建议加机</span>
              </div>
              <span class="warning-badge">高</span>
            </div>
          {/each}
          {#each $highCrowdBooths.slice(0, 2) as booth}
            <div class="warning-item medium">
              <MapPin class="warning-icon" />
              <div class="warning-info">
                <span class="warning-name">{booth.name}</span>
                <span class="warning-desc">人流密集，请注意疏导</span>
              </div>
              <span class="warning-badge medium">中</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="center-panel">
      <div class="panel map-panel">
        <h2 class="panel-title">
          <MapPin class="title-icon" />
          展馆实时监控
        </h2>
        <div class="map-container">
          <svg class="floor-map" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <rect x="0" y="0" width="100" height="100" fill="#0a0a14" />
            
            <rect x="10" y="15" width="52" height="18" fill="#3b82f6" opacity="0.15" rx="2" />
            <text x="36" y="24" fill="#3b82f6" font-size="3" text-anchor="middle" opacity="0.6">A区</text>
            
            <rect x="10" y="35" width="52" height="18" fill="#10b981" opacity="0.15" rx="2" />
            <text x="36" y="44" fill="#10b981" font-size="3" text-anchor="middle" opacity="0.6">B区</text>
            
            <rect x="10" y="55" width="52" height="18" fill="#f59e0b" opacity="0.15" rx="2" />
            <text x="36" y="64" fill="#f59e0b" font-size="3" text-anchor="middle" opacity="0.6">C区</text>
            
            <rect x="60" y="20" width="22" height="38" fill="#ef4444" opacity="0.15" rx="2" />
            <text x="71" y="40" fill="#ef4444" font-size="3" text-anchor="middle" opacity="0.6">D区</text>
            
            <rect x="38" y="78" width="24" height="12" fill="#ff00ff" opacity="0.2" rx="1" />
            <text x="50" y="85" fill="#ff00ff" font-size="2.5" text-anchor="middle">主舞台</text>
            
            <rect x="8" y="78" width="20" height="10" fill="#00ff88" opacity="0.2" rx="1" />
            <text x="18" y="84" fill="#00ff88" font-size="2.5" text-anchor="middle">签售区</text>
            
            {#each $games as game}
              {#if game.boothId}
                {#each $crowdZones as zone}
                  {#if game.boothId.includes(zone.id.split('-')[1])}
                  {/if}
                {/each}
              {/if}
            {/each}

            <g class="hot-spots">
              <circle cx="21" cy="24" r="4" fill="#ff3366" opacity="0.4">
                <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="21" cy="44" r="3" fill="#ff3366" opacity="0.4">
                <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="71" cy="29" r="3" fill="#ff3366" opacity="0.4">
                <animate attributeName="r" values="2;4;2" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="71" cy="49" r="4" fill="#ff3366" opacity="0.4">
                <animate attributeName="r" values="3;5;3" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
      </div>

      <div class="panel queue-panel">
        <h2 class="panel-title">
          <Gamepad2 class="title-icon" />
          热门游戏排队排行
        </h2>
        <div class="ranking-list">
          {#each $highQueueGames as game, index}
            <div class="ranking-item">
              <span class="rank rank-{index + 1}">{index + 1}</span>
              <img src={game.cover} alt="" class="rank-cover" />
              <div class="rank-info">
                <span class="rank-name">{game.name}</span>
                <span class="rank-dev">{game.developer}</span>
              </div>
              <div class="rank-stats">
                <span class="rank-count">{game.queueCount}</span>
                <span class="rank-label">人排队</span>
              </div>
              <div class="rank-progress">
                <div class="progress-fill" style="width: {Math.min(100, game.queueCount * 4)}%"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="right-panel">
      <div class="panel events-panel">
        <h2 class="panel-title">
          <Clock class="title-icon" />
          活动日程
        </h2>
        
        {#if $ongoingEvents.length > 0}
          <div class="event-section">
            <h3 class="section-subtitle">
              <span class="live-dot"></span>
              正在进行
            </h3>
            {#each $ongoingEvents as event}
              <div class="event-card live">
                <span class="event-time">{formatEventTime(event.startTime)}</span>
                <span class="event-name">{event.title}</span>
                <span class="event-loc">{event.boothId}</span>
              </div>
            {/each}
          </div>
        {/if}

        <div class="event-section">
          <h3 class="section-subtitle">即将开始</h3>
          {#each $upcomingEvents.slice(0, 4) as event}
            <div class="event-card">
              <span class="event-time">{formatEventTime(event.startTime)}</span>
              <span class="event-name">{event.title}</span>
              <span class="event-loc">{event.boothId}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="panel stats-panel">
        <h2 class="panel-title">实时数据</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <Gamepad2 class="stat-icon" />
            <span class="stat-value">{$games.length}</span>
            <span class="stat-label">参展游戏</span>
          </div>
          <div class="stat-card">
            <Users class="stat-icon" />
            <span class="stat-value">{$games.reduce((sum, g) => sum + g.queueCount, 0)}</span>
            <span class="stat-label">总排队数</span>
          </div>
          <div class="stat-card">
            <Clock class="stat-icon" />
            <span class="stat-value">
              {Math.round($games.reduce((sum, g) => sum + g.queueCount, 0) / $games.length)}
            </span>
            <span class="stat-label">平均排队</span>
          </div>
          <div class="stat-card">
            <MapPin class="stat-icon" />
            <span class="stat-value">{$highCrowdBooths.length}</span>
            <span class="stat-label">拥挤展位</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .admin-dashboard {
    min-height: 100vh;
    background: linear-gradient(180deg, #0a0a14 0%, #0d0d1a 100%);
    color: #fff;
    padding: 20px;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  }

  .header-left {
    flex: 1;
  }

  .dashboard-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(90deg, #00ffff, #ff00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2px;
  }

  .dashboard-subtitle {
    font-size: 14px;
    color: #666;
    margin: 4px 0 0;
  }

  .header-center {
    text-align: center;
    flex: 1;
  }

  .current-time {
    font-size: 42px;
    font-weight: 700;
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    font-family: 'Courier New', monospace;
  }

  .current-date {
    font-size: 14px;
    color: #888;
    margin-top: 4px;
  }

  .header-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .visitor-counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 24px;
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 12px;
  }

  .counter-icon {
    width: 24px;
    height: 24px;
    color: #00ffff;
    margin-bottom: 4px;
  }

  .counter-value {
    font-size: 28px;
    font-weight: 700;
    color: #00ffff;
  }

  .counter-label {
    font-size: 11px;
    color: #666;
  }

  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    gap: 20px;
  }

  .panel {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px;
    color: #fff;
  }

  .title-icon {
    width: 20px;
    height: 20px;
    color: #00ffff;
  }

  .title-icon.warning {
    color: #ff3366;
  }

  .left-panel, .right-panel {
    display: flex;
    flex-direction: column;
  }

  .crowd-zones {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .crowd-zone-card {
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
  }

  .zone-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .zone-name {
    font-size: 14px;
    font-weight: 500;
  }

  .zone-level {
    font-size: 12px;
    font-weight: 600;
  }

  .zone-count {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  .unit {
    font-size: 12px;
    font-weight: 400;
    color: #888;
  }

  .zone-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    overflow: hidden;
  }

  .zone-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  .warning-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .warning-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: rgba(255, 51, 102, 0.05);
    border-left: 3px solid #ff3366;
    border-radius: 0 8px 8px 0;
  }

  .warning-item.medium {
    background: rgba(255, 170, 0, 0.05);
    border-left-color: #ffaa00;
  }

  .warning-icon {
    width: 20px;
    height: 20px;
    color: #ff3366;
    flex-shrink: 0;
  }

  .warning-item.medium .warning-icon {
    color: #ffaa00;
  }

  .warning-info {
    flex: 1;
    min-width: 0;
  }

  .warning-name {
    display: block;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .warning-desc {
    display: block;
    font-size: 11px;
    color: #888;
  }

  .warning-badge {
    padding: 3px 8px;
    background: #ff3366;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .warning-badge.medium {
    background: #ffaa00;
  }

  .center-panel {
    display: flex;
    flex-direction: column;
  }

  .map-panel {
    flex: 1;
  }

  .map-container {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(0, 255, 255, 0.2);
  }

  .floor-map {
    width: 100%;
    height: auto;
    display: block;
  }

  .hot-spots {
    pointer-events: none;
  }

  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ranking-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
  }

  .rank {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .rank-1 {
    background: linear-gradient(135deg, #ffd700, #ffaa00);
    color: #000;
  }

  .rank-2 {
    background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
    color: #000;
  }

  .rank-3 {
    background: linear-gradient(135deg, #cd7f32, #b87333);
    color: #fff;
  }

  .rank-4, .rank-5 {
    background: rgba(255, 255, 255, 0.1);
    color: #888;
  }

  .rank-cover {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .rank-info {
    flex: 1;
    min-width: 0;
  }

  .rank-name {
    display: block;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rank-dev {
    display: block;
    font-size: 11px;
    color: #888;
  }

  .rank-stats {
    text-align: right;
    flex-shrink: 0;
  }

  .rank-count {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #ff3366;
  }

  .rank-label {
    display: block;
    font-size: 10px;
    color: #666;
  }

  .rank-progress {
    width: 60px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff3366, #ffaa00);
    border-radius: 2px;
  }

  .event-section {
    margin-bottom: 16px;
  }

  .section-subtitle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #888;
    margin: 0 0 10px;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    background: #00ff88;
    border-radius: 50%;
    animation: blink 1.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .event-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .event-card.live {
    background: rgba(0, 255, 136, 0.05);
    border: 1px solid rgba(0, 255, 136, 0.2);
  }

  .event-time {
    font-size: 12px;
    font-weight: 600;
    color: #00ffff;
    min-width: 40px;
  }

  .event-name {
    flex: 1;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .event-loc {
    font-size: 11px;
    color: #666;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px 8px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
    text-align: center;
  }

  .stat-icon {
    width: 20px;
    height: 20px;
    color: #00ffff;
  }

  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
  }

  .stat-label {
    font-size: 11px;
    color: #666;
  }
</style>
