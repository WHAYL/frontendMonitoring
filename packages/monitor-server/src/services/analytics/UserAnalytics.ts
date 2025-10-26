import { UserSessionModel } from '../../database/models/UserSession';
import { PageVisitModel } from '../../database/models/PageVisit';
import { UserBehaviorModel } from '../../database/models/UserBehavior';

/**
 * 用户分析服务
 */
export class UserAnalyticsService {
  /**
   * 获取用户分析数据
   */
  static async getUserAnalytics(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    // 获取用户会话统计
    const sessionStats = await UserSessionModel.getSessionStats(startDate, endDate);

    // 获取页面访问统计
    const pageStats = await PageVisitModel.getPageStats(startDate, endDate);

    // 获取用户行为统计
    const behaviorStats = await UserBehaviorModel.getBehaviorStats(startDate, endDate);

    // 获取热门交互元素
    const topElements = await UserBehaviorModel.getTopInteractiveElements(10, startDate, endDate);

    // 获取用户行为热力图数据
    const heatmapData = await UserBehaviorModel.getHeatmapData(startDate, endDate);

    return {
      sessions: sessionStats,
      pages: pageStats,
      behaviors: behaviorStats,
      topElements,
      heatmapData
    };
  }

  /**
   * 获取用户行为流程
   */
  static async getUserBehaviorFlow(
    fingerprint: string,
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    const behaviors = await UserBehaviorModel.getUserBehaviorFlow(fingerprint, startDate, endDate);

    // 处理行为数据，形成完整的操作流程
    const flowData: any[] = [];
    let currentPage = '';
    let pageEnterTime = 0;

    behaviors.forEach((behavior: any) => {
      // 判断行为类型
      if (behavior.behaviorType === 'route') {
        // 路由变化行为
        const routeItem = {
          type: 'route',
          timestamp: behavior.timestamp,
          from: behavior.extraData?.from,
          to: behavior.extraData?.to,
          stayTime: behavior.extraData?.stayTime,
          url: behavior.extraData?.url
        };

        // 更新当前页面信息
        currentPage = behavior.extraData?.to || '';
        pageEnterTime = behavior.timestamp;

        flowData.push(routeItem);
      }
      else if (behavior.behaviorType === 'click') {
        // 点击行为
        const clickItem = {
          type: 'click',
          timestamp: behavior.timestamp,
          target: behavior.targetElement,
          coordinates: {
            x: behavior.coordinatesX,
            y: behavior.coordinatesY
          },
          page: currentPage
        };

        flowData.push(clickItem);
      }
      else if (behavior.behaviorType === 'scroll') {
        // 滚动行为
        const scrollItem = {
          type: 'scroll',
          timestamp: behavior.timestamp,
          position: behavior.scrollPosition,
          page: currentPage
        };

        flowData.push(scrollItem);
      }
      else {
        // 其他行为
        const otherItem = {
          type: 'other',
          timestamp: behavior.timestamp,
          behaviorType: behavior.behaviorType,
          target: behavior.targetElement,
          page: currentPage
        };

        flowData.push(otherItem);
      }
    });

    // 汇总统计信息
    const stats = {
      totalActions: flowData.length,
      routeChanges: flowData.filter(item => item.type === 'route').length,
      clicks: flowData.filter(item => item.type === 'click').length,
      scrolls: flowData.filter(item => item.type === 'scroll').length,
      otherActions: flowData.filter(item => item.type === 'other').length
    };

    return {
      fingerprint,
      stats,
      flow: flowData
    };
  }
}
