<script>
  import { Clock, Calendar, Users, MapPin, Star } from '@lucide/svelte';
  import { upcomingEvents, ongoingEvents } from '../stores/events.js';
  import { favorites } from '../stores/favorites.js';

  let activeTab = 'all';

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

  const getTypeLabel = (type) => {
    const types = {
      press: '发布会',
      forum: '论坛',
      performance: '表演',
      demo: '试玩',
      award: '颁奖'
    };
    return types[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      press: '#00ffff',
      forum: '#ff00ff',
      performance: '#ffaa00',
      demo: '#00ff88',
      award: '#ff3366'
    };
    return colors[type] || '#888';
  };

  const toggleFav = (eventId, event) => {
    favorites.toggleFavorite(eventId, 'event', {
      title: event.title,
      location: event.boothId
    });
  };

  const isFav = (eventId) => {
    let result = false;
    favorites.subscribe(f => {
      result = f.some(item => item.id === eventId && item.type === 'event');
    })();
    return result;
  };
</script>

<div class="events-page">
  <div class="page-header">
    <h1 class="page-title">舞台活动</h1>
  </div>

  <div class="tabs">
    <button class="tab-btn {activeTab === 'all' ? 'active' : ''}" on:click={() => activeTab = 'all'}>
      全部
    </button>
    <button class="tab-btn {activeTab === 'ongoing' ? 'active' : ''}" on:click={() => activeTab = 'ongoing'}>
      进行中
    </button>
    <button class="tab-btn {activeTab === 'upcoming' ? 'active' : ''}" on:click={() => activeTab = 'upcoming'}>
      即将开始
    </button>
  </div>

  <div class="events-content">
    {#if activeTab === 'all' || activeTab === 'ongoing'}
      {#if $ongoingEvents.length > 0}
        <div class="section">
          <h2 class="section-title">
            <span class="live-dot"></span>
            正在进行
          </h2>
          <div class="event-list">
            {#each $ongoingEvents as event}
              <div class="event-card ongoing">
                <div class="event-time-col">
                  <span class="event-time">{formatTime(event.startTime)}</span>
                  <span class="event-duration">{formatDuration(event.startTime, event.endTime)}</span>
                </div>
                <div class="event-main">
                  <div class="event-header">
                    <span 
                      class="event-type"
                      style="background: {getTypeColor(event.type)}20; color: {getTypeColor(event.type)}"
                    >
                      {getTypeLabel(event.type)}
                    </span>
                    <button 
                      class="fav-btn {isFav(event.id) ? 'active' : ''}"
                      on:click={() => toggleFav(event.id, event)}
                    >
                      <Star class="fav-icon" fill={isFav(event.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <h3 class="event-title">{event.title}</h3>
                  <div class="event-meta">
                    <div class="meta-item">
                      <MapPin class="meta-icon" />
                      <span>{event.boothId}</span>
                    </div>
                    <div class="meta-item">
                      <Users class="meta-icon" />
                      <span>{event.attendees} 人关注</span>
                    </div>
                  </div>
                  {#if event.speaker}
                    <p class="event-speaker">
                      <Calendar class="speaker-icon" />
                      {event.speaker}
                    </p>
                  {/if}
                  <p class="event-desc">{event.description}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/if}

    {#if activeTab === 'all' || activeTab === 'upcoming'}
      <div class="section">
        <h2 class="section-title">即将开始</h2>
        <div class="event-list">
          {#each $upcomingEvents as event}
            <div class="event-card upcoming">
              <div class="event-time-col">
                <span class="event-time">{formatTime(event.startTime)}</span>
                <span class="event-duration">{formatDuration(event.startTime, event.endTime)}</span>
              </div>
              <div class="event-main">
                <div class="event-header">
                  <span 
                    class="event-type"
                    style="background: {getTypeColor(event.type)}20; color: {getTypeColor(event.type)}"
                  >
                    {getTypeLabel(event.type)}
                  </span>
                  <button 
                    class="fav-btn {isFav(event.id) ? 'active' : ''}"
                    on:click={() => toggleFav(event.id, event)}
                  >
                    <Star class="fav-icon" fill={isFav(event.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <h3 class="event-title">{event.title}</h3>
                <div class="event-meta">
                  <div class="meta-item">
                    <MapPin class="meta-icon" />
                    <span>{event.boothId}</span>
                  </div>
                  <div class="meta-item">
                    <Clock class="meta-icon" />
                    <span>{formatDuration(event.startTime, event.endTime)}</span>
                  </div>
                </div>
                {#if event.speaker}
                  <p class="event-speaker">
                    <Calendar class="speaker-icon" />
                    {event.speaker}
                  </p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .events-page {
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

  .tabs {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #888;
    font-size: 13px;
    border-radius: 10px;
    cursor: pointer;
  }

  .tab-btn.active {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.4);
    color: #00ffff;
  }

  .events-content {
    padding: 0 16px;
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
    margin: 0 0 12px;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    background: #ff3366;
    border-radius: 50%;
    animation: blink 1.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .event-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .event-card {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }

  .event-card.ongoing {
    border-color: rgba(255, 51, 102, 0.3);
    background: rgba(255, 51, 102, 0.05);
  }

  .event-time-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
    padding-top: 4px;
  }

  .event-time {
    font-size: 18px;
    font-weight: 700;
    color: #00ffff;
  }

  .event-card.ongoing .event-time {
    color: #ff3366;
  }

  .event-duration {
    font-size: 11px;
    color: #666;
    margin-top: 4px;
  }

  .event-main {
    flex: 1;
    min-width: 0;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .event-type {
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 500;
    border-radius: 6px;
  }

  .fav-btn {
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fav-btn.active {
    color: #ffaa00;
  }

  .fav-icon {
    width: 18px;
    height: 18px;
  }

  .event-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 8px;
  }

  .event-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #888;
  }

  .meta-icon {
    width: 14px;
    height: 14px;
  }

  .event-speaker {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #aaa;
    margin: 0 0 8px;
  }

  .speaker-icon {
    width: 14px;
    height: 14px;
    color: #ff00ff;
  }

  .event-desc {
    font-size: 13px;
    color: #888;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
