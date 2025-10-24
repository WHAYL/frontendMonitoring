import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
import { onLCP, onINP, onCLS, onFCP, onTTFB, type LCPMetricWithAttribution, type INPMetricWithAttribution, type CLSMetric, type FCPMetricWithAttribution, type TTFBMetricWithAttribution } from 'web-vitals';
import { monitorRouteChange } from '../eventBus';

export interface PerformancePluginConfig {
  longTaskEnabled?: boolean;
  memoryEnabled?: boolean;
  fpsEnabled?: boolean;
  resourceEnabled?: boolean;
  navigationEnabled?: boolean;
  webVitalsEnabled?: boolean;
}

export class PerformancePlugin implements MonitorPlugin {
  name = 'performance';
  private monitor: FrontendMonitor | null = null;
  private resourceObserver: PerformanceObserver | null = null;
  private navigationObserver: PerformanceObserver | null = null;
  private paintObserver: PerformanceObserver | null = null;
  private longTaskObserver: PerformanceObserver | null = null;
  private fpsIntervalId: number | null = null;
  private memoryIntervalId: number | null = null;
  private config: PerformancePluginConfig;
  private boundHandleRouteChange: (data: any) => void = () => { };

  constructor(config: PerformancePluginConfig = {}) {
    this.config = {
      longTaskEnabled: true,
      memoryEnabled: true,
      fpsEnabled: true,
      resourceEnabled: true,
      navigationEnabled: true,
      webVitalsEnabled: true,
      ...config
    };
  }

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;
    if (typeof PerformanceObserver === 'undefined' || typeof performance === 'undefined') {
      console.warn('Performance API is not supported in this browser');
      return;
    }
    this.run();
    this.boundHandleRouteChange = this.handleRouteChange.bind(this);
    monitorRouteChange.on("monitorRouteChange", this.boundHandleRouteChange);
  }

  run(): void {
    if (this.config.resourceEnabled) { this.setupResourceMonitoring(); }
    if (this.config.navigationEnabled) { this.setupNavigationMonitoring(); }
    if (this.config.webVitalsEnabled) { this.setupWebVitals(); }
    if (this.config.longTaskEnabled) { this.setupLongTaskMonitoring(); }
    if (this.config.memoryEnabled) { this.setupMemoryMonitoring(); }
    if (this.config.fpsEnabled) { this.setupFPSMonitoring(); }
  }
  clearEffects(): void {
    if (this.resourceObserver) {
      this.resourceObserver.disconnect();
      this.resourceObserver = null;
    }
    if (this.navigationObserver) {
      this.navigationObserver.disconnect();
      this.navigationObserver = null;
    }
    if (this.paintObserver) {
      this.paintObserver.disconnect();
      this.paintObserver = null;
    }
    if (this.longTaskObserver) {
      this.longTaskObserver.disconnect();
      this.longTaskObserver = null;
    }
    if (this.fpsIntervalId) {
      clearInterval(this.fpsIntervalId);
      this.fpsIntervalId = null;
    }
    if (this.memoryIntervalId) {
      clearInterval(this.memoryIntervalId);
      this.memoryIntervalId = null;
    }
  }
  /**
   * 长任务监控
   */
  private setupLongTaskMonitoring(): void {
    try {
      if (typeof PerformanceObserver === 'undefined' || typeof (window as any).PerformanceLongTaskTiming === 'undefined') { return; }
      this.longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'longtask') {
            this.monitor?.info(
              this.name,
              'Long Task Detected',
              {
                type: 'longtask',
                name: (entry as any).name,
                startTime: entry.startTime,
                duration: entry.duration,
                attribution: (entry as any).attribution || []
              },
              window.location.href
            );
          }
        });
      });
      this.longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.error('Error setting up long task monitoring:', e);
    }
  }

  /**
   * 内存使用情况监控
   */
  private setupMemoryMonitoring(): void {
    // 检查浏览器是否支持 memory 接口
    const memorySupported = 'memory' in performance ||
      !!(performance as any).mozMemory ||
      !!(window as any).console.memory;

    if (!memorySupported) {
      // 尝试使用其他方式估算内存使用
      this.estimateMemoryUsage();
      return;
    }

    let lastUsed = 0;
    let lastTotal = 0;
    const memoryData: {
      samples: Array<{ used: number, total: number, timestamp: number }>,
      peaks: Array<{ used: number, timestamp: number }>,
      trend: string
    } = {
      samples: [],
      peaks: [],
      trend: 'stable'
    };

    this.memoryIntervalId = window.setInterval(() => {
      try {
        // @ts-ignore
        const memory = (performance as any).memory;
        if (memory) {
          const usedDiff = Math.abs(memory.usedJSHeapSize - lastUsed);
          const totalDiff = Math.abs(memory.totalJSHeapSize - lastTotal);
          const percent = memory.totalJSHeapSize > 0 ? (memory.usedJSHeapSize / memory.totalJSHeapSize) : 0;

          // 记录内存使用数据
          memoryData.samples.push({
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            timestamp: Date.now()
          });

          // 记录内存使用峰值
          if (memoryData.peaks.length === 0 || memory.usedJSHeapSize > memoryData.peaks[memoryData.peaks.length - 1].used) {
            memoryData.peaks.push({
              used: memory.usedJSHeapSize,
              timestamp: Date.now()
            });
          }

          // 保持样本数量在合理范围内
          if (memoryData.samples.length > 30) { // 保留最近2.5分钟的数据 (30 * 5秒)
            memoryData.samples.shift();
          }

          if (memoryData.peaks.length > 10) { // 保留最近10个峰值
            memoryData.peaks.shift();
          }

          // 分析内存使用趋势
          let trend = 'stable';
          if (memoryData.samples.length > 5) {
            const recentSamples = memoryData.samples.slice(-5);
            const firstSample = recentSamples[0];
            const lastSample = recentSamples[recentSamples.length - 1];

            // 如果最近5个样本显示持续增长超过10%，则认为是增长趋势
            if (lastSample.used > firstSample.used * 1.1) {
              trend = 'increasing';
            } else if (lastSample.used < firstSample.used * 0.9) {
              trend = 'decreasing';
            }
          }

          memoryData.trend = trend;

          // 上报条件：内存使用量变化超过阈值、占用率超过90%、或检测到内存泄漏趋势
          const isLeakDetected = trend === 'increasing' && memoryData.samples.length > 10 && this.detectMemoryLeak(memoryData.samples);

          if (
            usedDiff > 5 * 1024 * 1024 || // 5MB变化
            totalDiff > 5 * 1024 * 1024 || // 5MB变化
            percent > 0.9 || // 使用率超过90%
            isLeakDetected // 检测到内存泄漏
          ) {
            this.monitor?.info(
              this.name,
              isLeakDetected ? 'Memory Leak Detected' : 'Memory Usage',
              {
                type: 'memory',
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                totalJSHeapSize: memory.totalJSHeapSize,
                usedJSHeapSize: memory.usedJSHeapSize,
                percent: +(percent * 100).toFixed(2),
                usedDiff,
                totalDiff,
                trend,
                samplesCount: memoryData.samples.length,
                peaksCount: memoryData.peaks.length,
                timestamp: Date.now(),
                isLeakDetected
              },
              window.location.href
            );
          }

          lastUsed = memory.usedJSHeapSize;
          lastTotal = memory.totalJSHeapSize;
        }
      } catch (e) {
        console.error('Error in memory monitoring:', e);
      }
    }, 5000); // 每5秒检测一次
  }

  /**
   * 估算内存使用情况（针对不支持 performance.memory 的浏览器）
   */
  private estimateMemoryUsage(): void {
    // 对于不支持 performance.memory 的浏览器，可以通过其他方式估算
    // 比如监控大型对象的创建和销毁，但这超出了本插件的范围
    console.warn('Memory monitoring not supported in this browser');
  }

  /**
   * 检测内存泄漏趋势
   * @param samples 内存使用样本
   */
  private detectMemoryLeak(samples: Array<{ used: number, total: number, timestamp: number }>): boolean {
    if (samples.length < 10) { return false; }

    // 计算线性回归斜率来判断趋势
    const n = samples.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    samples.forEach((sample, i) => {
      const x = i;
      const y = sample.used;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    // 计算斜率
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    // 如果斜率为正且具有统计意义，则可能存在内存泄漏
    // 这里我们使用一个简单的阈值来判断
    return slope > 50000; // 每次采样平均增长超过50KB
  }

  /**
   * FPS 监控
   */
  private setupFPSMonitoring(): void {
    const frameTimes: number[] = [];
    let lastFrameTime = performance.now();
    let minFps = Infinity;
    let maxFps = 0;
    const fpsList: number[] = [];
    let lastReportTime = performance.now();
    let frameCount = 0;

    // 用于检测与用户交互相关的卡顿
    let lastUserInteraction = 0;
    let userInteracting = false;

    // 监听用户交互事件
    const userInteractionEvents = ['click', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleUserInteraction = () => {
      lastUserInteraction = performance.now();
      userInteracting = true;

      // 一段时间后重置交互状态
      setTimeout(() => {
        userInteracting = false;
      }, 1000);
    };

    userInteractionEvents.forEach(eventType => {
      document.addEventListener(eventType, handleUserInteraction, { passive: true });
    });

    const detectFrameDrops = () => {
      const now = performance.now();
      const frameTime = now - lastFrameTime;

      // 记录帧时间，用于检测卡顿
      frameTimes.push(frameTime);

      // 保持最近120帧的数据（大约2秒）
      if (frameTimes.length > 120) {
        frameTimes.shift();
      }

      // 检测单帧卡顿（超过16.67ms，即60fps以下）
      if (frameTime > 33) { // 超过2帧的时间(33ms)视为卡顿
        const isDuringInteraction = userInteracting || (now - lastUserInteraction < 1000);

        this.monitor?.warn(
          this.name,
          'Frame Drop Detected',
          {
            type: 'frame_drop',
            frameTime: Math.round(frameTime * 100) / 100, // 保留2位小数
            expectedFrameTime: 16.67,
            timestamp: now,
            isDuringInteraction,
            timeSinceLastInteraction: now - lastUserInteraction
          },
          window.location.href
        );
      }

      // 每秒计算一次FPS
      frameCount++;
      if (now - lastReportTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastReportTime));
        fpsList.push(fps);
        minFps = Math.min(minFps, fps);
        maxFps = Math.max(maxFps, fps);

        // 计算平均FPS
        let avgFps = 0;
        if (fpsList.length > 0) {
          avgFps = Math.round(fpsList.reduce((a, b) => a + b, 0) / fpsList.length);
        }

        // 上报条件：FPS低于阈值或波动较大
        if (fps < 45 || (fpsList.length > 1 && Math.abs(fps - (fpsList[fpsList.length - 2] || 0)) > 10)) {
          this.monitor?.info(
            this.name,
            'FPS Report',
            {
              type: 'fps',
              fps,
              minFps: Math.round(minFps),
              maxFps: Math.round(maxFps),
              avgFps,
              frameCount,
              timestamp: now,
              duration: now - lastReportTime
            },
            window.location.href
          );
        }

        // 保持FPS历史记录在合理范围内
        if (fpsList.length > 60) { // 保留最近1分钟的数据
          fpsList.shift();
        }

        frameCount = 0;
        lastReportTime = now;
      }

      lastFrameTime = now;
      this.fpsIntervalId = window.requestAnimationFrame(detectFrameDrops) as any;
    };

    this.fpsIntervalId = window.requestAnimationFrame(detectFrameDrops) as any;
  }
  destroy(): void {
    this.clearEffects();
    if (this.boundHandleRouteChange) {
      monitorRouteChange.off("monitorRouteChange", this.boundHandleRouteChange);
    }
    // 清空引用
    this.monitor = null;
  }

  /**
   * 处理路由变化事件
   */
  private handleRouteChange(data: any): void {
    this.run();
  }

  /**
   * 设置资源监控
   */
  private setupResourceMonitoring(): void {
    try {

      this.resourceObserver = new PerformanceObserver((list) => {
        // 只关注这些 initiatorType（优先）或特定后缀的资源
        const allowedInitiatorTypes = new Set([
          'script',
          'link',
          'img',
          'css',
          'video',
          'audio',
          'iframe',
          'fetch',
          'xmlhttprequest',
          'worker',
          'serviceworker',
          'font',
          'json',
          'wasm',
          'other'
        ]);

        // 常见静态资源扩展名（包括 icon/gif 等），并扩展 json/wasm/map/manifest 等
        const allowedExt = /\.(js|mjs|cjs|css|html?|json|wasm|map|manifest|jpg|jpeg|png|gif|svg|webp|ico|mp4|webm|ogg|mp3|m4a|wav|woff2?|woff|ttf|eot|otf)$/i;

        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            // 某些浏览器会有 initiatorType 字段
            const initiatorType = (resourceEntry as any).initiatorType || '';
            const url = resourceEntry.name || '';

            // 显式忽略 beacon（navigator.sendBeacon）以避免上报时触发 sendBeacon 再次上报的死循环
            if (initiatorType === 'beacon') {
              return;
            }

            // 优先依据 initiatorType 过滤；如果 initiatorType 不存在或不在白名单，则根据扩展名判断
            const shouldInclude = allowedInitiatorTypes.has(initiatorType) || allowedExt.test(url);
            if (!shouldInclude) {
              return;
            }

            // 判断是否从缓存读取：常见的判断是 transferSize === 0 且 encodedBodySize/decodedBodySize 有值
            const transferSize = typeof resourceEntry.transferSize === 'number' ? resourceEntry.transferSize : -1;
            const encodedBodySize = typeof resourceEntry.encodedBodySize === 'number' ? resourceEntry.encodedBodySize : 0;
            const decodedBodySize = typeof resourceEntry.decodedBodySize === 'number' ? resourceEntry.decodedBodySize : 0;
            const fromCache = transferSize === 0 && (encodedBodySize > 0 || decodedBodySize > 0);

            // 单独报告每个资源的加载情况（按需打开）
            this.monitor!.info(
              this.name,
              `Resource loaded: ${resourceEntry.name}`,
              {
                type: 'resource',
                name: resourceEntry.name,
                duration: resourceEntry.duration,
                startTime: resourceEntry.startTime,
                transferSize: resourceEntry.transferSize,
                encodedBodySize: resourceEntry.encodedBodySize,
                decodedBodySize: resourceEntry.decodedBodySize,
                initiatorType: initiatorType,
                cached: fromCache
              },
              window.location.href
            );
          }
        });

      });

      this.resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.error('Error setting up resource monitoring:', error);
    }
  }

  /**
   * 设置页面导航监控
   */
  private setupNavigationMonitoring(): void {
    try {
      this.navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;

            // 报告页面加载性能数据
            this.monitor!.info(
              this.name,
              'Page navigation performance',
              {
                type: 'navigation',
                ...navEntry.toJSON()
              },
              window.location.href
            );

          }
        });
      });

      this.navigationObserver.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.error('Error setting up navigation monitoring:', error);
    }
  }

  /**
   * 设置 Web Vitals 监控
   * 使用 Google 的 web-vitals 库监控核心用户体验指标
   */
  private setupWebVitals(): void {
    try {
      // 监控最大内容绘制 (LCP)
      onLCP((metric: LCPMetricWithAttribution) => {
        this.monitor!.info(
          this.name,
          'Largest Contentful Paint (LCP)',
          {
            type: 'web_vitals',
            metric: 'LCP',
            value: metric.value,
            // attribution 只在 LCP 中存在
            ...(metric.attribution && { attribution: metric.attribution }),
            navigationType: metric.navigationType,
            rating: this.getRating(metric.value, 2500, 4000) // LCP评级：好(<=2.5s)、需要改进(<=4s)、差(>4s)
          },
          window.location.href
        );
      });

      // 监控首次输入延迟 (INP)
      onINP((metric: INPMetricWithAttribution) => {
        this.monitor!.info(
          this.name,
          'Interaction to Next Paint (INP)',
          {
            type: 'web_vitals',
            metric: 'INP',
            value: metric.value,
            // attribution 只在 INP 中存在
            ...(metric.attribution && { attribution: metric.attribution }),
            navigationType: metric.navigationType,
            rating: this.getRating(metric.value, 200, 500) // INP评级：好(<=200ms)、需要改进(<=500ms)、差(>500ms)
          },
          window.location.href
        );
      });

      // 监控累积布局偏移 (CLS)
      onCLS((metric: CLSMetric) => {
        this.monitor!.info(
          this.name,
          'Cumulative Layout Shift (CLS)',
          {
            type: 'web_vitals',
            metric: 'CLS',
            value: metric.value,
            navigationType: metric.navigationType,
            rating: this.getRating(metric.value, 0.1, 0.25) // CLS评级：好(<=0.1)、需要改进(<=0.25)、差(>0.25)
          },
          window.location.href
        );
      });

      // 监控首次内容绘制 (FCP)
      onFCP((metric: FCPMetricWithAttribution) => {
        this.monitor!.info(
          this.name,
          'First Contentful Paint (FCP)',
          {
            type: 'web_vitals',
            metric: 'FCP',
            value: metric.value,
            // attribution 只在 FCP 中存在
            ...(metric.attribution && { attribution: metric.attribution }),
            navigationType: metric.navigationType,
            rating: this.getRating(metric.value, 1800, 3000) // FCP评级：好(<=1.8s)、需要改进(<=3s)、差(>3s)
          },
          window.location.href
        );
      });

      // 监控首字节时间 (TTFB)
      onTTFB((metric: TTFBMetricWithAttribution) => {
        this.monitor!.info(
          this.name,
          'Time to First Byte (TTFB)',
          {
            type: 'web_vitals',
            metric: 'TTFB',
            value: metric.value,
            // attribution 只在 TTFB 中存在
            ...(metric.attribution && { attribution: metric.attribution }),
            navigationType: metric.navigationType,
            rating: this.getRating(metric.value, 800, 1800) // TTFB评级：好(<=800ms)、需要改进(<=1.8s)、差(>1.8s)
          },
          window.location.href
        );
      });
    } catch (error) {
      console.error('Error setting up Web Vitals monitoring:', error);
    }
  }

  /**
   * 根据值和阈值获取性能评级
   * @param value 性能指标值
   * @param goodThreshold 好的阈值
   * @param poorThreshold 差的阈值
   * @returns 评级 ('good' | 'needsImprovement' | 'poor')
   */
  private getRating(value: number, goodThreshold: number, poorThreshold: number): string {
    if (value <= goodThreshold) {
      return 'good';
    } else if (value <= poorThreshold) {
      return 'needsImprovement';
    } else {
      return 'poor';
    }
  }
}