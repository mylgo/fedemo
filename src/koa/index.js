const Koa = require('koa') // 导入Koa框架
const cors = require('koa2-cors') // 导入koa2-cors模块，用于处理跨域请求
const KoaRouter = require('koa-router') // 导入koa-router模块，用于处理路由
const bodyParser = require('koa-bodyparser') // 导入koa-bodyparser模块，用于解析请求体

const app = new Koa() // 创建一个新的Koa应用实例
const router = new KoaRouter() // 创建一个新的KoaRouter实例

// 添加错误处理中间件，必须放在其他中间件之前
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error('服务器错误:', err)
    // 设置响应状态
    ctx.status = err.status || 500
    // 设置响应体
    ctx.body = {
      code: err.status || 500,
      message: err.message || '服务器内部错误',
      success: false,
    }
  }
})

app.use(bodyParser()) // 使用koa-bodyparser中间件解析请求体

app.use(
  cors({
    origin: '*', // 允许所有来源访问
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token'], // 允许的请求头
  })
) // 使用cors中间件处理跨域请求

// 原有的接口，故意抛出异常
router.post('/api/test', async (ctx) => {
  console.log(`接收到请求 /api/test`)
  const requestData = ctx.request.body // 获取请求体中的数据
  let a = undefined
  // 这里会导致错误，被全局错误处理器捕获
  ctx.body = {
    code: '1',
    info: `info xxxx${a.a}`,
    message: 'message xxxxx',
    success: false,
  }
})

// 新增模拟各种异常的接口
router.post('/api/mock/error', async (ctx) => {
  const { errorType, errorCode = 500, message = '服务器内部错误' } = ctx.request.body

  switch (errorType) {
    case 'timeout':
      // 模拟请求超时
      await new Promise((resolve) => setTimeout(resolve, 30000))
      break
    case 'validation':
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '参数验证失败',
        success: false,
        errors: ['字段不能为空', '格式不正确'],
      }
      break
    case 'unauthorized':
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '未授权访问',
        success: false,
      }
      break
    case 'forbidden':
      ctx.status = 403
      ctx.body = {
        code: 403,
        message: '禁止访问',
        success: false,
      }
      break
    case 'notFound':
      ctx.status = 404
      ctx.body = {
        code: 404,
        message: '资源不存在',
        success: false,
      }
      break
    case 'error':
    default:
      // 抛出一个错误，触发错误处理中间件
      const error = new Error(message)
      error.status = errorCode
      throw error
  }
})

// 正常响应接口示例
router.post('/api/mock/success', async (ctx) => {
  const { delay = 0 } = ctx.request.body

  if (delay > 0) {
    // 模拟延迟响应
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  ctx.body = {
    code: 200,
    message: '请求成功',
    success: true,
    data: {
      id: 1,
      name: '测试数据',
      time: new Date().toISOString(),
    },
  }
})

app.use(router.routes()).use(router.allowedMethods()) // 使用路由中间件处理路由
app.listen(3000, () => console.log('服务开启于 3000 端口')) // 在3000端口启动服务器
