const Router = require("koa-router");

const {
  TokenValidator,
  NotEmptyValidator,
} = require("../../validators/validator");
const { LoginType } = require("../../lib/enum");
const { User } = require("../../models/user");
const { generateToken } = require("../../../core/util");
const { Auth } = require("../../../middlewares/auth");
const { WXManager } = require("../../services/wx");
const jwt = require("jsonwebtoken");
const basicAuth = require("basic-auth");
const router = new Router({
  prefix: "/v1/getData",
});

router.get("/", new Auth().m, async (ctx, next) => {
  // const v = await new TokenValidator().validate(ctx);
  const uid = ctx.auth.uid;
  console.log(uid);
  // let payload = getJWTPayload(userToken)

  // 分type处理
  // 这里为了兼容x-www-form-urlencoded方法，使用了强制转换成数字
  // 上一步已经判断了type是否存在，强制转换安全

  // switch (parseInt(v.get("body.type"))) {
  //   case LoginType.USER_EMAIL:
  //     token = await emailLogin(v.get("body.account"), v.get("body.secret"));
  //     break;
  //   case LoginType.USER_MINI_PROGRAM:
  //     token = await WXManager.codeToToken(v.get('body.account'))
  //     break;
  //   default:
  //     throw new global.errs.ParameterException('没有相应的处理方法')
  //     break;
  // }

  throw new global.errs.Success();
});

/* 通过token获取JWT的payload部分 */

function getJWTPayload(userToken) {
  // 验证并解析JWT
  console.log(userToken);
  return jwt.verify(userToken.name, global.config.security.secretKey);
}

async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret);
  return generateToken(user.id, Auth.USER);
}

module.exports = router;
