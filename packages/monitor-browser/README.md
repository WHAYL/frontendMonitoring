# Mito Browser

浏览器端监控SDK，基于插件化架构，包含各种监控插件。

## 安装

```bash
npm install @aiy/monitor-browser
```

## 使用方法

```javascript
import monitor from '@aiy/monitor-browser';

// 初始化监控配置
monitor.init({
  reportLevel: 'error', // 设置上报等级
  enabled: true
});

// 监控系统会自动监控以下内容：
// 1. XMLHttpRequest 请求
// 2. Fetch 请求
// 3. JavaScript 错误
// 4. 未处理的 Promise 拒绝
// 5. 用户交互行为
// 6. DOM 变化
```

## 插件说明

当前包含以下插件：

### XHR 插件
监控 XMLHttpRequest 请求，记录请求方法、URL、状态码、响应时间等信息。

### Fetch 插件
监控 Fetch 请求，记录请求方法、URL、状态码、响应时间等信息。

### DOM 插件
监控 DOM 相关事件：
- JavaScript 运行时错误
- 未处理的 Promise 拒绝
- 用户点击行为
- DOM 结构变化

## 自定义插件

您也可以创建自定义插件：

```javascript
import { FrontendMonitor } from '@whayl/monitor-core';

class CustomPlugin {
  name = 'custom';
  
  init(monitor: FrontendMonitor) {
    // 插件初始化逻辑
    // 可以监听事件、设置定时器等
  }
  
  destroy() {
    // 插件销毁逻辑
    // 清理事件监听器、定时器等资源
  }
}

// 使用自定义插件
const monitor = new FrontendMonitor();
monitor.use(new CustomPlugin());
```

## API

### monitor.use(plugin)
添加插件到监控系统。

### monitor.init(config)
初始化监控配置。

### monitor.error(message, error?, pluginName?)
记录错误信息。

### monitor.warn(message, error?, pluginName?)
记录警告信息。

### monitor.info(message, pluginName?)
记录信息。

### monitor.debug(message, pluginName?)
记录调试信息。

### monitor.updateReportLevel(level)
更新上报等级。

### monitor.destroy()
销毁监控实例，清理所有资源。