// 导出所有控制器
export { DataCollectionController } from './DataCollectionController';
export { AnalyticsController } from './AnalyticsController';
export { AlertController } from './AlertController';
export { DataQueryController } from './DataQueryController';

// 导入所有控制器以确保在使用时能够正确识别
import { DataCollectionController } from './DataCollectionController';
import { AnalyticsController } from './AnalyticsController';
import { AlertController } from './AlertController';
import { DataQueryController } from './DataQueryController';

// 便捷函数导出
export const saveUserSession = DataCollectionController.saveUserSession;
export const savePageVisit = DataCollectionController.savePageVisit;
export const savePerformanceMetric = DataCollectionController.savePerformanceMetric;
export const saveUserBehavior = DataCollectionController.saveUserBehavior;
export const saveNetworkRequest = DataCollectionController.saveNetworkRequest;

export const getRealtimeData = AnalyticsController.getRealtimeData;
export const getUserAnalyticsData = AnalyticsController.getUserAnalyticsData;
export const getPerformanceData = AnalyticsController.getPerformanceData;
export const getDeviceData = AnalyticsController.getDeviceData;
export const getAlertData = AnalyticsController.getAlertData;
export const getFunnelData = AnalyticsController.getFunnelData;
export const getRetentionData = AnalyticsController.getRetentionData;
export const exportData = AnalyticsController.exportData;

export const createAlertRule = AlertController.createAlertRule;
export const getAlertRules = AlertController.getAlertRules;
export const updateAlertRule = AlertController.updateAlertRule;
export const deleteAlertRule = AlertController.deleteAlertRule;
export const getAlertRecords = AlertController.getAlertRecords;
export const resolveAlert = AlertController.resolveAlert;

export const getUserSessions = DataQueryController.getUserSessions;
export const getPageVisits = DataQueryController.getPageVisits;
export const getUserBehaviors = DataQueryController.getUserBehaviors;
export const getNetworkRequests = DataQueryController.getNetworkRequests;
export const getPerformanceMetrics = DataQueryController.getPerformanceMetrics;
export const getUserBehaviorFlow = DataQueryController.getUserBehaviorFlow;
export const getSystemOverview = DataQueryController.getSystemOverview;