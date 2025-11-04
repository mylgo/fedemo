# 📤 文件上传进度监控 Demo

一个完整的文件上传进度监控示例，包含前端和后端实现。

## 功能特性

### 前端功能

- ✅ 点击选择文件
- ✅ 拖拽上传文件
- ✅ 实时显示上传进度
- ✅ 显示上传速度
- ✅ 计算剩余时间
- ✅ 显示已上传/总大小
- ✅ 美观的 UI 设计
- ✅ 响应式布局

### 后端功能

- ✅ Express 框架
- ✅ Multer 文件处理
- ✅ CORS 跨域支持
- ✅ 文件大小限制（100MB）
- ✅ 自动创建上传目录
- ✅ 生成唯一文件名
- ✅ 文件列表查询
- ✅ 文件删除功能
- ✅ 详细的日志输出

## 技术栈

### 前端

- 原生 JavaScript
- XMLHttpRequest (XHR)
- HTML5 拖拽 API
- CSS3 动画

### 后端

- Node.js
- Express.js
- Multer (文件上传中间件)
- CORS (跨域处理)

## 快速开始

### 1. 安装依赖

```bash
cd /Users/mac/workspace/fedemo/src/DebugDemo/文件上传进度监控
npm install
```

### 2. 启动服务器

```bash
npm start
# 或使用开发模式（自动重启）
npm run dev
```

### 3. 访问应用

在浏览器中打开 `index.html` 文件即可使用。

服务器运行在：`http://localhost:3000`

## API 接口

### 上传文件

```
POST http://localhost:3000/upload
Content-Type: multipart/form-data

FormData {
  file: <文件对象>
}
```

**响应示例：**

```json
{
  "success": true,
  "message": "文件上传成功",
  "filename": "example-1234567890-123456789.jpg",
  "originalname": "example.jpg",
  "size": 1024000,
  "mimetype": "image/jpeg",
  "path": "/uploads/example-1234567890-123456789.jpg"
}
```

### 获取文件列表

```
GET http://localhost:3000/files
```

**响应示例：**

```json
{
  "success": true,
  "count": 2,
  "files": [
    {
      "filename": "example-1234567890-123456789.jpg",
      "size": 1024000,
      "uploadTime": "2025-11-04T12:00:00.000Z",
      "url": "/uploads/example-1234567890-123456789.jpg"
    }
  ]
}
```

### 删除文件

```
DELETE http://localhost:3000/files/:filename
```

### 访问上传的文件

```
GET http://localhost:3000/uploads/:filename
```

## 项目结构

```
文件上传进度监控/
├── index.html          # 前端页面
├── index.js            # Node.js 服务器
├── package.json        # 项目配置
├── README.md           # 说明文档
└── uploads/            # 上传文件存储目录（自动创建）
```

## 核心代码说明

### 前端进度监听

使用 XMLHttpRequest 的 `upload.progress` 事件监听上传进度：

```javascript
xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const percentComplete = (e.loaded / e.total) * 100
    const speed = e.loaded / elapsed // 计算上传速度
    const remaining = (e.total - e.loaded) / speed // 计算剩余时间

    // 更新 UI
    progressBar.style.width = percentComplete + '%'
  }
})
```

### 后端文件处理

使用 Multer 中间件处理文件上传：

```javascript
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
})
```

## 配置选项

### 修改文件大小限制

在 `index.js` 中修改：

```javascript
limits: {
  fileSize: 100 * 1024 * 1024 // 修改为你需要的大小（字节）
}
```

### 修改上传目录

```javascript
const uploadDir = path.join(__dirname, 'uploads') // 修改目录路径
```

### 添加文件类型限制

在 `fileFilter` 函数中添加验证：

```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())

  if (extname) {
    cb(null, true)
  } else {
    cb('错误：只允许上传图片文件！')
  }
}
```

## 注意事项

1. **文件大小限制**：默认限制为 100MB，可根据需要调整
2. **跨域设置**：已配置 CORS，允许所有来源访问
3. **安全性**：生产环境建议添加文件类型验证、病毒扫描等
4. **存储**：默认存储在本地 `uploads` 目录，可改为云存储
5. **并发**：默认配置可处理多个并发上传

## 扩展功能建议

- [ ] 添加文件分片上传（支持超大文件）
- [ ] 添加断点续传功能
- [ ] 添加多文件同时上传
- [ ] 添加上传队列管理
- [ ] 添加文件预览功能
- [ ] 添加用户认证
- [ ] 集成云存储服务（如 OSS、S3）
- [ ] 添加图片压缩功能

## 许可证

MIT
