import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
import { onLCP, onINP, onCLS, onFCP, onTTFB, type LCPMetricWithAttribution, type INPMetricWithAttribution, type CLSMetric, type FCPMetricWithAttribution, type TTFBMetricWithAttribution } from 'web-vitals';

export class PerformancePlugin implements MonitorPlugin {
  name = 'performance';
  private monitor: FrontendMonitor | null = null;
  private resourceObserver: PerformanceObserver | null = null;
  private navigationObserver: PerformanceObserver | null = null;
  private paintObserver: PerformanceObserver | null = null;

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;

    // 确保浏览器支持 Performance API
    if (typeof PerformanceObserver === 'undefined' || typeof performance === 'undefined') {
      console.warn('Performance API is not supported in this browser');
      return;
    }

    this.setupResourceMonitoring();
    this.setupNavigationMonitoring();
    this.setupWebVitals();
  }

  destroy(): void {
    // 断开所有 PerformanceObserver 的连接
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

    // 清空引用
    this.monitor = null;
  }

  /**
   * 设置资源监控
   */
  private setupResourceMonitoring(): void {
    try {
      const resourceList: Array<{ name: string, duration: number }> = [];

      this.resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            resourceList.push({
              name: resourceEntry.name,
              duration: resourceEntry.duration
            });

            // 单独报告每个资源的加载情况
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
                decodedBodySize: resourceEntry.decodedBodySize
              }
            );
          }
        });

        // 报告资源列表汇总
        this.monitor!.info(
          this.name,
          'Resource loading summary',
          {
            type: 'resource_summary',
            resources: resourceList
          }
        );
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
              }
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
          }
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
          }
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
          }
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
          }
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
          }
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