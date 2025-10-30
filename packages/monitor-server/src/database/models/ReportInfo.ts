import { IReportInfo } from '../../types';
import { db } from '../index';
import { LogCategoryKeyValue, LogCategory, LogCategoryValue } from '@whayl/monitor-core';
import { handleErrorInfo } from '../../controllers/ErrorInfoController';
import { handlePageLifecycle } from '../../controllers/PageLifecycleController';

const CategoryMap = {
  [LogCategoryKeyValue.error]: handleErrorInfo,
  [LogCategoryKeyValue.pageLifecycle]: handlePageLifecycle,
} as const;
export class ReportInfoModel {
  static async create(ctx, reportInfo: IReportInfo) {
    console.log('reportInfo', reportInfo);
    if (typeof CategoryMap[reportInfo.logCategory] === 'function') {
      CategoryMap[reportInfo.logCategory](ctx, reportInfo);
    }

  }
  static async createBatch(ctx, reportInfos: IReportInfo[]) {
    reportInfos.forEach(reportInfo => {
      console.log('reportInfo', reportInfo);
      ReportInfoModel.create(ctx, reportInfo);
    });

  }
}