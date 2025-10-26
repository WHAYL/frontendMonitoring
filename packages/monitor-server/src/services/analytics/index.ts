// 导出所有分析服务
import { BaseAnalyticsService, getOverallAnalytics } from './BaseAnalytics';
import { RealtimeAnalyticsService } from './RealtimeAnalytics';
import { UserAnalyticsService } from './UserAnalytics';
import { PerformanceAnalyticsService } from './PerformanceAnalytics';
import { DeviceAnalyticsService } from './DeviceAnalytics';
import { FunnelAnalyticsService } from './FunnelAnalytics';
import { RetentionAnalyticsService } from './RetentionAnalytics';
import { AlertAnalyticsService } from './AlertAnalytics';
import { ExportService } from './ExportService';

export { BaseAnalyticsService, getOverallAnalytics };
export { RealtimeAnalyticsService };
export { UserAnalyticsService };
export { PerformanceAnalyticsService };
export { DeviceAnalyticsService };
export { FunnelAnalyticsService };
export { RetentionAnalyticsService };
export { AlertAnalyticsService };
export { ExportService };

// 便捷函数导出
export const getRealtimeAnalytics = RealtimeAnalyticsService.getRealtimeData;
export const getUserAnalytics = UserAnalyticsService.getUserAnalytics;
export const getUserBehaviorFlow = UserAnalyticsService.getUserBehaviorFlow;
export const getPerformanceAnalytics = PerformanceAnalyticsService.getPerformanceAnalytics;
export const getDeviceAnalytics = DeviceAnalyticsService.getDeviceAnalytics;
export const getFunnelAnalytics = FunnelAnalyticsService.getFunnelAnalytics;
export const getRetentionAnalytics = RetentionAnalyticsService.getRetentionAnalytics;
export const getAlertAnalytics = AlertAnalyticsService.getAlertAnalytics;
export const exportAnalyticsData = ExportService.exportAnalyticsData;