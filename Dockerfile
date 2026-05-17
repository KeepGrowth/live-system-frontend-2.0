# 阶段一：使用 Node.js 镜像进行项目打包
FROM node:20-alpine AS builder
WORKDIR /app
# 拷贝依赖文件并安装（使用国内镜像源加速）
COPY package*.json ./
RUN npm install --registry=https://registry.npmmirror.com
# 拷贝所有源码并执行打包命令，生成 dist 目录
COPY . .
RUN npm run build

# 阶段二：使用 Nginx 镜像作为运行环境
FROM nginx:stable-alpine
# 从第一阶段（builder）的 /app/dist 目录拷贝打包好的文件到 Nginx 的静态资源目录
COPY --from=builder /app/dist /usr/share/nginx/html
# 拷贝第一步写好的 Nginx 配置文件，覆盖默认配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露容器的 8000 端口
EXPOSE 8000
