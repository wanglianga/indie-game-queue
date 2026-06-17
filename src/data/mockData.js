export const games = [
  {
    id: 'game-001',
    name: '霓虹深渊：无限',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20neon%20dungeon%20game%20cover%20with%20cyberpunk%20style&image_size=square',
    description: '一款横版动作射击游戏，每次探索都是全新体验。',
    developer: '热脉游戏',
    genre: '动作射击',
    demoDuration: 15,
    boothId: 'booth-a01',
    stations: [
      { id: 'st-001-1', name: '1号机', status: 'playing', currentPlayer: '玩家A023' },
      { id: 'st-001-2', name: '2号机', status: 'playing', currentPlayer: '玩家B156' },
      { id: 'st-001-3', name: '3号机', status: 'available', currentPlayer: null },
      { id: 'st-001-4', name: '4号机', status: 'maintenance', currentPlayer: null }
    ],
    queueCount: 8,
    currentNumber: 45,
    status: 'available',
    tags: ['独立', '像素', 'Roguelike']
  },
  {
    id: 'game-002',
    name: '山海旅人',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20mythology%20pixel%20art%20game%20cover%20mountain%20sea%20style&image_size=square',
    description: '中国传统神话题材的冒险解谜游戏，感受独特的古风韵味。',
    developer: '云山小雨工作室',
    genre: '冒险解谜',
    demoDuration: 20,
    boothId: 'booth-a02',
    stations: [
      { id: 'st-002-1', name: '1号机', status: 'playing', currentPlayer: '玩家C089' },
      { id: 'st-002-2', name: '2号机', status: 'available', currentPlayer: null }
    ],
    queueCount: 3,
    currentNumber: 12,
    status: 'available',
    tags: ['独立', '解谜', '国风']
  },
  {
    id: 'game-003',
    name: '戴森球计划',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sci-fi%20space%20factory%20game%20cover%20dyson%20sphere%20program&image_size=square',
    description: '太空自动化工厂模拟游戏，建造属于你的戴森球。',
    developer: '柚子猫游戏',
    genre: '模拟经营',
    demoDuration: 30,
    boothId: 'booth-b01',
    stations: [
      { id: 'st-003-1', name: '1号机', status: 'playing', currentPlayer: '玩家D045' },
      { id: 'st-003-2', name: '2号机', status: 'playing', currentPlayer: '玩家E123' },
      { id: 'st-003-3', name: '3号机', status: 'playing', currentPlayer: '玩家F067' },
      { id: 'st-003-4', name: '4号机', status: 'playing', currentPlayer: '玩家G201' },
      { id: 'st-003-5', name: '5号机', status: 'available', currentPlayer: null }
    ],
    queueCount: 15,
    currentNumber: 78,
    status: 'available',
    tags: ['独立', '模拟', '太空']
  },
  {
    id: 'game-004',
    name: '烟火',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20horror%20game%20cover%20fireworks%20atmospheric&image_size=square',
    description: '一款中国式恐怖悬疑解谜游戏，讲述小镇上的离奇故事。',
    developer: '拾英工作室',
    genre: '恐怖解谜',
    demoDuration: 25,
    boothId: 'booth-b02',
    stations: [
      { id: 'st-004-1', name: '1号机', status: 'playing', currentPlayer: '玩家H056' },
      { id: 'st-004-2', name: '2号机', status: 'paused', currentPlayer: null }
    ],
    queueCount: 6,
    currentNumber: 23,
    status: 'limited',
    tags: ['独立', '恐怖', '剧情']
  },
  {
    id: 'game-005',
    name: '失落城堡',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20castle%20roguelike%20game%20cover%20lost%20castle&image_size=square',
    description: '横版动作冒险游戏，支持多人联机，每次冒险都有新惊喜。',
    developer: 'Hunter Studio',
    genre: '动作冒险',
    demoDuration: 15,
    boothId: 'booth-c01',
    stations: [
      { id: 'st-005-1', name: '1号机', status: 'playing', currentPlayer: '玩家I078' },
      { id: 'st-005-2', name: '2号机', status: 'playing', currentPlayer: '玩家J034' },
      { id: 'st-005-3', name: '3号机', status: 'playing', currentPlayer: '玩家K112' },
      { id: 'st-005-4', name: '4号机', status: 'playing', currentPlayer: '玩家L098' }
    ],
    queueCount: 12,
    currentNumber: 56,
    status: 'available',
    tags: ['独立', '动作', '多人']
  },
  {
    id: 'game-006',
    name: '月影之塔',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hand%20drawn%20puzzle%20adventure%20game%20cover%20moonlight%20tower&image_size=square',
    description: '一款全手绘风格的解谜冒险游戏，在神秘的塔中寻找真相。',
    developer: 'Lantern Studio',
    genre: '解谜冒险',
    demoDuration: 20,
    boothId: 'booth-c02',
    stations: [
      { id: 'st-006-1', name: '1号机', status: 'available', currentPlayer: null },
      { id: 'st-006-2', name: '2号机', status: 'available', currentPlayer: null }
    ],
    queueCount: 1,
    currentNumber: 5,
    status: 'available',
    tags: ['独立', '解谜', '手绘']
  },
  {
    id: 'game-007',
    name: '归家异途2',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=post%20apocalyptic%20survival%20game%20cover%20home%20behind&image_size=square',
    description: '一款roguelike生存冒险游戏，在末日世界中寻找归途。',
    developer: 'TPP Studio',
    genre: '生存冒险',
    demoDuration: 25,
    boothId: 'booth-d01',
    stations: [
      { id: 'st-007-1', name: '1号机', status: 'playing', currentPlayer: '玩家M023' },
      { id: 'st-007-2', name: '2号机', status: 'playing', currentPlayer: '玩家N045' },
      { id: 'st-007-3', name: '3号机', status: 'maintenance', currentPlayer: null }
    ],
    queueCount: 9,
    currentNumber: 34,
    status: 'available',
    tags: ['独立', '生存', 'Roguelike']
  },
  {
    id: 'game-008',
    name: '太吾绘卷',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20martial%20arts%20wuxia%20game%20cover%20scroll%20style&image_size=square',
    description: '一款以武侠为题材的独立游戏，在太吾世界中书写你的传奇。',
    developer: 'ConchShip Games',
    genre: '角色扮演',
    demoDuration: 30,
    boothId: 'booth-d02',
    stations: [
      { id: 'st-008-1', name: '1号机', status: 'playing', currentPlayer: '玩家O067' },
      { id: 'st-008-2', name: '2号机', status: 'playing', currentPlayer: '玩家P089' },
      { id: 'st-008-3', name: '3号机', status: 'playing', currentPlayer: '玩家Q101' },
      { id: 'st-008-4', name: '4号机', status: 'playing', currentPlayer: '玩家R123' },
      { id: 'st-008-5', name: '5号机', status: 'playing', currentPlayer: '玩家S145' },
      { id: 'st-008-6', name: '6号机', status: 'available', currentPlayer: null }
    ],
    queueCount: 20,
    currentNumber: 102,
    status: 'available',
    tags: ['独立', '武侠', '沙盒']
  }
];

export const booths = [
  { id: 'booth-a01', name: 'A01 展位', zone: 'A区', x: 15, y: 20, width: 12, height: 8, gameId: 'game-001', crowdLevel: 'high' },
  { id: 'booth-a02', name: 'A02 展位', zone: 'A区', x: 30, y: 20, width: 12, height: 8, gameId: 'game-002', crowdLevel: 'medium' },
  { id: 'booth-a03', name: 'A03 展位', zone: 'A区', x: 45, y: 20, width: 12, height: 8, gameId: null, crowdLevel: 'low' },
  { id: 'booth-b01', name: 'B01 展位', zone: 'B区', x: 15, y: 40, width: 12, height: 8, gameId: 'game-003', crowdLevel: 'high' },
  { id: 'booth-b02', name: 'B02 展位', zone: 'B区', x: 30, y: 40, width: 12, height: 8, gameId: 'game-004', crowdLevel: 'medium' },
  { id: 'booth-b03', name: 'B03 展位', zone: 'B区', x: 45, y: 40, width: 12, height: 8, gameId: null, crowdLevel: 'low' },
  { id: 'booth-c01', name: 'C01 展位', zone: 'C区', x: 15, y: 60, width: 12, height: 8, gameId: 'game-005', crowdLevel: 'high' },
  { id: 'booth-c02', name: 'C02 展位', zone: 'C区', x: 30, y: 60, width: 12, height: 8, gameId: 'game-006', crowdLevel: 'low' },
  { id: 'booth-d01', name: 'D01 展位', zone: 'D区', x: 65, y: 25, width: 12, height: 8, gameId: 'game-007', crowdLevel: 'medium' },
  { id: 'booth-d02', name: 'D02 展位', zone: 'D区', x: 65, y: 45, width: 12, height: 8, gameId: 'game-008', crowdLevel: 'high' },
  { id: 'booth-stage', name: '主舞台', zone: '舞台区', x: 38, y: 78, width: 24, height: 12, gameId: null, crowdLevel: 'high', isStage: true },
  { id: 'booth-signing', name: '签售区', zone: '签售区', x: 8, y: 78, width: 20, height: 10, gameId: null, crowdLevel: 'medium', isSigning: true },
  { id: 'booth-entrance', name: '入口', zone: '入口', x: 38, y: 2, width: 20, height: 6, gameId: null, crowdLevel: 'medium', isEntrance: true }
];

export const events = [
  {
    id: 'evt-001',
    title: '《霓虹深渊：无限》发布会',
    type: 'press',
    description: '最新DLC内容首次曝光，开发者现场讲解创作历程。',
    boothId: 'booth-stage',
    startTime: '2026-06-17T10:00:00',
    endTime: '2026-06-17T10:45:00',
    status: 'upcoming',
    speaker: '制作人 张三',
    attendees: 0
  },
  {
    id: 'evt-002',
    title: '独立游戏开发者圆桌论坛',
    type: 'forum',
    description: '多位知名独立游戏开发者分享创作心得与经验。',
    boothId: 'booth-stage',
    startTime: '2026-06-17T11:00:00',
    endTime: '2026-06-17T12:00:00',
    status: 'upcoming',
    speaker: '多位嘉宾',
    attendees: 0
  },
  {
    id: 'evt-003',
    title: 'Cosplay 舞台表演',
    type: 'performance',
    description: '精彩的游戏角色Cosplay表演，互动环节有礼品相送。',
    boothId: 'booth-stage',
    startTime: '2026-06-17T14:00:00',
    endTime: '2026-06-17T15:00:00',
    status: 'upcoming',
    speaker: '多个社团',
    attendees: 0
  },
  {
    id: 'evt-004',
    title: '《太吾绘卷》新版本试玩体验',
    type: 'demo',
    description: '最新版本现场试玩，开发团队现场收集反馈。',
    boothId: 'booth-d02',
    startTime: '2026-06-17T13:00:00',
    endTime: '2026-06-17T16:00:00',
    status: 'ongoing',
    speaker: 'ConchShip团队',
    attendees: 0
  },
  {
    id: 'evt-005',
    title: '独立游戏颁奖典礼',
    type: 'award',
    description: '年度最佳独立游戏奖项揭晓，见证荣耀时刻。',
    boothId: 'booth-stage',
    startTime: '2026-06-17T16:30:00',
    endTime: '2026-06-17T18:00:00',
    status: 'upcoming',
    speaker: '主持人 & 嘉宾',
    attendees: 0
  }
];

export const signings = [
  {
    id: 'sign-001',
    gameId: 'game-001',
    gameName: '霓虹深渊：无限',
    developer: '热脉游戏',
    startTime: '2026-06-17T11:00:00',
    endTime: '2026-06-17T12:00:00',
    location: '签售区 A 台',
    status: 'upcoming',
    queueCount: 25,
    maxQueue: 50
  },
  {
    id: 'sign-002',
    gameId: 'game-003',
    gameName: '戴森球计划',
    developer: '柚子猫游戏',
    startTime: '2026-06-17T13:30:00',
    endTime: '2026-06-17T14:30:00',
    location: '签售区 A 台',
    status: 'upcoming',
    queueCount: 40,
    maxQueue: 50
  },
  {
    id: 'sign-003',
    gameId: 'game-008',
    gameName: '太吾绘卷',
    developer: 'ConchShip Games',
    startTime: '2026-06-17T15:00:00',
    endTime: '2026-06-17T16:30:00',
    location: '签售区 B 台',
    status: 'upcoming',
    queueCount: 45,
    maxQueue: 60
  },
  {
    id: 'sign-004',
    gameId: 'game-004',
    gameName: '烟火',
    developer: '拾英工作室',
    startTime: '2026-06-17T10:30:00',
    endTime: '2026-06-17T11:30:00',
    location: '签售区 B 台',
    status: 'ongoing',
    queueCount: 15,
    maxQueue: 40
  }
];

export const floorMap = {
  name: '1F 主展厅',
  width: 100,
  height: 100,
  zones: [
    { id: 'zone-a', name: 'A区', x: 10, y: 15, width: 52, height: 18, color: '#3b82f6' },
    { id: 'zone-b', name: 'B区', x: 10, y: 35, width: 52, height: 18, color: '#10b981' },
    { id: 'zone-c', name: 'C区', x: 10, y: 55, width: 52, height: 18, color: '#f59e0b' },
    { id: 'zone-d', name: 'D区', x: 60, y: 20, width: 22, height: 38, color: '#ef4444' }
  ],
  facilities: [
    { id: 'fac-1', type: 'restroom', name: '洗手间', x: 5, y: 50 },
    { id: 'fac-2', type: 'restroom', name: '洗手间', x: 90, y: 50 },
    { id: 'fac-3', type: 'food', name: '餐饮区', x: 85, y: 75 },
    { id: 'fac-4', type: 'info', name: '服务台', x: 50, y: 5 }
  ]
};
