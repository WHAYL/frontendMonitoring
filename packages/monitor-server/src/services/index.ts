// 导入所有服务
import { AlertService } from './AlertService';
import { DataProcessingService } from './DataProcessingService';

// 导出所有服务
export { AlertService } from './AlertService';
export { DataProcessingService } from './DataProcessingService';

// 导出分析服务
export * from './analytics';

// 便捷函数导出
export const processUserSession = DataProcessingService.processUserSession;
export const processPageVisit = DataProcessingService.processPageVisit;
export const processUserBehavior = DataProcessingService.processUserBehavior;
export const processNetworkRequest = DataProcessingService.processNetworkRequest;
export const processPerformanceMetric = DataProcessingService.processPerformanceMetric;
export const checkAlertRules = AlertService.checkAlertRules;
export const startAlertChecker = AlertService.startAlertChecker;