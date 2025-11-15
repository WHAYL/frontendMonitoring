# monitor-browser

浏览器端监控 SDK，提供对浏览器环境中各种指标的监控，包括：XHR/Fetch 请求、DOM 事件、路由变化、页面性能、白屏检测、控制台日志以及用户行为分析等。

## 功能特性

monitor-browser 提供以下监控功能：

1. **XHR 请求监控** - 监控 XMLHttpRequest 请求的成功与失败情况
2. **Fetch 请求监控** - 监控 Fetch API 请求的成功与失败情况
3. **DOM 事件监控** - 监控 DOM 错误、未捕获的 Promise 异常以及其他 DOM 交互事件
4. **路由变化监控** - 监控页面路由的变化历史
5. **页面性能监控** - 监控页面加载性能、长任务、内存使用、FPS 等性能指标
6. **白屏检测** - 检测页面是否存在白屏问题
7. **控制台日志监控** - 监控 console.error 和 console.warn 输出
8. **用户行为分析** - 收集页面浏览量(PV)、独立访客(UV)、访问次数(VV)等分析数据

## 安装

```bash
npm install @whayl/monitor-browser
```

## 配置项

### BrowserMonitorConfig

创建 [BrowserMonitor](#browsermonitor) 实例时需要传入配置对象：

```typescript
interface BrowserMonitorConfig {
  monitorConfig: MonitorConfig;
  pluginsUse?: {
    xhrPluginEnabled?: boolean;           // 启用 XHR 插件，默认: true
    fetchPluginEnabled?: boolean;         // 启用 Fetch 插件，默认: true
    domPluginEnabled?: boolean;           // 启用 DOM 插件，默认: true
    routePluginEnabled?: boolean;         // 启用路由插件，默认: true
    performancePluginEnabled?: boolean;   // 启用性能插件，默认: true
    whiteScreenPluginEnabled?: boolean;   // 启用白屏检测插件，默认: true
    consolePluginEnabled?: boolean;       // 启用控制台插件，默认: true
    analyticsPluginEnabled?: boolean;     // 启用分析插件，默认: true
  };
  whiteScreenPluginConfig?: WhiteScreenPluginConfig;
  consolePluginConfig?: ConsolePluginConfig;
  domPluginConfig?: DomPluginConfig;
  performancePluginConfig?: PerformancePluginConfig;
  analyticsPluginConfig?: AnalyticsPluginConfig;
}
```

### 插件详细配置

#### WhiteScreenPluginConfig

白屏检测插件配置：

```typescript
interface WhiteScreenPluginConfig {
  keySelectors?: string[];  // 关键渲染元素选择器
  checkInterval?: number;   // 检测间隔(ms)，默认: 1000
  timeout?: number;         // 超时时间(ms)，默认: 5000
}
```

#### ConsolePluginConfig

控制台日志插件配置：

```typescript
interface ConsolePluginConfig {
  error?: boolean;  // 监控 console.error，默认: true
  warn?: boolean;   // 监控 console.warn，默认: false
}
```

#### DomPluginConfig

DOM 事件插件配置：

```typescript
interface DomPluginConfig {
  error?: boolean;               // 监控 JavaScript 错误事件，默认: true
  unhandledrejection?: boolean;  // 监控未处理的 Promise 异常，默认: true
  mouseEvents?: {                // 监控鼠标事件
    click?: string[] | boolean;
    dblclick?: string[] | boolean;
    // ... 其他鼠标事件
  }
  resize?: boolean;              // 监控窗口大小变化，默认: false
  clickPath?: boolean;           // 记录点击路径，默认: false
}
```

#### PerformancePluginConfig

性能监控插件配置：

```typescript
interface PerformancePluginConfig {
  longTaskEnabled?: boolean;     // 监控长任务，默认: true
  memoryEnabled?: boolean;       // 监控内存使用情况，默认: true
  fpsEnabled?: boolean;          // 监控 FPS，默认: true
  resourceEnabled?: boolean;     // 监控资源加载，默认: true
  navigationEnabled?: boolean;   // 监控导航性能，默认: true
  webVitalsEnabled?: boolean;    // 监控 Web Vitals 指标，默认: true
}
```

#### AnalyticsPluginConfig

用户行为分析插件配置：

```typescript
interface AnalyticsPluginConfig {
  ipProvider?: () => Promise<string | null>; // 获取公网 IP 的异步函数
}
```

### MonitorConfig

核心监控配置：

```typescript
interface MonitorConfig {
  platform: string;                     // 平台名称，如 'web'
  reportLevel: ReportingLevel;          // 上报等级 ('ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'OFF')
  enabled: boolean;                     // 是否启用监控，默认: true
  uploadHandler: (data: ErrorInfo | ErrorInfo[]) => void; // 自定义上传处理函数
  maxStorageCount?: number;             // 本地存储最大数量，默认: 100
  fingerprint?: string                  // 浏览器指纹
}
```

## 使用方式

### 基本使用

```javascript
import BrowserMonitor from '@whayl/monitor-browser';

const monitor = new BrowserMonitor({
  monitorConfig: {
    platform: 'web',
    reportLevel: 'INFO',
    enabled: true,
    uploadHandler: (data) => {
      // 自定义上报逻辑
      console.log('上报数据:', data);
      // 例如发送到服务器
      // fetch('/api/report', { method: 'POST', body: JSON.stringify(data) });
    }
  },
  pluginsUse: {
    // 可以按需启用/禁用插件
    xhrPluginEnabled: true,
    fetchPluginEnabled: true,
    // ...
  }
});
```

### 设置浏览器指纹

```javascript
// 设置浏览器指纹
monitor.setFingerprint('unique-browser-id');

// 获取浏览器指纹
const fingerprint = monitor.getFingerprint();
```

### 添加自定义插件

可以通过 [use](#use) 方法添加自定义插件：

```javascript
monitor.use({
  name: 'CustomPlugin',
  init: ({ reportInfo, getFingerprint }) => {
    // 插件初始化逻辑
    // 使用 reportInfo 上报数据
    // 使用 getFingerprint 获取浏览器指纹
  },
  destroy: () => {
    // 插件销毁逻辑
  }
});
```

### 销毁监控实例

```javascript
// 销毁监控实例并清理资源
monitor.destroy();
```

## API 参考

### BrowserMonitor

浏览器监控主类。

#### constructor(config: BrowserMonitorConfig)

创建一个新的监控实例。

#### setFingerprint(value: string)

设置浏览器指纹。

#### getFingerprint()

获取当前浏览器指纹。

#### use(plugin: BrowserMonitorPlugin)

添加一个插件。

#### reportInfo(type: ReportingLevel, data: BrowserLogData)

手动上报日志信息。

#### destroy()

销毁监控实例并清理相关资源。

## 插件说明

每个插件负责特定类型的监控：

| 插件 | 功能 |
|------|------|
| [XhrPlugin](./src/plugins/xhr.ts) | XMLHttpRequest 请求监控 |
| [FetchPlugin](./src/plugins/fetch.ts) | Fetch API 请求监控 |
| [DomPlugin](./src/plugins/dom.ts) | DOM 事件及错误监控 |
| [RoutePlugin](./src/plugins/route.ts) | 路由变化监控 |
| [PerformancePlugin](./src/plugins/performance.ts) | 页面性能监控 |
| [WhiteScreenPlugin](./src/plugins/whiteScreen.ts) | 白屏检测 |
| [ConsolePlugin](./src/plugins/console.ts) | 控制台日志监控 |
| [AnalyticsPlugin](./src/plugins/analytics.ts) | 用户行为分析 |

## 数据上报格式

监控数据通过配置中的 `uploadHandler` 函数进行上报，数据格式为：

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

其中 [LogData](./src/type.ts) 包含:

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