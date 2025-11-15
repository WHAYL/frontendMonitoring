# monitor-core

监控 SDK 的核心模块，提供了监控的基本功能和类型定义。这是所有平台监控 SDK 的基础依赖。

## 功能特性

1. **统一的数据结构** - 提供标准化的监控数据结构定义
2. **灵活的上报机制** - 支持自定义上报处理函数
3. **分级日志管理** - 支持不同级别的日志管理和过滤
4. **本地存储队列** - 支持将未达到上报条件的日志存储到本地队列
5. **浏览器指纹管理** - 支持设置和管理浏览器指纹
6. **可配置性** - 提供丰富的配置选项

## 安装

```bash
npm install @whayl/monitor-core
```

## 核心概念

### 日志分类 (LogCategory)

系统预定义了多种日志分类：

- `oth` (0) - 其他
- `pageLifecycle` (1) - 页面生命周期
- `error` (2) - JS 错误、未处理的 Promise、console.error
- `xhrFetch` (3) - XHR/Fetch 请求信息
- `pagePerformance` (4) - 页面性能相关数据
- `osView` (5) - 系统相关访问数据
- `resource` (6) - 资源加载信息
- `userBehavior` (7) - 用户行为

### 上报等级 (ReportingLevel)

日志按照严重程度分为以下几个等级：

- `ERROR` - 错误级别
- `WARN` - 警告级别
- `INFO` - 信息级别
- `DEBUG` - 调试级别
- `OFF` - 关闭上报

## 配置项

### MonitorConfig

核心监控配置：

```typescript
interface MonitorConfig {
  platform: string;                     // 平台名称，如 'web', 'uniapp', 'wxapp'
  reportLevel: ReportingLevel;          // 上报等级阈值
  enabled: boolean;                     // 是否启用监控
  uploadHandler: (data: ErrorInfo | ErrorInfo[]) => void; // 自定义上传处理函数
  maxStorageCount?: number;             // 本地存储最大数量，默认为 100
  fingerprint?: string                  // 浏览器指纹
}
```

## 使用方式

### 基本使用

```javascript
import { FrontendMonitor } from '@whayl/monitor-core';

const monitor = new FrontendMonitor();

// 初始化配置
monitor.init({
  platform: 'web',
  reportLevel: 'INFO',
  enabled: true,
  uploadHandler: (data) => {
    // 自定义上报逻辑
    console.log('上报数据:', data);
    // 例如发送到服务器
    // fetch('/api/report', { method: 'POST', body: JSON.stringify(data) });
  }
});

// 上报信息
monitor.reportInfo('INFO', {
  logCategory: 0, // oth 分类
  pluginName: 'custom-plugin',
  message: '这是一条自定义信息',
  url: window.location.href,
  extraData: { customField: 'customValue' },
  timestamp: Date.now(),
  date: new Date().toISOString()
});
```

### 设置浏览器指纹

```javascript
// 设置浏览器指纹
monitor.setFingerprint('unique-browser-id');

// 获取浏览器指纹
const fingerprint = monitor.getFingerprint();
```

### 更新配置

```javascript
// 动态更新配置
monitor.updateConfig({
  reportLevel: 'ERROR', // 只上报 ERROR 级别及以上日志
  enabled: false        // 禁用监控
});
```

### 管理存储队列

```javascript
// 获取存储队列中的日志
const queue = monitor.getStorageQueue();

// 清空存储队列
monitor.clearStorageQueue();

// 上报存储队列中的所有信息
monitor.reportStorageQueue();

// 上报所有剩余信息（包括存储队列和被移除的信息）
monitor.reportRestInfo();
```

## API 参考

### FrontendMonitor

监控核心类。

#### constructor()

创建一个新的监控实例。

#### init(config: MonitorConfig)

初始化监控配置。

#### getConfig()

获取当前配置。

#### updateConfig(newConfig: Partial<MonitorConfig>)

更新监控配置。

#### getFingerprint()

获取当前浏览器指纹。

#### setFingerprint(fingerprint: string)

设置浏览器指纹。

#### reportInfo(level: ReportingLevel, info: LogData)

上报日志信息。

#### updateReportLevel(level: ReportingLevel)

更新上报等级。

#### getStorageQueue()

获取存储队列。

#### clearStorageQueue()

清空存储队列。

#### reportStorageQueue()

上报存储队列中的所有信息。

#### reportRemovedItems()

上报被移除的所有信息。

#### reportRestInfo()

上报所有剩余信息。

#### destroy()

销毁监控实例并清理资源。

## 数据结构

### LogData

基本日志数据结构：

```typescript
interface LogData {
  logCategory: LogCategoryValue;  // 日志分类
  pluginName: string;             // 插件名称
  message: string;                // 日志消息
  url: string;                    // 当前页面 URL
  extraData: Record<string, any>; // 插件特定的额外数据
  timestamp: number;              // 时间戳
  date: string;                   // 格式化的时间
  deviceInfo: DeviceInfo;         // 设备信息
}
```

### ErrorInfo

错误信息结构，继承自 LogData：

```typescript
interface ErrorInfo extends LogData {
  level: ReportingLevel;     // 错误等级
  message: string;           // 错误消息
  stack?: string;            // 错误堆栈
  fingerprint: string;       // 当前浏览器指纹
  oldFingerprint: string;    // 旧浏览器指纹
  platform: string;          // 平台标识
}
```

### DeviceInfo

设备信息结构：

```typescript
interface DeviceInfo {
  width: number;      // 屏幕宽度
  height: number;     // 屏幕高度
  pixelRatio: number; // 设备像素比
}
```

## 常量

- `MYSTORAGE_COUNT` - 默认本地存储最大数量 (100)
- `IMMEDIATE_REPORT_LEVEL` - 默认立即上报等级 ('ERROR')