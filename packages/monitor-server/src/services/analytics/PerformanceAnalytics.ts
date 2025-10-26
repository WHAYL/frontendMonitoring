import { PageVisitModel } from '../../database/models/PageVisit';
import { PerformanceMetricModel } from '../../database/models/PerformanceMetric';
import { NetworkRequestModel } from '../../database/models/NetworkRequest';

/**
 * 性能分析服务
 */
export class PerformanceAnalyticsService {
  /**
   * 获取性能分析数据
   */
  static async getPerformanceAnalytics(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    // 获取页面性能分析
    const pagePerformance = await PageVisitModel.getPerformanceAnalysis(startDate, endDate);

    // 获取热门页面
    const topPages = await PageVisitModel.getTopPages(10, startDate, endDate);

    // 获取性能指标概览
    const metricsOverview = await PerformanceMetricModel.getMetricsOverview(startDate, endDate);

    // 获取网络请求统计
    const networkStats = await NetworkRequestModel.getNetworkStats(startDate, endDate);

    // 获取慢请求分析
    const slowRequests = await NetworkRequestModel.getSlowRequests(3000, startDate, endDate);

    // 获取错误请求分析
    const errorRequests = await NetworkRequestModel.getErrorRequests(startDate, endDate);

    return {
      pagePerformance,
      topPages,
      metrics: metricsOverview,
      network: networkStats,
      slowRequests,
      errorRequests
    };
  }

  /**
   * 获取性能指标趋势
   */
  static async getPerformanceTrend(
    metricName: string,
    timeWindow: string = 'hour',
    startDate?: number,
    endDate?: number
  ): Promise<any[]> {
    return await PerformanceMetricModel.getPerformanceTrend(metricName, timeWindow, startDate, endDate);
  }

  /**
   * 获取Core Web Vitals分析
   */
  static async getCoreWebVitals(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    const fcpData = await PerformanceMetricModel.findByMetricName('fcp', startDate, endDate);
    const lcpData = await PerformanceMetricModel.findByMetricName('lcp', startDate, endDate);
    const fidData = await PerformanceMetricModel.findByMetricName('fid', startDate, endDate);
    const clsData = await PerformanceMetricModel.findByMetricName('cls', startDate, endDate);

    return {
      fcp: {
        data: fcpData,
        stats: await PerformanceMetricModel.getMetricStats('fcp', startDate, endDate)
      },
      lcp: {
        data: lcpData,
        stats: await PerformanceMetricModel.getMetricStats('lcp', startDate, endDate)
      },
      fid: {
        data: fidData,
        stats: await PerformanceMetricModel.getMetricStats('fid', startDate, endDate)
      },
      cls: {
        data: clsData,
        stats: await PerformanceMetricModel.getMetricStats('cls', startDate, endDate)
      }
    };
  }
}
