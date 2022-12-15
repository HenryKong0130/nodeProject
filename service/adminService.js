// admin 模块的业务逻辑层
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { loginDao } = require("../dao/adminDao");

module.exports.loginService = async function (loginInfo) {
  loginInfo.loginPwd = md5(loginInfo.loginPwd); // 进行加密
  // 接下来进行数据的验证，也就是查询该条数据在数据库里面有没有
  let data = await loginDao(loginInfo);
  if (data && data.dataValues) {
    // 添加 token
    data = {
        id:data.dataValues.id,
        loginId:data.dataValues.loginId,
        name:data.dataValues.name
    }
    var loginPeriod = null;
    if (loginInfo.remember) {
      loginPeriod = parseInt(loginInfo.remember);
    } else {
      loginPeriod = 1;
    }
    //生成token
    const token = jwt.sign(
      {
        id: data.id,
        loginId: data.loginId,
        name: data.name,
      },
      md5(process.env.JWT_SECRET),
      { expiresIn: 60 * 60 * 24 * loginPeriod }
    );
    //console.log(token);
    return { data, token };
  }
  return { data };
};
