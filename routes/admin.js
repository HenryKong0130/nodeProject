var express = require("express");
var router = express.Router();
var { formatResponse, analysisToken } = require("../utils/tool");

const { loginService } = require("../service/adminService");

/* GET home page. */
router.post("/login", async function (req, res, next) {
  // 首先应该有一个验证码的验证

  // 假设上面的验证码已经通过了
  const result = await loginService(req.body);
  if (result.token) {
    res.setHeader("authorization", result.token);
  }
  //返回的数据通过工具函数，格式化成一个统一的形式传递给用户
  res.send(formatResponse(0, "", result.data));
});

//恢复登录状态
router.get("/whoami", async function (req, res, next) {
  //1.从客户端的请求拿到token
  const token = req.get("Authorization");
  //2.使用工具函数解析token，还原成有用的信息，将有用的信息发送给客户
  const result = analysisToken(token);
  console.log(result,'解析后的结果');
  res.send(
    formatResponse(0, "", {
      loginId: result.loginId,
      name: result.name,
      id: result.id,
    })
  );
});

module.exports = router;
