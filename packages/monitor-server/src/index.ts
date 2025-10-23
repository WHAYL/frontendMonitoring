import Koa from 'koa';
import Router from '@koa/router';
import cors from 'koa2-cors';
import { koaBody } from 'koa-body';

import { setupRoutes } from './routes';

const app = new Koa();
const router = new Router();

// 中间件
app.use(cors());
app.use(koaBody({
  multipart: true,
  json: true,
  text: true, // 支持处理文本类型数据，用于 navigator.sendBeacon
  urlencoded: true,
  onError: (err, ctx) => {
    console.error('[Koa Body] Error:', err);
  },
  formidable: {
    maxFileSize: 200 * 1024 * 1024 // 200MB
  }
}));

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || 'Internal Server Error'
    };
    console.error('Server Error:', err);
  }
});

// 连接数据库

// 设置路由
setupRoutes(router);

// 使用路由
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Monitor server is running on port ${PORT}`);
});

export default app;