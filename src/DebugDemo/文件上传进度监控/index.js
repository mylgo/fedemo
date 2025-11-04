const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 3000

// 创建 uploads 目录（如果不存在）
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// 配置 CORS - 允许前端跨域访问
app.use(cors())

// 配置静态文件服务（可选，用于直接访问上传的文件）
app.use('/uploads', express.static(uploadDir))

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // 正确解码文件名，处理中文乱码
    const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')

    // 生成唯一文件名：时间戳-随机数-原始文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(originalname)
    const basename = path.basename(originalname, ext)
    // 使用解码后的文件名
    cb(null, `${basename}-${uniqueSuffix}${ext}`)
  },
})

// 文件过滤器（可选）
const fileFilter = (req, file, cb) => {
  // 可以在这里添加文件类型验证
  // 例如：只允许图片
  // const allowedTypes = /jpeg|jpg|png|gif/;
  // const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  // const mimetype = allowedTypes.test(file.mimetype);

  // if (mimetype && extname) {
  //   return cb(null, true);
  // } else {
  //   cb('错误：只允许上传图片文件！');
  // }

  // 允许所有文件类型
  cb(null, true)
}

// 配置 multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 限制文件大小为 100MB
  },
})

// 根路由
app.get('/', (req, res) => {
  res.send(`
    <h1>文件上传服务器</h1>
    <p>服务器运行中...</p>
    <p>上传接口: POST /upload</p>
    <p>已上传文件列表: GET /files</p>
  `)
})

// 文件上传接口
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有接收到文件',
      })
    }

    // 正确解码原始文件名
    const originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf8')

    // 记录上传信息
    console.log('文件上传成功:')
    console.log('- 原始文件名:', originalname)
    console.log('- 保存文件名:', req.file.filename)
    console.log('- 文件大小:', (req.file.size / 1024 / 1024).toFixed(2), 'MB')
    console.log('- 文件类型:', req.file.mimetype)
    console.log('---')

    // 返回成功响应
    res.json({
      success: true,
      message: '文件上传成功',
      filename: req.file.filename,
      originalname: originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: `/uploads/${req.file.filename}`,
    })
  } catch (error) {
    console.error('上传错误:', error)
    res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error.message,
    })
  }
})

// 获取已上传文件列表
app.get('/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir)

    const fileList = files.map((filename) => {
      const filePath = path.join(uploadDir, filename)
      const stats = fs.statSync(filePath)

      return {
        filename: filename,
        size: stats.size,
        uploadTime: stats.birthtime,
        url: `/uploads/${filename}`,
      }
    })

    res.json({
      success: true,
      count: fileList.length,
      files: fileList,
    })
  } catch (error) {
    console.error('获取文件列表错误:', error)
    res.status(500).json({
      success: false,
      message: '获取文件列表失败',
      error: error.message,
    })
  }
})

// 删除文件接口（可选）
app.delete('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(uploadDir, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '文件不存在',
      })
    }

    fs.unlinkSync(filePath)

    res.json({
      success: true,
      message: '文件删除成功',
      filename: filename,
    })
  } catch (error) {
    console.error('删除文件错误:', error)
    res.status(500).json({
      success: false,
      message: '文件删除失败',
      error: error.message,
    })
  }
})

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    // Multer 错误
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件太大，最大允许 100MB',
      })
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }

  // 其他错误
  console.error('服务器错误:', error)
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: error.message,
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log('='.repeat(50))
  console.log('📤 文件上传服务器已启动')
  console.log('='.repeat(50))
  console.log(`🌐 服务器地址: http://localhost:${PORT}`)
  console.log(`📁 上传目录: ${uploadDir}`)
  console.log(`📊 上传限制: 100MB`)
  console.log('='.repeat(50))
  console.log('可用接口:')
  console.log(`  POST   /upload        - 上传文件`)
  console.log(`  GET    /files         - 获取文件列表`)
  console.log(`  DELETE /files/:name   - 删除文件`)
  console.log(`  GET    /uploads/:name - 访问上传的文件`)
  console.log('='.repeat(50))
})
