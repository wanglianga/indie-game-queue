<script>
  import { Clock, Users, MapPin, PenTool } from '@lucide/svelte';
  import { ongoingSignings, upcomingSignings } from '../stores/events.js';

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  };

  const formatDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const minutes = (endDate - startDate) / (1000 * 60);
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    }
    return `${mins}分钟`;
  };

  const getQueueProgress = (current, max) => {
    return Math.min(100, (current / max) * 100);
  };
</script>

<div class="signing-page">
  <div class="page-header">
    <h1 class="page-title">开发者签售</h1>
  </div>

  <div class="intro-card">
    <PenTool class="intro-icon" />
    <div class="intro-content">
      <h3 class="intro-title">现场签售活动</h3>
      <p class="intro-desc">与你喜欢的游戏开发者面对面，获取签名周边</p>
    </div>
  </div>

  {#if $ongoingSignings.length > 0}
    <div class="section">
      <h2 class="section-title">
        <span class="live-dot"></span>
        正在进行
      </h2>
      <div class="signing-list">
        {#each $ongoingSignings as signing}
          <div class="signing-card ongoing">
            <div class="signing-header">
              <div class="signing-time">
                <Clock class="time-icon" />
                <span>{formatTime(signing.startTime)} - {formatTime(signing.endTime)}</span>
              </div>
              <span class="status-badge">进行中</span>
            </div>
            
            <h3 class="signing-game">{signing.gameName}</h3>
            <p class="signing-dev">{signing.developer}</p>
            
            <div class="signing-location">
              <MapPin class="loc-icon" />
              <span>{signing.location}</span>
            </div>
            
            <div class="queue-info">
              <div class="queue-header">
                <span class="queue-label">排队人数</span>
                <span class="queue-count">{signing.queueCount} / {signing.maxQueue}</span>
              </div>
              <div class="queue-bar">
                <div 
                  class="queue-fill" 
                  style="width: {getQueueProgress(signing.queueCount, signing.maxQueue)}%"
                ></div>
              </div>
              <p class="queue-tip">
                {signing.queueCount >= signing.maxQueue 
                  ? '排队已满，下一场请早' 
                  : '还有空位，快去排队吧'}
              </p>
            </div>
            
            <button class="join-btn" disabled={signing.queueCount >= signing.maxQueue}>
              {signing.queueCount >= signing.maxQueue ? '已满员' : '加入签售排队'}
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="section">
    <h2 class="section-title">即将开始</h2>
    <div class="signing-list">
      {#each $upcomingSignings as signing}
        <div class="signing-card upcoming">
          <div class="signing-header">
            <div class="signing-time">
              <Clock class="time-icon" />
              <span>{formatTime(signing.startTime)} - {formatTime(signing.endTime)}</span>
            </div>
            <span class="status-badge upcoming">即将开始</span>
          </div>
          
          <h3 class="signing-game">{signing.gameName}</h3>
          <p class="signing-dev">{signing.developer}</p>
          
          <div class="signing-location">
            <MapPin class="loc-icon" />
            <span>{signing.location}</span>
          </div>
          
          <div class="queue-preview">
            <Users class="queue-icon" />
            <span>预计 {signing.maxQueue} 名额</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .signing-page {
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

  .intro-card {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 0 16px 20px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
    border: 1px solid rgba(255, 0, 255, 0.3);
    border-radius: 12px;
  }

  .intro-icon {
    width: 36px;
    height: 36px;
    color: #ff00ff;
  }

  .intro-content {
    flex: 1;
  }

  .intro-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px;
  }

  .intro-desc {
    font-size: 12px;
    color: #888;
    margin: 0;
  }

  .section {
    margin-bottom: 24px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0 16px 12px;
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

  .signing-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 16px;
  }

  .signing-card {
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }

  .signing-card.ongoing {
    border-color: rgba(0, 255, 136, 0.4);
    background: rgba(0, 255, 136, 0.05);
  }

  .signing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .signing-time {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #00ffff;
  }

  .time-icon {
    width: 14px;
    height: 14px;
  }

  .status-badge {
    padding: 4px 10px;
    background: rgba(0, 255, 136, 0.2);
    color: #00ff88;
    font-size: 11px;
    font-weight: 500;
    border-radius: 8px;
  }

  .status-badge.upcoming {
    background: rgba(255, 170, 0, 0.2);
    color: #ffaa00;
  }

  .signing-game {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 4px;
  }

  .signing-dev {
    font-size: 13px;
    color: #888;
    margin: 0 0 12px;
  }

  .signing-location {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #aaa;
    margin-bottom: 14px;
  }

  .loc-icon {
    width: 14px;
    height: 14px;
    color: #ff00ff;
  }

  .queue-info {
    margin-bottom: 14px;
  }

  .queue-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .queue-label {
    font-size: 12px;
    color: #888;
  }

  .queue-count {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
  }

  .queue-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .queue-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff88, #00ffff);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .queue-tip {
    font-size: 11px;
    color: #888;
    margin: 0;
  }

  .join-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #ff00ff, #ff3366);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }

  .join-btn:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
  }

  .queue-preview {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    font-size: 13px;
    color: #888;
  }

  .queue-icon {
    width: 14px;
    height: 14px;
  }
</style>
