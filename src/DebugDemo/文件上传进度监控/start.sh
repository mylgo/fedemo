#!/bin/bash

echo "🚀 启动文件上传进度监控服务..."
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    echo ""
fi

# 启动服务器
echo "✅ 启动服务器..."
echo "📍 前端地址: http://localhost:3000"
echo "📍 上传接口: http://localhost:3000/upload"
echo ""
echo "💡 按 Ctrl+C 停止服务器"
echo ""

node index.js
