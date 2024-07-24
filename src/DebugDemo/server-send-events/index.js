const Koa = require('koa') // 导入Koa框架
const cors = require('koa2-cors') // 导入koa2-cors模块，用于处理跨域请求
const KoaStatic = require('koa-static') // 导入koa-static模块，用于处理静态资源
const path = require('path') // 导入path模块，用于处理文件和目录的路径
const KoaRouter = require('koa-router') // 导入koa-router模块，用于处理路由
const { PassThrough } = require('stream') // 从stream模块中导入PassThrough类，用于创建可读可写的流

const app = new Koa() // 创建一个新的Koa应用实例
const router = new KoaRouter() // 创建一个新的KoaRouter实例
app.use(
  cors({
    origin: '*', // 允许所有来源访问
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 允许的请求头
  })
) // 使用cors中间件处理跨域请求
router.get('/open-ai/sendMsg', async (ctx) => {
  // 定义一个GET路由，路径为/open-ai/sendMsg
  ctx.type = 'text/event-stream' // 设置响应类型为text/event-stream，用于发送服务器端事件
  ctx.set({
    'Content-Type': 'text/event-stream', // 设置响应头的Content-Type为text/event-stream
    'Cache-Control': 'no-cache', // 设置响应头的Cache-Control为no-cache，禁止浏览器缓存响应
    Connection: 'keep-alive', // 设置响应头的Connection为keep-alive，保持长连接
  })
  const steamData = new PassThrough() // 创建一个新的PassThrough流实例
  ctx.body = steamData // 将响应体设置为PassThrough流
  let i = 1 // 初始化计数器
  let timer = setInterval(() => {
    // 创建一个定时器，每500毫秒执行一次
    if (i === 11) {
      // 如果计数器达到21
      steamData.write(`data: word[DONE]\n\n`) // 向PassThrough流中写入结束信息
      clearInterval(timer) // 清除定时器
    } else {
      steamData.write(`data: word${i}\n\n`) // 向PassThrough流中写入计数器的值
    }
    i++ // 计数器加1
  }, 500)
})
app.use(new KoaStatic(path.resolve(__dirname, './fe'))) // 使用koa-static中间件处理静态资源，静态资源的目录为当前目录下的fe目录
app.use(router.routes()).use(router.allowedMethods()) // 使用路由中间件处理路由
app.listen(8086, () => console.log('服务开启于 8086 端口')) // 在8086端口启动服务器
