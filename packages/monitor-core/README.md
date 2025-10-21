# Mito Core

前端监控核心库

## 安装

```bash
npm install @aiy/monitor-core
```

## 使用方法

```javascript
import monitor, { ReportLevelEnum } from '@whayl/monitor-core';

// 初始化监控配置
monitor.init({
  reportLevel: 'error', // 设置上报等级为 error 级别及以上才立即上报
  enabled: true,
  maxStorageCount: 50 // 设置本地最大存储数量为50条，默认为100条
});

// 记录不同等级的事件
monitor.error('这是一个错误信息'); // 立即上报
monitor.warn('这是一个警告信息');  // 存储到本地，不立即上报
monitor.info('这是一个普通信息');  // 存储到本地，不立即上报
monitor.debug('这是一个调试信息'); // 存储到本地，不立即上报

// 动态调整上报等级
// 当上报等级变为 info 时，之前存储的 info 级别的信息将会被上报
monitor.updateReportLevel('info');

// 根据不同环境设置不同的上报等级
if (process.env.NODE_ENV === 'production') {
  monitor.init({ 
    reportLevel: 'error',  // 生产环境只立即上报错误
    maxStorageCount: 20    // 减少本地存储数量以节省内存
  }); 
} else {
  monitor.init({ 
    reportLevel: 'debug',  // 开发环境立即上报所有信息
    maxStorageCount: 200   // 增加本地存储数量以便调试
  }); 
}
```

## 插件化架构

核心库只提供基础的日志记录和上报功能，具体的监控能力通过插件来扩展：

```javascript
import { FrontendMonitor } from '@whayl/monitor-core';
import { XhrPlugin } from './plugins/xhr';

const monitor = new FrontendMonitor();

// 添加插件
monitor.use(new XhrPlugin());

// 初始化
monitor.init({ reportLevel: 'error' });
```

## 上报等级说明

前端监控系统采用五级日志等级制度：

- **error**: 错误等级，用于记录严重影响用户体验的错误
- **warn**: 警告等级，用于记录可能影响用户体验的潜在问题
- **info**: 信息等级，用于记录重要的业务流程信息
- **debug**: 调试等级，用于开发调试时的详细信息记录
- **off**: 关闭等级，关闭所有日志上报

等级数值关系：error < warn < info < debug < off

系统会立即上报等于或高于配置等级的信息，低于配置等级的信息会被存储在本地，
当上报等级降低时（例如从error改为info），之前存储的信息如果满足新的上报条件也会被上报。

## 存储策略

为了防止占用过多内存，本地存储默认最多保存100条信息，超过限制时会自动删除最早的信息。
可以通过 [maxStorageCount](file:///d:/self/aiy-monitor/packages/monitor-core/src/type.ts#L15-L15) 配置项来自定义最大存储数量。