# 独立游戏展试玩排队系统

## 原始需求

> 请制作独立游戏展试玩排队页面，Svelte 页面给观众扫码后在展馆内使用，内容包括楼层地图、作品封面、试玩机位、等候人数、演示时长、开发者签售、舞台活动和收藏夹。玩家可以把想玩的作品加入队伍，看到当前叫号、预计轮到时间、附近展位和取消影响；主办方大屏展示拥挤区域、暂停试玩、临时加机和即将开始的发布环节。界面要适应嘈杂展厅和弱网环境，地图、列表、提醒层之间切换要快，玩家低头看一眼就知道下一步往哪里走。

## 项目简介

这是一个基于 Svelte 5 + Vite 的独立游戏展试玩排队系统，包含观众端移动端页面和主办方大屏监控端。

### 观众端功能
- 🏠 **首页** - 快速入口、我的排队、热门游戏、即将开始的活动、人流概况
- 🗺️ **楼层地图** - 交互式展馆地图、展位详情、人流热力指示
- 🎮 **游戏列表** - 全部游戏浏览、搜索筛选、排序
- 📋 **游戏详情** - 作品封面、试玩机位状态、等候人数、演示时长、加入排队
- ⏰ **我的排队** - 当前排队状态、叫号进度、预计等待时间、取消排队
- ❤️ **收藏夹** - 收藏的游戏、活动、展位
- 🎪 **舞台活动** - 发布会、论坛、表演、颁奖等活动日程
- ✍️ **开发者签售** - 签售活动列表、排队状态

### 主办方大屏功能
- 📊 **监控大屏** - 区域人流热力、拥挤预警、展馆实时地图、热门游戏排行、活动日程、实时数据
- ⚙️ **控制中心** - 游戏试玩管理（临时加机、暂停/恢复）、区域人流管理、公告广播、系统设置

## 技术栈

- **框架**: Svelte 5
- **构建工具**: Vite 8
- **样式**: Tailwind CSS 3
- **路由**: svelte-spa-router
- **图标**: @lucide/svelte
- **状态管理**: Svelte Stores (writable + derived)
- **数据持久化**: localStorage

## 目录结构

```
src/
├── data/
│   └── mockData.js          # Mock 数据（游戏、展位、活动、签售、地图
├── stores/
│   ├── games.js                # 游戏列表 store
│   ├── queue.js                # 用户排队 store
│   ├── favorites.js            # 收藏夹 store
│   ├── booths.js               # 展位 store
│   ├── events.js              # 活动 & 签售 store
│   ├── user.js                 # 用户 store
│   └── ui.js                   # 界面设置 store
├── components/
│   └── layout/
│       ├── BottomNav.svelte   # 底部导航
│       ├── PageHeader.svelte  # 页面标题栏
│       └── LoadingOverlay.svelte # 加载遮罩
├── routes/
│   ├── Home.svelte            # 首页
│   ├── Map.svelte             # 楼层地图
│   ├── Games.svelte          # 游戏列表
│   ├── GameDetail.svelte   # 游戏详情
│   ├── Queue.svelte          # 我的排队
│   ├── Favorites.svelte    # 收藏夹
│   ├── Events.svelte         # 舞台活动
│   ├── Signing.svelte       # 开发者签售
│   └── admin/
│       ├── Dashboard.svelte  # 主办方大屏
│       └── Control.svelte    # 控制中心
├── routes.js                   # 路由配置
├── App.svelte                  # 主应用组件
├── main.js                     # 入口文件
└── app.css                     # 全局样式
```

## 启动方式

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 或 npm >= 9.0.0

### 启动步骤

#### 1. 安装依赖

```bash
pnpm install
```

或使用 npm：

```bash
npm install
```

#### 2. 启动开发服务

```bash
pnpm dev
```

或使用 npm：

```bash
npm run dev
```

访问地址：http://localhost:5173

#### 3. 构建生产版本

```bash
pnpm build
```

#### 4. 预览生产构建

```bash
pnpm preview
```

## Docker 一键启动

### 前置要求

- Docker >= 24.0.0
- Docker Compose >= 2.20.0

### 启动步骤

#### 1. 一键构建并启动

```bash
docker compose up --build
```

后台运行：

```bash
docker compose up --build -d
```

#### 2. 访问应用

访问地址：http://localhost:5173

#### 3. 查看日志

```bash
docker compose logs
```

#### 4. 停止和清理服务

```bash
docker compose down
```

## 页面访问路径

- 观众端首页: `/`
- 楼层地图: `/map`
- 游戏列表: `/games`
- 游戏详情: `/game/:id`
- 我的排队: `/queue`
- 收藏夹: `/favorites`
- 舞台活动: `/events`
- 开发者签售: `/signing`
- 主办方大屏: `/admin`
- 主办方控制中心: `/admin/control`

## 设计特点

### 适应嘈杂展厅和弱网环境：
- 大字体、高对比度设计，信息一目了然
- 数据本地存储，弱网下也能正常使用
- 地图、列表、排队之间快速切换
- 重要信息高亮显示，玩家低头看一眼就知道下一步
- 霓虹发光效果在嘈杂环境中也能快速识别

### 霓虹赛博朋克风格：
- 深色背景搭配青色/紫色霓虹发光效果
- 渐变色彩：#00ffff 青色
- 强调色：#ff00ff 紫色
- 警示色：#ff3366 红色
- 成功色：#00ff88 绿色

## Stores API 说明

### games.js - 游戏列表 Store

- **games**: 可写 store，游戏列表数据
- **joinQueue(gameId)**: 加入游戏排队
- **leaveQueue(gameId)**: 离开游戏排队
- **updateGameStatus(gameId, status)**: 更新游戏状态
- **addStation(gameId, station)**: 添加/更新游戏展位
- **updateStationStatus(gameId, stationId, status)**: 更新机位状态
- **callNextNumber(gameId)**: 叫下一号
- **getGameById(gameId)**: 根据 ID 获取游戏
- **availableGames**: 派生 store，可玩游戏列表
- **playingGames**: 派生 store，正在游戏的列表
- **gamesByZone**: 派生 store，按区域分组的游戏
- **highQueueGames**: 派生 store，排队最多的游戏

### queue.js - 用户排队 Store

- **myQueue**: 可写 store，用户排队记录（localStorage 持久化）
- **addToQueue(gameId, gameName, station)**: 添加排队
- **removeFromQueue(queueId)**: 移除排队
- **updateQueueStatus(queueId, status)**: 更新排队状态
- **activeQueue**: 派生 store，活跃排队列表
- **queueHistory**: 派生 store，排队历史记录
- **queueCount**: 派生 store，当前排队数量
- **nextUpQueue**: 派生 store，即将轮到的排队

### favorites.js - 收藏夹 Store

- **favorites**: 可写 store，收藏列表（localStorage 持久化）
- **toggleFavorite(itemId, itemType, extraData)**: 切换收藏状态
- **isFavorite(itemId, itemType)**: 检查是否已收藏
- **favoriteGames**: 派生 store，收藏的游戏
- **favoriteBooths**: 派生 store，收藏的展位
- **favoriteEvents**: 派生 store，收藏的活动
- **favoritesCount**: 派生 store，收藏总数

### booths.js - 展位 Store

- **booths**: 可写 store，展位列表
- **crowdZones**: 可写 store，人群密度区域
- **getBoothById(boothId)**: 根据 ID 获取展位
- **getNearbyBooths(x, y, radius)**: 获取附近的展位
- **updateCrowdLevel(boothId, crowdLevel)**: 更新人流等级
- **boothsByZone**: 派生 store，按区域分组的展位
- **highCrowdBooths**: 派生 store，高人流展位
- **boothsWithGames**: 派生 store，有游戏的展位

### events.js - 活动 Store

- **events**: 可写 store，活动列表
- **signings**: 可写 store，签名会列表
- **getUpcomingEvents()**: 获取即将开始的活动
- **getOngoingEvents()**: 获取正在进行的活动
- **upcomingEvents**: 派生 store，即将开始的活动
- **ongoingEvents**: 派生 store，正在进行的活动
- **eventsByType**: 派生 store，按类型分组的活动
- **upcomingSignings**: 派生 store，即将开始的签名会
- **ongoingSignings**: 派生 store，正在进行的签名会
- **nextEvents**: 派生 store，接下来的活动和签售

### user.js - 用户 Store

- **user**: 可写 store，用户信息（localStorage 持久化）
- **updateUser(data)**: 更新用户信息
- **resetUser()**: 重置用户

### ui.js - 界面设置 Store

- **ui**: 可写 store，界面设置（localStorage 持久化）
- **setBrightness(value)**: 设置亮度
- **setContrast(value)**: 设置对比度
- **toggleHighContrast()**: 切换高对比度模式
- **setFontSize(size)**: 设置字体大小
- **toggleReduceMotion()**: 切换减少动画
- **setTheme(theme)**: 设置主题
- **resetSettings()**: 重置所有设置
