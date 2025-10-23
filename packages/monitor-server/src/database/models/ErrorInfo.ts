import mongoose, { Document, Schema, InferSchemaType } from 'mongoose';

const ErrorInfoSchema = new Schema({
  level: { type: String, required: true, index: true },
  message: { type: String, required: true },
  stack: { type: String },
  timestamp: { type: Number, required: true, index: true },
  date: { type: String, required: true },
  url: { type: String, required: true },
  userId: { type: String, index: true },
  pluginName: { type: String, index: true },
  fingerprint: { type: String, index: true },
  userAgent: { type: String },
  devicePixelRatio: { type: Number },
  extraData: { type: Schema.Types.Mixed }
}, {
  timestamps: true,
  versionKey: false // 禁用版本键 __v
});

// 添加索引提高查询性能
ErrorInfoSchema.index({ timestamp: 1 });
ErrorInfoSchema.index({ level: 1, timestamp: 1 });
ErrorInfoSchema.index({ pluginName: 1, timestamp: 1 });
ErrorInfoSchema.index({ fingerprint: 1, timestamp: 1 });

// 使用 InferSchemaType 推断类型，替代手动定义接口
export type IErrorInfo = InferSchemaType<typeof ErrorInfoSchema> & Document;

export const ErrorInfoModel = mongoose.model('ErrorInfo', ErrorInfoSchema);