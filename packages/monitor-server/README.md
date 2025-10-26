# 前端监控服务 (Monitor Server)

一个功能完整的前端监控服务，提供数据收集、分析、告警等功能。

## 功能特性

### 📊 数据分析
- **实时分析**: 活跃会话、错误统计、性能监控
- **用户分析**: 用户行为流程、会话分析、热力图数据
- **性能分析**: Core Web Vitals、页面性能、网络请求分析
- **设备分析**: 浏览器、操作系统、设备类型统计
- **漏斗分析**: 自定义漏斗、转化率分析
- **留存分析**: 用户生命周期、留存率统计

### 🚨 告警系统
- **智能告警**: 基于规则的自动告警
- **多级告警**: 支持不同严重程度的告警
- **告警管理**: 创建、更新、删除告警规则
- **告警记录**: 完整的告警历史记录

### 📈 数据导出
- **多格式导出**: 支持 JSON、CSV 格式
- **完整报告**: 生成综合分析报告
- **用户行为导出**: 导出用户行为数据

## 模块化架构

### 🏗️ 目录结构
```
src/
├── controllers/           # 控制器层
│   ├── DataCollectionController.ts    # 数据收集控制器
│   ├── AnalyticsController.ts        # 分析控制器
│   ├── AlertController.ts            # 告警控制器
│   ├── DataQueryController.ts        # 数据查询控制器
│   └── index.ts                      # 控制器导出
├── services/             # 服务层
│   ├── analytics/        # 分析服务
│   │   ├── BaseAnalytics.ts          # 基础分析
│   │   ├── RealtimeAnalytics.ts      # 实时分析
│   │   ├── UserAnalytics.ts          # 用户分析
│   │   ├── PerformanceAnalytics.ts   # 性能分析
│   │   ├── DeviceAnalytics.ts        # 设备分析
│   │   ├── FunnelAnalytics.ts        # 漏斗分析
│   │   ├── RetentionAnalytics.ts     # 留存分析
│   │   ├── AlertAnalytics.ts         # 告警分析
│   │   ├── ExportService.ts          # 导出服务
│   │   └── index.ts                  # 分析服务导出
│   ├── AlertService.ts               # 告警服务
│   ├── DataProcessingService.ts      # 数据处理服务
│   └── index.ts                      # 服务导出
├── routes/               # 路由层
│   ├── dataCollection.ts             # 数据收集路由
│   ├── analytics.ts                  # 分析路由
│   ├── alerts.ts                     # 告警路由
│   ├── dataQuery.ts                 # 数据查询路由
│   ├── health.ts                    # 健康检查路由
│   └── index.ts                     # 路由配置
├── database/             # 数据库层
│   ├── models/           # 数据模型
│   └── index.ts         # 数据库配置
└── index.ts             # 应用入口
```

### 🔧 核心模块

#### 1. 数据收集模块
- **用户会话**: 会话开始/结束、持续时间、页面浏览
- **页面访问**: 页面性能指标、加载时间、Core Web Vitals
- **用户行为**: 点击、滚动、路由变化等交互行为
- **网络请求**: HTTP请求统计、响应时间、错误率
- **性能指标**: 自定义性能指标收集

#### 2. 分析模块
- **实时分析**: 当前活跃用户、错误率、性能状态
- **用户分析**: 用户行为流程、热力图、交互统计
- **性能分析**: 页面性能趋势、Core Web Vitals分析
- **设备分析**: 浏览器、操作系统、设备类型分布
- **漏斗分析**: 自定义漏斗步骤、转化率计算
- **留存分析**: 用户留存率、生命周期分析

#### 3. 告警模块
- **规则管理**: 创建、更新、删除告警规则
- **自动检查**: 定时检查告警条件
- **告警记录**: 告警历史、解决状态
- **多级告警**: 支持不同严重程度

#### 4. 数据查询模块
- **会话查询**: 根据用户指纹查询会话
- **行为查询**: 查询用户行为记录
- **性能查询**: 查询性能指标数据
- **网络查询**: 查询网络请求记录

## API 接口

### 数据收集接口
```http
POST /api/monitor/session          # 保存用户会话
POST /api/monitor/page-visit      # 保存页面访问
POST /api/monitor/performance      # 保存性能指标
POST /api/monitor/behavior         # 保存用户行为
POST /api/monitor/network          # 保存网络请求
```

### 分析接口
```http
GET /api/monitor/analytics/realtime    # 获取实时分析数据
GET /api/monitor/analytics/users        # 获取用户分析数据
GET /api/monitor/analytics/performance  # 获取性能分析数据
GET /api/monitor/analytics/devices      # 获取设备分析数据
GET /api/monitor/analytics/alerts       # 获取告警分析数据
GET /api/monitor/analytics/funnel       # 获取漏斗分析数据
GET /api/monitor/analytics/retention    # 获取留存分析数据
GET /api/monitor/export                 # 导出分析数据
```

### 告警管理接口
```http
POST /api/monitor/alerts/rules          # 创建告警规则
GET /api/monitor/alerts/rules           # 获取告警规则列表
PUT /api/monitor/alerts/rules/:id       # 更新告警规则
DELETE /api/monitor/alerts/rules/:id    # 删除告警规则
GET /api/monitor/alerts/records         # 获取告警记录
PUT /api/monitor/alerts/records/:id/resolve  # 解决告警
```

### 数据查询接口
```http
GET /api/monitor/sessions               # 获取用户会话
GET /api/monitor/page-visits            # 获取页面访问记录
GET /api/monitor/behaviors              # 获取用户行为记录
GET /api/monitor/network-requests       # 获取网络请求记录
GET /api/monitor/performance-metrics    # 获取性能指标记录
GET /api/monitor/behavior-flow          # 获取用户行为流程
GET /api/monitor/overview               # 获取系统概览
```

### 健康检查接口
```http
GET /health                            # 健康检查
GET /                                  # API文档和状态
```

## 使用示例

### 1. 启动服务
```bash
npm run dev
# 或
pnpm dev
```

### 2. 发送监控数据
```javascript
// 发送用户会话数据
fetch('/api/monitor/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session_123',
    fingerprint: 'user_fingerprint',
    startTime: Date.now(),
    platform: 'web',
    browser: 'Chrome',
    os: 'Windows'
  })
});

// 发送页面访问数据
fetch('/api/monitor/page-visit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session_123',
    url: 'https://example.com/page',
    loadTime: 1500,
    firstPaintTime: 800
  })
});
```

### 3. 获取分析数据
```javascript
// 获取实时分析数据
const realtimeData = await fetch('/api/monitor/analytics/realtime').then(r => r.json());

// 获取用户分析数据
const userData = await fetch('/api/monitor/analytics/users?startDate=1640995200000&endDate=1641081600000').then(r => r.json());

// 获取性能分析数据
const performanceData = await fetch('/api/monitor/analytics/performance').then(r => r.json());
```

## 配置说明

### 环境变量
```bash
PORT=3001                    # 服务端口
NODE_ENV=development         # 环境模式
```

### 数据库配置
服务使用 SQLite 数据库，数据库文件位于 `data/monitor.db`。

## 开发指南

### 添加新的分析功能
1. 在 `src/services/analytics/` 下创建新的分析服务
2. 在 `src/controllers/AnalyticsController.ts` 中添加控制器方法
3. 在 `src/routes/analytics.ts` 中添加路由
4. 更新 API 文档

### 添加新的数据模型
1. 在 `src/database/models/` 下创建新的模型文件
2. 在 `src/database/index.ts` 中添加表创建语句
3. 在相应的控制器中添加处理方法

## 技术栈

- **Node.js**: 运行时环境
- **Koa.js**: Web 框架
- **TypeScript**: 编程语言
- **SQLite**: 数据库
- **pnpm**: 包管理器

## 许可证

MIT License