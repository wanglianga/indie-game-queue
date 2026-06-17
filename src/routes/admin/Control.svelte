<script>
  import { push } from '../../utils/router.js';
  import { Gamepad2, Users, Settings, Plus, Pause, Play, Monitor, AlertCircle, CheckCircle } from '@lucide/svelte';
  import { games } from '../../stores/games.js';
  import { crowdZones } from '../../stores/booths.js';

  const addStation = (gameId) => {
    const newStation = {
      id: `st-${Date.now()}`,
      name: `${Math.floor(Math.random() * 10)}号机(临时)`,
      status: 'available',
      currentPlayer: null
    };
    games.addStation(gameId, newStation);
  };

  const pauseGame = (gameId) => {
    games.updateGameStatus(gameId, 'limited');
  };

  const resumeGame = (gameId) => {
    games.updateGameStatus(gameId, 'available');
  };

  const updateCrowdLevel = (zoneId, level) => {
    crowdZones.update(zones => 
      zones.map(zone => 
        zone.id === zoneId ? { ...zone, level } : zone
      )
    );
  };

  const addCrowdCount = (zoneId) => {
    crowdZones.update(zones => 
      zones.map(zone => 
        zone.id === zoneId ? { ...zone, count: zone.count + 10 } : zone
      )
    );
  };

  const reduceCrowdCount = (zoneId) => {
    crowdZones.update(zones => 
      zones.map(zone => 
        zone.id === zoneId ? { ...zone, count: Math.max(0, zone.count - 10) } : zone
      )
    );
  };
</script>

<div class="control-page">
  <div class="control-header">
    <button class="back-btn" on:click={() => push('/admin')}>
      ← 返回大屏
    </button>
    <h1 class="page-title">主办方控制中心</h1>
    <div style="width: 100px;"></div>
  </div>

  <div class="control-content">
    <div class="control-section">
      <h2 class="section-title">
        <Gamepad2 class="title-icon" />
        游戏试玩管理
      </h2>
      <div class="game-control-list">
        {#each $games as game}
          <div class="game-control-card">
            <div class="game-info">
              <img src={game.cover} alt="" class="game-cover" />
              <div class="game-details">
                <h3 class="game-name">{game.name}</h3>
                <p class="game-dev">{game.developer}</p>
                <div class="game-stats">
                  <span class="stat">排队: <strong>{game.queueCount}</strong></span>
                  <span class="stat">机位: <strong>{game.stations.filter(s => s.status === 'playing').length}/{game.stations.length}</strong></span>
                </div>
              </div>
            </div>
            <div class="game-status">
              <span class="status-badge {game.status}">
                {game.status === 'available' ? '正常开放' : 
                 game.status === 'limited' ? '暂停排队' : '维护中'}
              </span>
            </div>
            <div class="control-actions">
              <button 
                class="action-btn primary"
                on:click={() => addStation(game.id)}
              >
                <Plus class="btn-icon" />
                临时加机
              </button>
              {#if game.status === 'available'}
                <button 
                  class="action-btn warning"
                  on:click={() => pauseGame(game.id)}
                >
                  <Pause class="btn-icon" />
                  暂停试玩
                </button>
              {:else}
                <button 
                  class="action-btn success"
                  on:click={() => resumeGame(game.id)}
                >
                  <Play class="btn-icon" />
                  恢复试玩
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="control-section">
      <h2 class="section-title">
        <Users class="title-icon" />
        区域人流管理
      </h2>
      <div class="crowd-control-grid">
        {#each $crowdZones as zone}
          <div class="crowd-control-card">
            <div class="zone-header">
              <h3 class="zone-name">{zone.name}</h3>
              <span class="zone-count">{zone.count} 人</span>
            </div>
            <div class="zone-bar">
              <div 
                class="zone-fill {zone.level}"
                style="width: {Math.min(100, zone.count / 2)}%"
              ></div>
            </div>
            <div class="crowd-actions">
              <button class="crowd-btn" on:click={() => reduceCrowdCount(zone.id)}>
                - 10人
              </button>
              <button class="crowd-btn primary" on:click={() => addCrowdCount(zone.id)}>
                + 10人
              </button>
            </div>
            <div class="level-selector">
              <span class="selector-label">状态:</span>
              <button 
                class="level-btn {zone.level === 'low' ? 'active' : ''}"
                on:click={() => updateCrowdLevel(zone.id, 'low')}
              >
                宽松
              </button>
              <button 
                class="level-btn {zone.level === 'medium' ? 'active' : ''}"
                on:click={() => updateCrowdLevel(zone.id, 'medium')}
              >
                适中
              </button>
              <button 
                class="level-btn {zone.level === 'high' ? 'active' : ''}"
                on:click={() => updateCrowdLevel(zone.id, 'high')}
              >
                拥挤
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="control-section">
      <h2 class="section-title">
        <AlertCircle class="title-icon" />
        公告广播
      </h2>
      <div class="announcement-panel">
        <textarea 
          class="announcement-input"
          placeholder="输入广播内容..."
          rows="3"
        ></textarea>
        <div class="announcement-actions">
          <button class="action-btn primary">
            发送全场广播
          </button>
          <button class="action-btn">
            发送给排队用户
          </button>
        </div>
      </div>
    </div>

    <div class="control-section">
      <h2 class="section-title">
        <Settings class="title-icon" />
        系统设置
      </h2>
      <div class="settings-grid">
        <div class="setting-item">
          <span class="setting-label">叫号自动推进</span>
          <label class="toggle-switch">
            <input type="checkbox" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span class="setting-label">大屏自动刷新</span>
          <label class="toggle-switch">
            <input type="checkbox" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span class="setting-label">排队提醒震动</span>
          <label class="toggle-switch">
            <input type="checkbox" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span class="setting-label">声音提示</span>
          <label class="toggle-switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .control-page {
    min-height: 100vh;
    background: #0a0a14;
    color: #fff;
    padding-bottom: 40px;
  }

  .control-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    position: sticky;
    top: 0;
    background: rgba(10, 10, 20, 0.95);
    backdrop-filter: blur(10px);
    z-index: 10;
  }

  .back-btn {
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #00ffff;
    font-size: 14px;
    border-radius: 8px;
    cursor: pointer;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(90deg, #00ffff, #ff00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .control-content {
    padding: 20px;
  }

  .control-section {
    margin-bottom: 32px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .title-icon {
    width: 22px;
    height: 22px;
    color: #00ffff;
  }

  .game-control-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .game-control-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
  }

  .game-info {
    display: flex;
    gap: 14px;
    flex: 1;
    min-width: 0;
  }

  .game-cover {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .game-details {
    flex: 1;
    min-width: 0;
  }

  .game-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .game-dev {
    font-size: 12px;
    color: #888;
    margin: 0 0 6px;
  }

  .game-stats {
    display: flex;
    gap: 16px;
  }

  .stat {
    font-size: 12px;
    color: #888;
  }

  .stat strong {
    color: #00ffff;
    font-weight: 600;
  }

  .game-status {
    flex-shrink: 0;
  }

  .status-badge {
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 8px;
  }

  .status-badge.available {
    background: rgba(0, 255, 136, 0.15);
    color: #00ff88;
  }

  .status-badge.limited {
    background: rgba(255, 170, 0, 0.15);
    color: #ffaa00;
  }

  .status-badge.maintenance {
    background: rgba(102, 102, 102, 0.15);
    color: #888;
  }

  .control-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 13px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .action-btn.primary {
    background: linear-gradient(135deg, #00ffff, #0080ff);
    color: #000;
    border: none;
    font-weight: 600;
  }

  .action-btn.warning {
    background: rgba(255, 170, 0, 0.15);
    border-color: rgba(255, 170, 0, 0.4);
    color: #ffaa00;
  }

  .action-btn.success {
    background: rgba(0, 255, 136, 0.15);
    border-color: rgba(0, 255, 136, 0.4);
    color: #00ff88;
  }

  .btn-icon {
    width: 16px;
    height: 16px;
  }

  .crowd-control-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .crowd-control-card {
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
  }

  .zone-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .zone-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  .zone-count {
    font-size: 20px;
    font-weight: 700;
    color: #00ffff;
  }

  .zone-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 14px;
  }

  .zone-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .zone-fill.low {
    background: #00ff88;
  }

  .zone-fill.medium {
    background: #ffaa00;
  }

  .zone-fill.high {
    background: #ff3366;
  }

  .crowd-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
  }

  .crowd-btn {
    flex: 1;
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 12px;
    border-radius: 6px;
    cursor: pointer;
  }

  .crowd-btn.primary {
    background: rgba(0, 255, 255, 0.15);
    border-color: rgba(0, 255, 255, 0.4);
    color: #00ffff;
  }

  .level-selector {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .selector-label {
    font-size: 12px;
    color: #888;
  }

  .level-btn {
    flex: 1;
    padding: 6px 4px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: #666;
    font-size: 11px;
    border-radius: 6px;
    cursor: pointer;
  }

  .level-btn.active {
    background: rgba(0, 255, 255, 0.15);
    border-color: rgba(0, 255, 255, 0.4);
    color: #00ffff;
  }

  .announcement-panel {
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
  }

  .announcement-input {
    width: 100%;
    padding: 12px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 14px;
    border-radius: 8px;
    resize: vertical;
    margin-bottom: 12px;
    box-sizing: border-box;
  }

  .announcement-input::placeholder {
    color: #666;
  }

  .announcement-actions {
    display: flex;
    gap: 12px;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
  }

  .setting-label {
    font-size: 14px;
    color: #ccc;
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 26px;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    transition: 0.3s;
    border-radius: 26px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background: linear-gradient(135deg, #00ffff, #0080ff);
  }

  input:checked + .slider:before {
    transform: translateX(22px);
  }
</style>
