const Koa = require('koa') // 导入Koa框架
const cors = require('koa2-cors') // 导入koa2-cors模块，用于处理跨域请求
const KoaRouter = require('koa-router') // 导入koa-router模块，用于处理路由
const bodyParser = require('koa-bodyparser') // 导入koa-bodyparser模块，用于解析请求体

const app = new Koa() // 创建一个新的Koa应用实例
const router = new KoaRouter() // 创建一个新的KoaRouter实例

app.use(bodyParser()) // 使用koa-bodyparser中间件解析请求体

app.use(
  cors({
    origin: '*', // 允许所有来源访问
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token'], // 允许的请求头
  })
) // 使用cors中间件处理跨域请求

router.post('/api/test', async (ctx) => {
  console.log(`%c ~ router.post ~ ctx`, `color: #008000;`, ctx)
  // 定义一个POST路由，路径为/api/test
  const requestData = ctx.request.body // 获取请求体中的数据

  ctx.body = {
    code: '1',
    info: 'info xxxx',
    message: 'message xxxxx',
    success: false,
  }
})

app.use(router.routes()).use(router.allowedMethods()) // 使用路由中间件处理路由
app.listen(3000, () => console.log('服务开启于 3000 端口')) // 在3000端口启动服务器
