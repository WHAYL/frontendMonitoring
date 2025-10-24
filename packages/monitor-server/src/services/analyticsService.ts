import { db } from '../database';
import { IErrorInfo } from '../database/models/ErrorInfo';

interface AnalyticsResult {
  totalErrors: number;
  totalWarnings: number;
  totalInfos: number;
  topErrors: Array<{
    message: string;
    count: number;
  }>;
  topPlugins: Array<{
    pluginName: string;
    count: number;
  }>;
  errorsByTime: Array<{
    date: string;
    count: number;
  }>;
}

interface DetailedAnalyticsResult extends AnalyticsResult {
  // 用户行为分析
  userBehaviors: {
    totalEvents: number;
    eventTypes: Array<{
      type: string;
      count: number;
    }>;
    topTargets: Array<{
      target: string;
      count: number;
    }>;
  };

  // 页面停留分析
  pageStayAnalysis: {
    avgStayTime: number;
    pages: Array<{
      url: string;
      avgStayTime: number;
      visitCount: number;
    }>;
  };

  // 页面性能分析
  performanceAnalysis: {
    avgLoadTime: number;
    resources: Array<{
      type: string;
      avgLoadTime: number;
      count: number;
    }>;
    slowResources: Array<{
      url: string;
      loadTime: number;
      type: string;
    }>;
  };

  // 页面访问分析
  pageVisitAnalysis: {
    totalVisits: number;
    uniqueVisitors: number;
    topPages: Array<{
      url: string;
      visits: number;
      visitors: number;
    }>;
  };

  // 页面错误分析
  pageErrorAnalysis: {
    totalPagesWithErrors: number;
    topErrorPages: Array<{
      url: string;
      errorCount: number;
    }>;
  };

  // 设备分析
  deviceAnalysis: {
    browsers: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
    os: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
    platforms: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };

  // 网络分析
  networkAnalysis: {
    types: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
  };

  // 路由分析
  routeAnalysis: {
    totalRoutes: number;
    topRoutes: Array<{
      from: string;
      to: string;
      count: number;
    }>;
  };
}

/**
 * 获取整体分析数据
 * @param startDate 开始时间戳
 * @param endDate 结束时间戳
 */
export const getOverallAnalytics = async (
  startDate?: number,
  endDate?: number
): Promise<AnalyticsResult> => {
  // 构建时间过滤条件
  let baseQuery = 'SELECT * FROM error_info';
  let countQuery = 'SELECT level, COUNT(*) as count FROM error_info';
  let topErrorsQuery = 'SELECT message, COUNT(*) as count FROM error_info WHERE level = \'ERROR\'';
  let topPluginsQuery = 'SELECT plugin_name, COUNT(*) as count FROM error_info';
  let errorsByTimeQuery = 'SELECT DATE(datetime(timestamp/1000, \'unixepoch\')) as dateStr, COUNT(*) as count FROM error_info';

  const params: any[] = [];
  const countParams: any[] = [];
  const topErrorsParams: any[] = [];
  const topPluginsParams: any[] = [];
  const errorsByTimeParams: any[] = [];

  if (startDate || endDate) {
    const conditions: string[] = [];
    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
      countParams.push(startDate);
      topErrorsParams.push(startDate);
      topPluginsParams.push(startDate);
      errorsByTimeParams.push(startDate);
    }
    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
      countParams.push(endDate);
      topErrorsParams.push(endDate);
      topPluginsParams.push(endDate);
      errorsByTimeParams.push(endDate);
    }

    const whereClause = ` WHERE ${conditions.join(' AND ')}`;
    baseQuery += whereClause;
    countQuery += whereClause;
    topErrorsQuery += whereClause;
    topPluginsQuery += whereClause;
    errorsByTimeQuery += whereClause;
  }

  // 按级别统计
  countQuery += ' GROUP BY level';
  const levelStatsStmt = db.prepare(countQuery);
  const levelStats = levelStatsStmt.all(...countParams);

  // Top 错误信息
  topErrorsQuery += ' GROUP BY message ORDER BY COUNT(*) DESC LIMIT 10';
  const topErrorsStmt = db.prepare(topErrorsQuery);
  const topErrors = topErrorsStmt.all(...topErrorsParams);

  // Top 插件
  topPluginsQuery += ' GROUP BY plugin_name ORDER BY COUNT(*) DESC LIMIT 10';
  const topPluginsStmt = db.prepare(topPluginsQuery);
  const topPlugins = topPluginsStmt.all(...topPluginsParams);

  // 按时间分布
  errorsByTimeQuery += ' GROUP BY DATE(datetime(timestamp/1000, \'unixepoch\')) ORDER BY DATE(datetime(timestamp/1000, \'unixepoch\')) ASC';
  const errorsByTimeStmt = db.prepare(errorsByTimeQuery);
  const errorsByTime = errorsByTimeStmt.all(...errorsByTimeParams);

  // 处理结果
  const result: AnalyticsResult = {
    totalErrors: 0,
    totalWarnings: 0,
    totalInfos: 0,
    topErrors: (topErrors as any).map((item: any) => ({
      message: item.message,
      count: item.count
    })),
    topPlugins: (topPlugins as any).map((item: any) => ({
      pluginName: item.plugin_name,
      count: item.count
    })),
    errorsByTime: (errorsByTime as any).map((item: any) => ({
      date: item.dateStr,
      count: item.count
    }))
  };

  // 设置各级别统计
  (levelStats as any).forEach((stat: any) => {
    const count = stat.count;
    switch (stat.level) {
      case 'ERROR':
        result.totalErrors = count;
        break;
      case 'WARN':
        result.totalWarnings = count;
        break;
      case 'INFO':
        result.totalInfos = count;
        break;
    }
  });

  return result;
};

/**
 * 获取详细分析数据
 * @param startDate 开始时间戳
 * @param endDate 结束时间戳
 */
export const getDetailedAnalytics = async (
  startDate?: number,
  endDate?: number
): Promise<DetailedAnalyticsResult> => {
  // 获取基础分析数据
  const baseAnalytics = await getOverallAnalytics(startDate, endDate);

  // 构建时间过滤条件
  let whereClause = '';
  const params: any[] = [];

  if (startDate || endDate) {
    const conditions: string[] = [];
    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
    }
    whereClause = ` WHERE ${conditions.join(' AND ')}`;
  }

  // 用户行为分析
  const userBehaviorQuery = `
    SELECT 
      event_type as eventType, 
      COUNT(*) as count 
    FROM error_info 
    WHERE event_type IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY event_type
    ORDER BY count DESC
  `;

  const userBehaviorStmt = db.prepare(userBehaviorQuery);
  const userBehaviors = userBehaviorStmt.all(...params);

  const eventTargetQuery = `
    SELECT 
      event_target as eventTarget, 
      COUNT(*) as count 
    FROM error_info 
    WHERE event_target IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY event_target
    ORDER BY count DESC
    LIMIT 10
  `;

  const eventTargetStmt = db.prepare(eventTargetQuery);
  const eventTargets = eventTargetStmt.all(...params);

  const totalEventsQuery = `
    SELECT COUNT(*) as total 
    FROM error_info 
    WHERE event_type IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
  `;

  const totalEventsStmt = db.prepare(totalEventsQuery);
  const totalEventsResult = totalEventsStmt.get(...params) as any;

  // 页面停留分析
  const pageStayQuery = `
    SELECT 
      url, 
      AVG(page_stay_time) as avgStayTime, 
      COUNT(*) as visitCount 
    FROM error_info 
    WHERE page_stay_time IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY url
    ORDER BY avgStayTime DESC
  `;

  const pageStayStmt = db.prepare(pageStayQuery);
  const pageStayResults = pageStayStmt.all(...params);

  const avgStayTimeQuery = `
    SELECT AVG(page_stay_time) as avgStayTime 
    FROM error_info 
    WHERE page_stay_time IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
  `;

  const avgStayTimeStmt = db.prepare(avgStayTimeQuery);
  const avgStayTimeResult = avgStayTimeStmt.get(...params) as any;

  // 页面性能分析
  const performanceQuery = `
    SELECT 
      resource_type as resourceType, 
      AVG(load_time) as avgLoadTime, 
      COUNT(*) as count 
    FROM error_info 
    WHERE load_time IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY resource_type
    ORDER BY avgLoadTime DESC
  `;

  const performanceStmt = db.prepare(performanceQuery);
  const performanceResults = performanceStmt.all(...params);

  const avgLoadTimeQuery = `
    SELECT AVG(load_time) as avgLoadTime 
    FROM error_info 
    WHERE load_time IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
  `;

  const avgLoadTimeStmt = db.prepare(avgLoadTimeQuery);
  const avgLoadTimeResult = avgLoadTimeStmt.get(...params) as any;

  const slowResourcesQuery = `
    SELECT 
      resource_url as resourceUrl, 
      load_time as loadTime, 
      resource_type as resourceType 
    FROM error_info 
    WHERE load_time IS NOT NULL AND load_time > 3000 ${whereClause ? whereClause.substring(7) : ''}
    ORDER BY load_time DESC
    LIMIT 10
  `;

  const slowResourcesStmt = db.prepare(slowResourcesQuery);
  const slowResources = slowResourcesStmt.all(...params);

  // 页面访问分析
  const pageVisitQuery = `
    SELECT 
      url, 
      COUNT(*) as visits,
      COUNT(DISTINCT fingerprint) as visitors
    FROM error_info${whereClause}
    GROUP BY url
    ORDER BY visits DESC
  `;

  const pageVisitStmt = db.prepare(pageVisitQuery);
  const pageVisits = pageVisitStmt.all(...params);

  const totalVisitsQuery = `
    SELECT COUNT(*) as totalVisits 
    FROM error_info${whereClause}
  `;

  const totalVisitsStmt = db.prepare(totalVisitsQuery);
  const totalVisitsResult = totalVisitsStmt.get(...params) as any;

  const uniqueVisitorsQuery = `
    SELECT COUNT(DISTINCT fingerprint) as uniqueVisitors 
    FROM error_info${whereClause}
  `;

  const uniqueVisitorsStmt = db.prepare(uniqueVisitorsQuery);
  const uniqueVisitorsResult = uniqueVisitorsStmt.get(...params) as any;

  // 页面错误分析
  const pageErrorQuery = `
    SELECT 
      url, 
      COUNT(*) as errorCount 
    FROM error_info 
    WHERE level = 'ERROR' ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY url
    ORDER BY errorCount DESC
    LIMIT 10
  `;

  const pageErrorStmt = db.prepare(pageErrorQuery);
  const pageErrors = pageErrorStmt.all(...params);

  const totalPagesWithErrorsQuery = `
    SELECT COUNT(DISTINCT url) as totalPages 
    FROM error_info 
    WHERE level = 'ERROR' ${whereClause ? whereClause.substring(7) : ''}
  `;

  const totalPagesWithErrorsStmt = db.prepare(totalPagesWithErrorsQuery);
  const totalPagesWithErrorsResult = totalPagesWithErrorsStmt.get(...params) as any;

  // 设备分析
  const browserQuery = `
    SELECT 
      browser, 
      COUNT(*) as count 
    FROM error_info 
    WHERE browser IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY browser
    ORDER BY count DESC
  `;

  const browserStmt = db.prepare(browserQuery);
  const browsers = browserStmt.all(...params);

  const osQuery = `
    SELECT 
      os, 
      COUNT(*) as count 
    FROM error_info 
    WHERE os IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY os
    ORDER BY count DESC
  `;

  const osStmt = db.prepare(osQuery);
  const osList = osStmt.all(...params);

  const platformQuery = `
    SELECT 
      platform, 
      COUNT(*) as count 
    FROM error_info 
    WHERE platform IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY platform
    ORDER BY count DESC
  `;

  const platformStmt = db.prepare(platformQuery);
  const platforms = platformStmt.all(...params);

  // 网络分析
  const networkQuery = `
    SELECT 
      network_type as networkType, 
      COUNT(*) as count 
    FROM error_info 
    WHERE network_type IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY network_type
    ORDER BY count DESC
  `;

  const networkStmt = db.prepare(networkQuery);
  const networkTypes = networkStmt.all(...params);

  // 路由分析
  const routeQuery = `
    SELECT 
      route_from as routeFrom, 
      route_to as routeTo, 
      COUNT(*) as count 
    FROM error_info 
    WHERE route_from IS NOT NULL AND route_to IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
    GROUP BY route_from, route_to
    ORDER BY count DESC
    LIMIT 10
  `;

  const routeStmt = db.prepare(routeQuery);
  const routes = routeStmt.all(...params);

  const totalRoutesQuery = `
    SELECT COUNT(*) as totalRoutes 
    FROM (
      SELECT route_from, route_to 
      FROM error_info 
      WHERE route_from IS NOT NULL AND route_to IS NOT NULL ${whereClause ? whereClause.substring(7) : ''}
      GROUP BY route_from, route_to
    )
  `;

  const totalRoutesStmt = db.prepare(totalRoutesQuery);
  const totalRoutesResult = totalRoutesStmt.get(...params) as any;

  // 计算百分比
  const totalBrowsers = (browsers as any[]).reduce((sum, item) => sum + item.count, 0);
  const browsersWithPercentage = (browsers as any[]).map(item => ({
    name: item.browser,
    count: item.count,
    percentage: totalBrowsers ? Math.round((item.count / totalBrowsers) * 10000) / 100 : 0
  }));

  const totalOs = (osList as any[]).reduce((sum, item) => sum + item.count, 0);
  const osWithPercentage = (osList as any[]).map(item => ({
    name: item.os,
    count: item.count,
    percentage: totalOs ? Math.round((item.count / totalOs) * 10000) / 100 : 0
  }));

  const totalPlatforms = (platforms as any[]).reduce((sum, item) => sum + item.count, 0);
  const platformsWithPercentage = (platforms as any[]).map(item => ({
    name: item.platform,
    count: item.count,
    percentage: totalPlatforms ? Math.round((item.count / totalPlatforms) * 10000) / 100 : 0
  }));

  const totalNetworkTypes = (networkTypes as any[]).reduce((sum, item) => sum + item.count, 0);
  const networkTypesWithPercentage = (networkTypes as any[]).map(item => ({
    type: item.networkType,
    count: item.count,
    percentage: totalNetworkTypes ? Math.round((item.count / totalNetworkTypes) * 10000) / 100 : 0
  }));

  // 返回详细分析结果
  return {
    ...baseAnalytics,

    // 用户行为分析
    userBehaviors: {
      totalEvents: totalEventsResult?.total || 0,
      eventTypes: (userBehaviors as any[]).map(item => ({
        type: item.eventType,
        count: item.count
      })),
      topTargets: (eventTargets as any[]).map(item => ({
        target: item.eventTarget,
        count: item.count
      }))
    },

    // 页面停留分析
    pageStayAnalysis: {
      avgStayTime: avgStayTimeResult?.avgStayTime || 0,
      pages: (pageStayResults as any[]).map(item => ({
        url: item.url,
        avgStayTime: item.avgStayTime,
        visitCount: item.visitCount
      }))
    },

    // 页面性能分析
    performanceAnalysis: {
      avgLoadTime: avgLoadTimeResult?.avgLoadTime || 0,
      resources: (performanceResults as any[]).map(item => ({
        type: item.resourceType,
        avgLoadTime: item.avgLoadTime,
        count: item.count
      })),
      slowResources: (slowResources as any[]).map(item => ({
        url: item.resourceUrl,
        loadTime: item.loadTime,
        type: item.resourceType
      }))
    },

    // 页面访问分析
    pageVisitAnalysis: {
      totalVisits: totalVisitsResult?.totalVisits || 0,
      uniqueVisitors: uniqueVisitorsResult?.uniqueVisitors || 0,
      topPages: (pageVisits as any[]).map(item => ({
        url: item.url,
        visits: item.visits,
        visitors: item.visitors
      }))
    },

    // 页面错误分析
    pageErrorAnalysis: {
      totalPagesWithErrors: totalPagesWithErrorsResult?.totalPages || 0,
      topErrorPages: (pageErrors as any[]).map(item => ({
        url: item.url,
        errorCount: item.errorCount
      }))
    },

    // 设备分析
    deviceAnalysis: {
      browsers: browsersWithPercentage,
      os: osWithPercentage,
      platforms: platformsWithPercentage
    },

    // 网络分析
    networkAnalysis: {
      types: networkTypesWithPercentage
    },

    // 路由分析
    routeAnalysis: {
      totalRoutes: totalRoutesResult?.totalRoutes || 0,
      topRoutes: (routes as any[]).map(item => ({
        from: item.routeFrom,
        to: item.routeTo,
        count: item.count
      }))
    }
  };
};

/**
 * 获取特定插件的分析数据
 * @param pluginName 插件名称
 * @param startDate 开始时间戳
 * @param endDate 结束时间戳
 */
export const getPluginAnalytics = async (
  pluginName: string,
  startDate?: number,
  endDate?: number
) => {
  let baseQuery = 'SELECT * FROM error_info WHERE plugin_name = ?';
  let countQuery = 'SELECT level, COUNT(*) as count FROM error_info WHERE plugin_name = ?';
  let recentQuery = 'SELECT * FROM error_info WHERE plugin_name = ?';
  const params: any[] = [pluginName];
  const countParams: any[] = [pluginName];
  const recentParams: any[] = [pluginName];

  if (startDate || endDate) {
    const conditions: string[] = [];
    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
      countParams.push(startDate);
      recentParams.push(startDate);
    }
    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
      countParams.push(endDate);
      recentParams.push(endDate);
    }

    const whereClause = ` AND ${conditions.join(' AND ')}`;
    baseQuery += whereClause;
    countQuery += whereClause;
    recentQuery += whereClause;
  }

  // 按级别统计
  countQuery += ' GROUP BY level';
  const levelStatsStmt = db.prepare(countQuery);
  const levelStats = levelStatsStmt.all(...countParams);

  // 最近的错误
  recentQuery += ' ORDER BY timestamp DESC LIMIT 20';
  const recentErrorsStmt = db.prepare(recentQuery);
  const recentErrors = recentErrorsStmt.all(...recentParams);

  const result: any = {
    pluginName,
    total: 0,
    levels: {} as Record<string, number>,
    recentErrors: (recentErrors as IErrorInfo[]).map((err: any) => ({
      message: err.message,
      level: err.level,
      timestamp: err.timestamp,
      date: err.date
    }))
  };

  (levelStats as any).forEach((stat: any) => {
    const count = stat.count;
    result.levels[stat.level] = count;
    result.total += count;
  });

  return result;
};

/**
 * 获取特定用户的行为流程数据
 * @param fingerprint 用户指纹
 * @param startDate 开始时间戳
 * @param endDate 结束时间戳
 */
export const getUserBehaviorFlow = async (
  fingerprint: string,
  startDate?: number,
  endDate?: number
) => {
  let baseQuery = 'SELECT * FROM error_info WHERE fingerprint = ?';
  const params: any[] = [fingerprint];

  if (startDate || endDate) {
    const conditions: string[] = ['fingerprint = ?'];
    params.push(fingerprint);

    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
    }

    baseQuery = `SELECT * FROM error_info WHERE ${conditions.join(' AND ')}`;
  }

  // 按时间排序获取用户的所有行为
  baseQuery += ' ORDER BY timestamp ASC';
  const stmt = db.prepare(baseQuery);
  const behaviors = stmt.all(...params);

  // 处理行为数据，形成完整的操作流程
  const flowData: any[] = [];
  let currentPage = '';
  let pageEnterTime = 0;

  (behaviors as any[]).forEach((behavior: any) => {
    // 判断行为类型
    if (behavior.plugin_name === 'route') {
      // 路由变化行为
      const routeItem = {
        type: 'route',
        timestamp: behavior.timestamp,
        date: behavior.date,
        from: behavior.route_from,
        to: behavior.route_to,
        stayTime: behavior.page_stay_time,
        url: behavior.url
      };

      // 更新当前页面信息
      currentPage = behavior.route_to || '';
      pageEnterTime = behavior.timestamp;

      flowData.push(routeItem);
    }
    else if (behavior.plugin_name === 'performance' && behavior.event_type === 'navigation') {
      // 页面性能数据（白屏时间等）
      const performanceItem = {
        type: 'performance',
        timestamp: behavior.timestamp,
        date: behavior.date,
        fcp: behavior.extra_data?.fcp, // 首次内容绘制时间
        fp: behavior.extra_data?.fp,   // 首次绘制时间
        lcp: behavior.extra_data?.lcp, // 最大内容绘制时间
        url: behavior.url
      };

      flowData.push(performanceItem);
    }
    else if (behavior.plugin_name === 'xhr' || behavior.plugin_name === 'fetch') {
      // 网络请求行为
      const networkItem = {
        type: 'network',
        timestamp: behavior.timestamp,
        date: behavior.date,
        url: behavior.url,
        resourceUrl: behavior.resource_url,
        resourceType: behavior.resource_type,
        loadTime: behavior.load_time,
        httpStatus: behavior.http_status,
        method: behavior.event_type, // GET, POST等
        page: currentPage
      };

      flowData.push(networkItem);
    }
    else if (behavior.plugin_name === 'dom') {
      // DOM操作行为
      const domItem = {
        type: 'dom',
        timestamp: behavior.timestamp,
        date: behavior.date,
        eventType: behavior.event_type, // click, input等
        target: behavior.event_target,  // 点击的元素
        url: behavior.url,
        page: currentPage
      };

      flowData.push(domItem);
    }
    else if (behavior.level === 'ERROR' || behavior.level === 'WARN') {
      // 错误或警告行为
      const errorItem = {
        type: 'error',
        timestamp: behavior.timestamp,
        date: behavior.date,
        level: behavior.level,
        message: behavior.message,
        stack: behavior.stack,
        url: behavior.url,
        page: currentPage
      };

      flowData.push(errorItem);
    }
    else {
      // 其他行为
      const otherItem = {
        type: 'other',
        timestamp: behavior.timestamp,
        date: behavior.date,
        pluginName: behavior.plugin_name,
        message: behavior.message,
        url: behavior.url,
        page: currentPage
      };

      flowData.push(otherItem);
    }
  });

  // 汇总统计信息
  const stats = {
    totalActions: flowData.length,
    routeChanges: flowData.filter(item => item.type === 'route').length,
    domActions: flowData.filter(item => item.type === 'dom').length,
    networkRequests: flowData.filter(item => item.type === 'network').length,
    errors: flowData.filter(item => item.type === 'error').length,
    performanceRecords: flowData.filter(item => item.type === 'performance').length
  };

  return {
    fingerprint,
    stats,
    flow: flowData
  };
};

/**
 * 按平台获取分析数据
 * @param platform 平台名称
 * @param startDate 开始时间戳
 * @param endDate 结束时间戳
 */
export const getPlatformAnalytics = async (
  platform: string,
  startDate?: number,
  endDate?: number
) => {
  let whereClause = ' WHERE platform = ?';
  const params: any[] = [platform];

  if (startDate || endDate) {
    const conditions: string[] = [`platform = ?`];
    params.push(platform);

    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
    }

    whereClause = ` WHERE ${conditions.join(' AND ')}`;
  }

  // 获取该平台的详细分析数据
  const detailedAnalytics = await getDetailedAnalytics(
    startDate,
    endDate ? endDate : undefined
  );

  // 过滤出该平台的数据
  const platformQuery = `SELECT * FROM error_info ${whereClause}`;
  const platformStmt = db.prepare(platformQuery);
  const platformData = platformStmt.all(...params);

  return {
    platform,
    totalRecords: platformData.length,
    analytics: detailedAnalytics
  };
};