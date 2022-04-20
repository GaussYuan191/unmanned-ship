const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");
class Auth {
  constructor(level) {
    this.level = level || 1;
    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SUPER_ADMIN = 32;
  }
  //中间件的方式验证token
  get m() {
    return async (ctx, next) => {
      const userToken = basicAuth(ctx.req);
      let errMsg = "token不合法";
      let decode;
      let flag = false;
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbbiden(errMsg);
      }
      try {
        decode = jwt.verify(userToken.name, global.config.security.secretKey);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          errMsg = "token已过期";
        }
        throw new global.errs.Forbbiden(errMsg);
      }
      console.log("aaa", decode.scope, this.level);
      if (decode.scope < this.level) {
        errMsg = "权限不足,请求失败";
        throw new global.errs.Forbbiden(errMsg);
      }
      if (decode.scope >= Auth.ADMIN) {
        flag = true;
      }

      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
        admin: flag,
      };

      await next();
    };
  }
  static verifyToken(userToken) {
    try {
      jwt.verify(userToken, global.config.security.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = {
  Auth,
};
