# monitor-wxapp

微信小程序监控 SDK，专为微信小程序设计的监控解决方案，提供对微信小程序中各种指标的监控，包括：控制台日志、错误异常、路由变化、请求信息等。

## 功能特性

monitor-wxapp 提供以下监控功能：

1. **控制台日志监控** - 监控 console.error 和 console.warn 输出
2. **错误异常监控** - 监控 JavaScript 错误和未捕获的 Promise 异常
3. **路由变化监控** - 监控页面路由的变化历史
4. **请求信息监控** - 监控 wx.request 等网络请求的成功与失败情况

## 安装

```bash
npm install @whayl/monitor-wxapp
```

## 配置项

### WxAppMonitorConfig

创建 [WxAppMonitor](#wxappmonitor) 实例时需要传入配置对象：

```typescript
interface WxAppMonitorConfig {
  monitorConfig: MonitorConfig;
  pluginsUse?: {
    consolePluginEnabled?: boolean;  // 启用控制台插件，默认: true
    errorPluginEnabled?: boolean;    // 启用错误插件，默认: true
    routerPluginEnabled?: boolean;   // 启用路由插件，默认: true
    requestPluginEnabled?: boolean;  // 启用请求插件，默认: true
  };
  consolePluginConfig?: ConsolePluginConfig;
}
```

### ConsolePluginConfig

控制台日志插件配置：

```typescript
interface ConsolePluginConfig {
  error?: boolean;  // 监控 console.error，默认: true
  warn?: boolean;   // 监控 console.warn，默认: false
}
```

### MonitorConfig

核心监控配置：

```typescript
interface MonitorConfig {
  platform: string;                     // 平台名称，如 'wxapp'
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
import WxAppMonitor from '@whayl/monitor-wxapp';

const monitor = new WxAppMonitor({
  monitorConfig: {
    platform: 'wxapp',
    reportLevel: 'INFO',
    enabled: true,
    uploadHandler: (data) => {
      // 自定义上报逻辑
      console.log('上报数据:', data);
      // 例如发送到服务器
      // wx.request({ url: '/api/report', method: 'POST', data: JSON.stringify(data) });
    }
  },
  pluginsUse: {
    // 可以按需启用/禁用插件
    consolePluginEnabled: true,
    errorPluginEnabled: true,
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

### WxAppMonitor

微信小程序监控主类。

#### constructor(config: WxAppMonitorConfig)

创建一个新的监控实例。

#### setFingerprint(value: string)

设置浏览器指纹。

#### getFingerprint()

获取当前浏览器指纹。

#### use(plugin: WxAppMonitorPlugin)

添加一个插件。

#### reportInfo(type: ReportingLevel, data: WxAppLogData)

手动上报日志信息。

#### destroy()

销毁监控实例并清理相关资源。

## 插件说明

每个插件负责特定类型的监控：

| 插件 | 功能 |
|------|------|
| [ConsolePlugin](./src/plugins/console.ts) | 控制台日志监控 |
| [ErrorPlugin](./src/plugins/error.ts) | 错误异常监控 |
| [RouterPlugin](./src/plugins/router.ts) | 路由变化监控 |
| [RequestPlugin](./src/plugins/request.ts) | 请求信息监控 |

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

## 微信小程序适配

monitor-wxapp 针对微信小程序环境进行了专门适配：

1. **API 拦截** - 拦截 App、Page 等微信小程序核心 API 来收集生命周期信息
2. **设备信息获取** - 通过 wx.getSystemInfoSync 获取设备信息
3. **路由监控** - 监控微信小程序的路由跳转
4. **网络请求监控** - 监控 wx.request 等网络请求

## 注意事项

1. 微信小程序环境中部分浏览器 API 不可用
2. 需要在 app.js 中尽早初始化监控实例以捕获完整信息
3. 由于微信小程序的限制，部分功能可能与浏览器环境有所不同