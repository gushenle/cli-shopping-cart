# 使用 Node.js 官方镜像
FROM node:18-alpine

# 安装 git，用于从 GitHub clone 代码
RUN apk add --no-cache git

# 设置工作目录
WORKDIR /app

# 从你的公共 GitHub 仓库 clone 项目代码到容器内
RUN git clone https://github.com/gushenle/cli-shopping-cart.git .

# 安装依赖
RUN npm install

# 启动命令行购物车应用（需要以交互方式运行：docker run -it）
CMD ["npm", "start"]