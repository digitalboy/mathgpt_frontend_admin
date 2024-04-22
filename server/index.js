// 文件路径: server/index.js

const express = require("express");
const app = express();
const codeBotRouter = require("./routers/codeBot");

// 使用路由
app.use("/api", codeBotRouter);

// 设置端口
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
