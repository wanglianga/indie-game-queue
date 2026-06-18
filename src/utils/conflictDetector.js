import { get } from 'svelte/store';
import { signings, events } from '../stores/events.js';

const WALKING_SPEED_PER_UNIT = 0.5;
const BUFFER_MINUTES = 5;

const calculateDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateWalkingTime = (booth1, booth2) => {
  const distance = calculateDistance(
    booth1.boothX || 0,
    booth1.boothY || 0,
    booth2.boothX || 0,
    booth2.boothY || 0
  );
  return Math.ceil(distance * WALKING_SPEED_PER_UNIT);
};

const findRelatedSigning = (gameId) => {
  const $signings = get(signings);
  return $signings.find(s => s.gameId === gameId && (s.status === 'upcoming' || s.status === 'ongoing'));
};

const findRelatedEvent = (gameId, gamesList) => {
  const $events = get(events);
  return $events.find(e => {
    const game = gamesList.find(g => g.boothId === e.boothId);
    return game && game.id === gameId && (e.status === 'upcoming' || e.status === 'ongoing');
  });
};

export const detectConflicts = (queueItems, gamesList) => {
  if (queueItems.length < 2) return [];

  const conflicts = [];
  const itemsWithSchedule = queueItems.map(item => {
    const game = gamesList.find(g => g.id === item.gameId);
    const estimatedTurnTime = item.estimatedTurnTime || Date.now() + item.estimatedWaitMinutes * 60000;
    const estimatedEndTime = estimatedTurnTime + (item.demoDuration || 15) * 60000;
    
    return {
      ...item,
      estimatedTurnTime,
      estimatedEndTime,
      game,
      signing: findRelatedSigning(item.gameId),
      event: findRelatedEvent(item.gameId, gamesList)
    };
  }).sort((a, b) => a.estimatedTurnTime - b.estimatedTurnTime);

  for (let i = 0; i < itemsWithSchedule.length; i++) {
    for (let j = i + 1; j < itemsWithSchedule.length; j++) {
      const itemA = itemsWithSchedule[i];
      const itemB = itemsWithSchedule[j];

      const walkingTime = calculateWalkingTime(itemA, itemB);
      const gapMinutes = (itemB.estimatedTurnTime - itemA.estimatedEndTime) / 60000;

      if (gapMinutes < walkingTime + BUFFER_MINUTES) {
        const conflictType = gapMinutes < 0 ? 'overlap' : 'tight';
        const recommendation = generateRecommendation(itemA, itemB, walkingTime, gapMinutes);

        conflicts.push({
          id: `conflict-${itemA.id}-${itemB.id}`,
          type: conflictType,
          items: [itemA, itemB],
          walkingTime,
          gapMinutes: Math.round(gapMinutes),
          recommendation,
          severity: gapMinutes < -10 ? 'critical' : gapMinutes < 0 ? 'high' : 'medium'
        });
      }

      if (itemB.signing) {
        const signingStart = new Date(itemB.signing.startTime).getTime();
        const signingOverlap = (itemA.estimatedEndTime + walkingTime * 60000) > signingStart;
        if (signingOverlap) {
          conflicts.push({
            id: `conflict-signing-${itemB.id}`,
            type: 'signing_conflict',
            items: [itemA, itemB],
            relatedEvent: itemB.signing,
            eventType: '签售',
            recommendation: {
              keep: itemB.id,
              delay: itemA.id,
              reason: `${itemB.gameName} 的开发者签售会即将开始，建议优先前往`
            },
            severity: 'high'
          });
        }
      }

      if (itemB.event) {
        const eventStart = new Date(itemB.event.startTime).getTime();
        const eventOverlap = (itemA.estimatedEndTime + walkingTime * 60000) > eventStart;
        if (eventOverlap) {
          conflicts.push({
            id: `conflict-event-${itemB.id}`,
            type: 'event_conflict',
            items: [itemA, itemB],
            relatedEvent: itemB.event,
            eventType: '活动',
            recommendation: {
              keep: itemB.id,
              delay: itemA.id,
              reason: `${itemB.gameName} 的${itemB.event.type === 'press' ? '发布会' : '活动'}即将开始，建议优先前往`
            },
            severity: 'high'
          });
        }
      }
    }
  }

  return conflicts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
};

const generateRecommendation = (itemA, itemB, walkingTime, gapMinutes) => {
  const scoreA = calculatePriorityScore(itemA);
  const scoreB = calculatePriorityScore(itemB);

  if (scoreB > scoreA) {
    return {
      keep: itemB.id,
      delay: itemA.id,
      keepName: itemB.gameName,
      delayName: itemA.gameName,
      reason: generateReason(itemA, itemB, walkingTime, gapMinutes, true),
      estimatedDelayMinutes: Math.abs(Math.round(gapMinutes)) + walkingTime + BUFFER_MINUTES
    };
  } else {
    return {
      keep: itemA.id,
      delay: itemB.id,
      keepName: itemA.gameName,
      delayName: itemB.gameName,
      reason: generateReason(itemA, itemB, walkingTime, gapMinutes, false),
      estimatedDelayMinutes: Math.abs(Math.round(gapMinutes)) + walkingTime + BUFFER_MINUTES
    };
  }
};

const calculatePriorityScore = (item) => {
  let score = 0;

  if (item.missRisk === 'high') score += 100;
  else if (item.missRisk === 'medium') score += 50;

  if (item.signing) score += 80;
  if (item.event) score += 70;

  score += Math.max(0, 60 - item.estimatedWaitMinutes);

  score += (item.queueCount || 0) > 10 ? 30 : 0;

  return score;
};

const generateReason = (itemA, itemB, walkingTime, gapMinutes, keepB) => {
  const keepItem = keepB ? itemB : itemA;
  const delayItem = keepB ? itemA : itemB;

  if (gapMinutes < 0) {
    return `时间重叠！${keepItem.gameName} 预计 ${formatTime(keepItem.estimatedTurnTime)} 开始，与 ${delayItem.gameName} 的试玩时间重叠。两地步行需要 ${walkingTime} 分钟，建议先玩 ${keepItem.gameName}。`;
  } else if (gapMinutes < walkingTime) {
    return `时间紧张！${keepItem.gameName} 预计 ${formatTime(keepItem.estimatedTurnTime)} 开始，从 ${delayItem.gameName} 展位步行需要 ${walkingTime} 分钟，但只有 ${Math.round(gapMinutes)} 分钟间隔，建议先玩 ${keepItem.gameName}。`;
  } else {
    return `请注意时间！从 ${delayItem.gameName} 到 ${keepItem.gameName} 步行需要 ${walkingTime} 分钟，建议控制 ${delayItem.gameName} 的试玩时间。`;
  }
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.getHours().toString().padStart(2, '0') + ':' + 
         date.getMinutes().toString().padStart(2, '0');
};

export const getConflictAdvice = (queueItems, gamesList) => {
  const conflicts = detectConflicts(queueItems, gamesList);
  
  if (conflicts.length === 0) {
    return { hasConflicts: false, conflicts: [], summary: '当前排队无冲突' };
  }

  const criticalCount = conflicts.filter(c => c.severity === 'critical').length;
  const highCount = conflicts.filter(c => c.severity === 'high').length;
  const mediumCount = conflicts.filter(c => c.severity === 'medium').length;

  let summary = '';
  if (criticalCount > 0) {
    summary = `⚠️ 发现 ${criticalCount} 个严重时间冲突，建议立即调整`;
  } else if (highCount > 0) {
    summary = `⚠️ 发现 ${highCount} 个时间冲突，建议调整排队顺序`;
  } else {
    summary = `提醒：${mediumCount} 个时间安排较紧张，请注意控制试玩时间`;
  }

  return {
    hasConflicts: true,
    conflicts,
    summary,
    criticalCount,
    highCount,
    mediumCount
  };
};
