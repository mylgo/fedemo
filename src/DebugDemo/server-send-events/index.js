// 引入核心依赖
const Koa = require('koa') // 引入Koa框架，一个轻量级的Node.js Web应用框架
const cors = require('koa2-cors') // 引入CORS中间件，实现跨域资源共享
const KoaStatic = require('koa-static') // 引入静态资源中间件，用于提供静态文件服务
const path = require('path') // 引入Node.js的path模块，用于跨平台的路径处理
const KoaRouter = require('koa-router') // 引入路由中间件，用于URL路由管理
const { PassThrough } = require('stream') // 引入Node.js的PassThrough流，用于实现数据的流式传输

// 初始化应用
const app = new Koa() // 创建Koa应用实例，作为整个服务器的核心
const router = new KoaRouter() // 创建路由实例，用于管理API路由

// 配置CORS中间件
app.use(
  cors({
    origin: '*', // 允许所有源的请求访问，生产环境建议配置具体的域名
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 配置允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 配置允许的HTTP请求头
  })
)

// 配置SSE路由
router.get('/open-ai/sendMsg', async (ctx) => {
  // 设置SSE所需的HTTP头部
  ctx.type = 'text/event-stream' // 指定内容类型为SSE
  ctx.set({
    'Content-Type': 'text/event-stream', // 确保客户端以SSE方式处理响应
    'Cache-Control': 'no-cache', // 禁用缓存，确保数据实时性
    Connection: 'keep-alive', // 保持连接活跃，允许持续推送数据
  })

  // 创建数据流通道
  const steamData = new PassThrough() // 创建双工流，用于数据传输
  ctx.body = steamData // 将流设置为响应体

  // 模拟数据推送
  let i = 1 // 计数器初始化
  let timer = setInterval(() => {
    if (i === 11) {
      // 达到结束条件（计数到11）
      steamData.write(`data: word[DONE]\n\n`) // 发送结束标记
      clearInterval(timer) // 清理定时器，防止内存泄漏
    } else {
      steamData.write(`data: word${i}\n\n`) // 按SSE格式发送数据，每条数据以\n\n结尾
    }
    i++ // 更新计数器
  }, 500) // 每500ms发送一次数据
})

// 配置静态资源服务
app.use(new KoaStatic(path.resolve(__dirname, './fe'))) // 将./fe目录下的文件作为静态资源提供服务

// 注册路由中间件
app.use(router.routes()).use(router.allowedMethods()) // 启用路由并自动响应OPTIONS请求

// 启动服务器
app.listen(8086, () => console.log('服务开启于 8086 端口')) // 在8086端口启动HTTP服务器
