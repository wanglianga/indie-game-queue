<script>
  import { push } from '../utils/router.js';
  import { ZoomIn, ZoomOut, Navigation, Info } from '@lucide/svelte';
  import { booths, boothsWithGames } from '../stores/booths.js';
  import { games } from '../stores/games.js';
  import { floorMap } from '../data/mockData.js';

  let selectedBooth = null;
  let zoom = 1;
  let userPosition = { x: 50, y: 5 };

  const zoomIn = () => {
    zoom = Math.min(2, zoom + 0.2);
  };

  const zoomOut = () => {
    zoom = Math.max(0.6, zoom - 0.2);
  };

  const selectBooth = (booth) => {
    selectedBooth = booth;
  };

  const closeBooth = () => {
    selectedBooth = null;
  };

  const getGameForBooth = (booth) => {
    if (!booth.gameId) return null;
    let game;
    games.subscribe(g => game = g.find(item => item.id === booth.gameId))();
    return game;
  };

  const getCrowdColor = (level) => {
    switch (level) {
      case 'high': return '#ff3366';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff88';
      default: return '#666';
    }
  };
</script>

<div class="map-page">
  <div class="map-header">
    <h1 class="page-title">楼层地图</h1>
    <div class="map-controls">
      <button class="control-btn" on:click={zoomIn}>
        <ZoomIn class="control-icon" />
      </button>
      <button class="control-btn" on:click={zoomOut}>
        <ZoomOut class="control-icon" />
      </button>
      <button class="control-btn locate-btn">
        <Navigation class="control-icon" />
      </button>
    </div>
  </div>

  <div class="map-container">
    <div class="map-wrapper" style="transform: scale({zoom})">
      <svg class="floor-map" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="100" height="100" fill="#0a0a14" />
        
        {#each floorMap.zones as zone}
          <rect 
            x={zone.x} 
            y={zone.y} 
            width={zone.width} 
            height={zone.height}
            fill={zone.color}
            opacity="0.15"
            rx="2"
          />
          <text 
            x={zone.x + zone.width / 2} 
            y={zone.y + 6}
            fill={zone.color}
            font-size="3"
            text-anchor="middle"
            opacity="0.6"
          >
            {zone.name}
          </text>
        {/each}

        {#each floorMap.facilities as facility}
          <circle 
            cx={facility.x} 
            cy={facility.y} 
            r="2"
            fill="#666"
            opacity="0.5"
          />
        {/each}

        {#each $booths as booth}
          <g on:click={() => selectBooth(booth)} class="booth-svg">
            <rect
              x={booth.x}
              y={booth.y}
              width={booth.width}
              height={booth.height}
              fill={booth.isStage ? '#ff00ff' : booth.isSigning ? '#00ff88' : booth.isEntrance ? '#ffaa00' : '#1a1a2e'}
              stroke={getCrowdColor(booth.crowdLevel)}
              stroke-width={selectedBooth?.id === booth.id ? '1' : '0.5'}
              rx="1"
              opacity={selectedBooth && selectedBooth.id !== booth.id ? '0.5' : '1'}
              class="booth-rect"
            />
            <text
              x={booth.x + booth.width / 2}
              y={booth.y + booth.height / 2 + 1}
              fill="#fff"
              font-size="2.5"
              text-anchor="middle"
            >
              {booth.name.split(' ')[0]}
            </text>
          </g>
        {/each}

        <g class="user-marker">
          <circle cx={userPosition.x} cy={userPosition.y} r="3" fill="#00ffff" opacity="0.3" />
          <circle cx={userPosition.x} cy={userPosition.y} r="1.5" fill="#00ffff" />
          <circle cx={userPosition.x} cy={userPosition.y} r="5" fill="none" stroke="#00ffff" stroke-width="0.3" opacity="0.5">
            <animate attributeName="r" from="2" to="5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  </div>

  <div class="legend">
    <div class="legend-item">
      <span class="legend-dot high"></span>
      <span class="legend-text">拥挤</span>
    </div>
    <div class="legend-item">
      <span class="legend-dot medium"></span>
      <span class="legend-text">适中</span>
    </div>
    <div class="legend-item">
      <span class="legend-dot low"></span>
      <span class="legend-text">宽松</span>
    </div>
  </div>

  {#if selectedBooth}
    <div class="booth-detail" on:click|stopPropagation>
      <div class="booth-detail-header">
        <h2 class="booth-name">{selectedBooth.name}</h2>
        <button class="close-btn" on:click={closeBooth}>×</button>
      </div>
      <div class="booth-detail-body">
        <div class="booth-info-row">
          <span class="info-label">区域</span>
          <span class="info-value">{selectedBooth.zone}</span>
        </div>
        <div class="booth-info-row">
          <span class="info-label">人流</span>
          <span class="info-value crowd-{selectedBooth.crowdLevel}">
            {selectedBooth.crowdLevel === 'high' ? '拥挤' : selectedBooth.crowdLevel === 'medium' ? '适中' : '宽松'}
          </span>
        </div>
        
        {#if getGameForBooth(selectedBooth)}
          <div class="game-preview">
            <div class="game-preview-cover">
              <img src={getGameForBooth(selectedBooth).cover} alt="" />
            </div>
            <div class="game-preview-info">
              <h3 class="game-preview-name">{getGameForBooth(selectedBooth).name}</h3>
              <p class="game-preview-genre">{getGameForBooth(selectedBooth).genre}</p>
              <button class="view-btn" on:click={() => push(`/game/${getGameForBooth(selectedBooth).id}`)}>
                查看详情
              </button>
            </div>
          </div>
        {/if}
        
        {#if selectedBooth.isStage}
          <div class="stage-badge">
            <Info class="badge-icon" />
            <span>主舞台区域</span>
          </div>
        {/if}
        
        {#if selectedBooth.isSigning}
          <div class="signing-badge">
            <Info class="badge-icon" />
            <span>签售区域</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .map-page {
    min-height: 100vh;
    padding-bottom: 90px;
    background: #0a0a14;
  }

  .map-header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(10, 10, 20, 0.95);
    backdrop-filter: blur(10px);
    z-index: 10;
  }

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .map-controls {
    display: flex;
    gap: 8px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: #00ffff;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-btn:active {
    background: rgba(0, 255, 255, 0.2);
  }

  .control-icon {
    width: 20px;
    height: 20px;
  }

  .map-container {
    padding: 16px;
    overflow: hidden;
  }

  .map-wrapper {
    transition: transform 0.2s ease;
    transform-origin: center center;
  }

  .floor-map {
    width: 100%;
    height: auto;
    border-radius: 16px;
    border: 1px solid rgba(0, 255, 255, 0.2);
  }

  .booth-svg {
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .booth-rect {
    transition: all 0.2s ease;
  }

  .user-marker {
    pointer-events: none;
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 16px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .legend-dot.high {
    background: #ff3366;
  }

  .legend-dot.medium {
    background: #ffaa00;
  }

  .legend-dot.low {
    background: #00ff88;
  }

  .legend-text {
    font-size: 12px;
    color: #888;
  }

  .booth-detail {
    position: fixed;
    bottom: 80px;
    left: 16px;
    right: 16px;
    background: rgba(20, 20, 35, 0.98);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 16px;
    overflow: hidden;
    z-index: 20;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .booth-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .booth-name {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: #888;
    font-size: 20px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .booth-detail-body {
    padding: 16px;
  }

  .booth-info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .info-label {
    font-size: 14px;
    color: #888;
  }

  .info-value {
    font-size: 14px;
    color: #fff;
    font-weight: 500;
  }

  .crowd-high {
    color: #ff3366;
  }

  .crowd-medium {
    color: #ffaa00;
  }

  .crowd-low {
    color: #00ff88;
  }

  .game-preview {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
  }

  .game-preview-cover {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .game-preview-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .game-preview-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .game-preview-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .game-preview-genre {
    font-size: 12px;
    color: #888;
    margin: 0;
  }

  .view-btn {
    align-self: flex-start;
    margin-top: 4px;
    padding: 6px 12px;
    background: linear-gradient(135deg, #00ffff, #0080ff);
    color: #000;
    border: none;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
  }

  .stage-badge, .signing-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 10px 12px;
    background: rgba(255, 0, 255, 0.1);
    border: 1px solid rgba(255, 0, 255, 0.3);
    border-radius: 8px;
    color: #ff00ff;
    font-size: 13px;
  }

  .signing-badge {
    background: rgba(0, 255, 136, 0.1);
    border-color: rgba(0, 255, 136, 0.3);
    color: #00ff88;
  }

  .badge-icon {
    width: 16px;
    height: 16px;
  }
</style>
