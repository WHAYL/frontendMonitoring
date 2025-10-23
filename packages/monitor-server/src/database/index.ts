import mongoose from 'mongoose';

// 数据模型
import { ErrorInfoModel, IErrorInfo } from './models/ErrorInfo';

export { ErrorInfoModel, IErrorInfo };

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/monitor';

/**
 * 连接数据库
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    // 添加新的连接选项以适应最新版本的 MongoDB 驱动
    await mongoose.connect(MONGODB_URI, {
      // 确保使用新的 URL 字符串解析器
      // useNewUrlParser: true, // 在 Mongoose 6+ 版本中已弃用
      // useUnifiedTopology: true, // 在 Mongoose 6+ 版本中已弃用

      // 设置服务器选择超时
      serverSelectionTimeoutMS: 5000,

      // 自动索引创建
      autoIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * 断开数据库连接
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};