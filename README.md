# 前端监控系统 (Frontend Monitoring System)

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/WHAYL/frontendMonitoring/blob/main/LICENSE)

一套完整的前端监控解决方案，支持浏览器、UniApp、微信小程序等多个平台，帮助开发者实时监控前端应用的运行状态和性能表现。

## 项目结构

本项目采用 monorepo 架构，包含以下子模块：

```
packages/
├── monitor-core/          # 监控核心模块
├── monitor-browser/       # 浏览器端监控 SDK
├── monitor-uniapp/        # UniApp 应用监控 SDK
├── monitor-wxapp/         # 微信小程序监控 SDK
└── monitor-server/        # 监控数据服务端
```

## 功能特性

### monitor-core (核心模块)
- 提供统一的数据结构和基础监控功能
- 支持分级日志管理和灵活的上报机制
- 可配置的本地存储队列

### monitor-browser (浏览器监控)
- **XHR/Fetch 请求监控** - 监控网络请求的成功与失败情况
- **DOM 事件监控** - 监控 DOM 错误、未捕获的 Promise 异常
- **路由变化监控** - 监控页面路由的变化历史
- **页面性能监控** - 监控页面加载性能、长任务、内存使用、FPS 等
- **白屏检测** - 检测页面是否存在白屏问题
- **控制台日志监控** - 监控 console.error 和 console.warn 输出
- **用户行为分析** - 收集 PV、UV、VV 等分析数据

### monitor-uniapp (UniApp 监控)
- **控制台日志监控** - 监控 console.error 和 console.warn 输出
- **错误异常监控** - 监控 JavaScript 错误和未捕获的 Promise 异常
- **路由变化监控** - 监控页面路由的变化历史
- **请求信息监控** - 监控网络请求的成功与失败情况
- **事件拦截监控** - 监控@tap、@click 等事件，在事件方法第一个参数或者最后一个参数传入$event 如下： @tap="handleClick(oth1,oth2,...args,$event)" @tap="handleClick($event,oth1,oth2,...args)"

### monitor-wxapp (微信小程序监控)
- **控制台日志监控** - 监控 console.error 和 console.warn 输出
- **错误异常监控** - 监控 JavaScript 错误和未捕获的 Promise 异常
- **路由变化监控** - 监控页面路由的变化历史
- **请求信息监控** - 监控网络请求的成功与失败情况
- **事件拦截监控** - 监控@tap、@click 等事件，在事件方法第一个参数或者最后一个参数传入$event 如下： @tap="handleClick(oth1,oth2,$event)" @tap="handleClick($event,oth1,oth2)"

### monitor-server (服务端)
- 提供监控数据接收和存储服务
- 支持多种数据库存储方案
- 提供数据分析和查询接口

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 构建项目

```bash
# 构建所有包
pnpm run build

# 开发模式
pnpm run dev
```

### 使用示例

#### 浏览器端使用

```javascript
import BrowserMonitor from '@whayl/monitor-browser';

const monitor = new BrowserMonitor({
  monitorConfig: {
    platform: 'web',
    reportLevel: 'INFO',
    enabled: true,
    uploadHandler: (data) => {
      // 自定义上报逻辑
      fetch('/api/report', { method: 'POST', body: JSON.stringify(data) });
    }
  }
});
```

#### UniApp 使用

```javascript
import UniAppMonitor from '@whayl/monitor-uniapp';

const monitor = new UniAppMonitor({
  monitorConfig: {
    platform: 'uniapp',
    reportLevel: 'INFO',
    enabled: true,
    uploadHandler: (data) => {
      // 自定义上报逻辑
      uni.request({ url: '/api/report', method: 'POST', data: JSON.stringify(data) });
    }
  }
});
```

#### 微信小程序使用

```javascript
import WxAppMonitor from '@whayl/monitor-wxapp';

const monitor = new WxAppMonitor({
  monitorConfig: {
    platform: 'wxapp',
    reportLevel: 'INFO',
    enabled: true,
    uploadHandler: (data) => {
      // 自定义上报逻辑
      wx.request({ url: '/api/report', method: 'POST', data: JSON.stringify(data) });
    }
  }
});
```

## 开发指南

### 项目技术栈

- **语言**: TypeScript
- **包管理**: pnpm
- **构建工具**: Rollup
- **代码规范**: ESLint + Prettier
- **提交规范**: Commitlint + Husky
- **版本管理**: Changesets

### 目录说明

- `packages/monitor-core/` - 核心监控模块，提供基础功能和数据结构
- `packages/monitor-browser/` - 浏览器端监控 SDK
- `packages/monitor-uniapp/` - UniApp 应用监控 SDK
- `packages/monitor-wxapp/` - 微信小程序监控 SDK
- `packages/monitor-server/` - 服务端数据接收和处理

### 命令说明

```bash
# 开发模式
pnpm run dev

# 构建所有包
pnpm run build

# 代码检查和修复
pnpm run lint

# 提交代码变更
pnpm run commitlint

# 版本发布
pnpm run changeset:publish
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助我们改进项目。

### 提交规范

本项目使用 [Commitizen](https://github.com/commitizen/cz-cli) 规范提交信息，请遵循以下格式：

```
<type>(<scope>): <subject>
```

常见的 type 包括：
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 许可证

本项目采用 ISC 许可证，详情请查看 [LICENSE](./LICENSE) 文件。