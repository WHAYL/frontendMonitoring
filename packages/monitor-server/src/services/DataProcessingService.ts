import { UserSessionModel } from '../database/models/UserSession';
import { PageVisitModel } from '../database/models/PageVisit';
import { UserBehaviorModel } from '../database/models/UserBehavior';
import { NetworkRequestModel } from '../database/models/NetworkRequest';
import { PerformanceMetricModel } from '../database/models/PerformanceMetric';

/**
 * 数据处理服务
 */
export class DataProcessingService {
  /**
   * 处理用户会话数据
   */
  static async processUserSession(sessionData: any): Promise<any> {
    try {
      // 数据验证和清理
      const cleanedData = this.cleanSessionData(sessionData);

      // 保存到数据库
      const session = await UserSessionModel.create(cleanedData);

      // 更新相关统计
      await this.updateSessionStats(session);

      return session;
    } catch (error) {
      console.error('处理用户会话数据失败:', error);
      throw error;
    }
  }

  /**
   * 处理页面访问数据
   */
  static async processPageVisit(visitData: any): Promise<any> {
    try {
      const cleanedData = this.cleanPageVisitData(visitData);
      const visit = await PageVisitModel.create(cleanedData);

      // 更新页面统计
      await this.updatePageStats(visit);

      return visit;
    } catch (error) {
      console.error('处理页面访问数据失败:', error);
      throw error;
    }
  }

  /**
   * 处理用户行为数据
   */
  static async processUserBehavior(behaviorData: any): Promise<any> {
    try {
      const cleanedData = this.cleanBehaviorData(behaviorData);
      const behavior = await UserBehaviorModel.create(cleanedData);

      // 更新行为统计
      await this.updateBehaviorStats(behavior);

      return behavior;
    } catch (error) {
      console.error('处理用户行为数据失败:', error);
      throw error;
    }
  }

  /**
   * 处理网络请求数据
   */
  static async processNetworkRequest(requestData: any): Promise<any> {
    try {
      const cleanedData = this.cleanNetworkRequestData(requestData);
      const request = await NetworkRequestModel.create(cleanedData);

      // 更新网络统计
      await this.updateNetworkStats(request);

      return request;
    } catch (error) {
      console.error('处理网络请求数据失败:', error);
      throw error;
    }
  }

  /**
   * 处理性能指标数据
   */
  static async processPerformanceMetric(metricData: any): Promise<any> {
    try {
      const cleanedData = this.cleanPerformanceMetricData(metricData);
      const metric = await PerformanceMetricModel.create(cleanedData);

      // 更新性能统计
      await this.updatePerformanceStats(metric);

      return metric;
    } catch (error) {
      console.error('处理性能指标数据失败:', error);
      throw error;
    }
  }

  /**
   * 清理会话数据
   */
  private static cleanSessionData(data: any): any {
    return {
      sessionId: data.sessionId || this.generateSessionId(),
      fingerprint: data.fingerprint,
      userId: data.userId,
      startTime: data.startTime || Date.now(),
      endTime: data.endTime,
      duration: data.duration,
      pageViews: data.pageViews || 0,
      eventsCount: data.eventsCount || 0,
      errorsCount: data.errorsCount || 0,
      platform: data.platform,
      os: data.os,
      browser: data.browser,
      deviceType: data.deviceType,
      screenResolution: data.screenResolution,
      networkType: data.networkType,
      referrer: data.referrer,
      entryUrl: data.entryUrl,
      exitUrl: data.exitUrl
    };
  }

  /**
   * 清理页面访问数据
   */
  private static cleanPageVisitData(data: any): any {
    return {
      sessionId: data.sessionId,
      url: data.url,
      title: data.title,
      referrer: data.referrer,
      visitTime: data.visitTime || Date.now(),
      loadTime: data.loadTime,
      firstPaintTime: data.firstPaintTime,
      firstContentfulPaintTime: data.firstContentfulPaintTime,
      largestContentfulPaintTime: data.largestContentfulPaintTime,
      firstInputDelay: data.firstInputDelay,
      cumulativeLayoutShift: data.cumulativeLayoutShift,
      timeToInteractive: data.timeToInteractive,
      domContentLoadedTime: data.domContentLoadedTime,
      windowLoadTime: data.windowLoadTime
    };
  }

  /**
   * 清理行为数据
   */
  private static cleanBehaviorData(data: any): any {
    return {
      sessionId: data.sessionId,
      fingerprint: data.fingerprint,
      behaviorType: data.behaviorType,
      targetElement: data.targetElement,
      coordinatesX: data.coordinatesX,
      coordinatesY: data.coordinatesY,
      scrollPosition: data.scrollPosition,
      timestamp: data.timestamp || Date.now(),
      extraData: data.extraData ? JSON.stringify(data.extraData) : null
    };
  }

  /**
   * 清理网络请求数据
   */
  private static cleanNetworkRequestData(data: any): any {
    return {
      sessionId: data.sessionId,
      url: data.url,
      method: data.method,
      status: data.status,
      responseTime: data.responseTime,
      requestSize: data.requestSize,
      responseSize: data.responseSize,
      timestamp: data.timestamp || Date.now(),
      userAgent: data.userAgent,
      referrer: data.referrer
    };
  }

  /**
   * 清理性能指标数据
   */
  private static cleanPerformanceMetricData(data: any): any {
    return {
      sessionId: data.sessionId,
      metricName: data.metricName,
      metricValue: data.metricValue,
      timestamp: data.timestamp || Date.now(),
      url: data.url,
      userAgent: data.userAgent
    };
  }

  /**
   * 更新会话统计
   */
  private static async updateSessionStats(session: any): Promise<void> {
    // 这里可以添加会话统计更新逻辑
    // 例如：更新用户活跃度、会话时长统计等
  }

  /**
   * 更新页面统计
   */
  private static async updatePageStats(visit: any): Promise<void> {
    // 这里可以添加页面统计更新逻辑
    // 例如：更新页面访问次数、平均加载时间等
  }

  /**
   * 更新行为统计
   */
  private static async updateBehaviorStats(behavior: any): Promise<void> {
    // 这里可以添加行为统计更新逻辑
    // 例如：更新用户行为热力图、交互统计等
  }

  /**
   * 更新网络统计
   */
  private static async updateNetworkStats(request: any): Promise<void> {
    // 这里可以添加网络统计更新逻辑
    // 例如：更新网络请求统计、错误率等
  }

  /**
   * 更新性能统计
   */
  private static async updatePerformanceStats(metric: any): Promise<void> {
    // 这里可以添加性能统计更新逻辑
    // 例如：更新性能指标统计、趋势分析等
  }

  /**
   * 生成会话ID
   */
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
