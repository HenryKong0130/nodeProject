// 引包
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const md5 = require("md5");
var jwt = require("express-jwt");

// 默认读取项目根目录下的 .env 环境变量文件
require("dotenv").config();
// 引入数据库连接
require("./dao/db");

// 引入路由
var adminRouter = require("./routes/admin");

// 创建服务器实例
var app = express();

// 使用各种各样的中间件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//配置验证token的接口
// app.use(
//   jwt({
//     secret: md5(process.env.JWT_SECRET), //我们自己在环境变量中设置的秘钥
//     algorithms: ["HS256"], //新版本的express-jwt必须要求指定算法
//   }).unless({
//     //需要排除的 token 验证的路由数组
//     path: [{ url: "/api/admin/login", methods: ["POST"] }],
//   })
// );

// 使用路由中间件
app.use("/api/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理，一旦发生了错误，就会到这里来
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
