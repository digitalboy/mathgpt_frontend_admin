# 使用 Node.js 官方镜像作为构建环境
FROM node:20 as build-stage

# 设置工作目录
WORKDIR /app

# 复制前端项目的 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 构建Vue应用
RUN npm run build

# 使用同一Node.js镜像构建Express后端
FROM node:20 as server-stage

# 设置工作目录
WORKDIR /server

# 复制后端代码和后端专用的 package.json 文件
COPY --from=build-stage /app/server/package*.json ./
COPY --from=build-stage /app/server .

# 复制前端src目录到容器，保持平级目录结构
COPY --from=build-stage /app/src ../src

# 安装Express依赖
RUN npm install

# 生产环境使用 Nginx，并安装Node.js
FROM nginx:stable-alpine as production-stage

# 安装Node.js
RUN apk add --no-cache nodejs npm

# 从构建阶段复制Vue构建产出到 Nginx 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 从构建阶段复制Express服务器和src目录
COPY --from=server-stage /server /server
COPY --from=server-stage /src /src

# 复制 Nginx 配置文件到容器
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["sh", "-c", "nginx -g 'daemon off;' & node /server/index.js"]
