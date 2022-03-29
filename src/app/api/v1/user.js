const Router = require("koa-router");

const {User} = require('../../models/user')
const { RegisterValidator } = require("../../validators/validator");
const router = new Router({
  prefix: "/v1/user"
});

// 注册
// 参数：email password1 password2
router.post("/register", async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  const v = await new RegisterValidator().validate(ctx);

  const user = {
    email: v.get('body.email'),
    password: v.get('body.password1'),
    nickname: v.get('body.nickname')
  }
  console.log("用户数据",user);
  const r = await User.create(user)
  //调用错误抛出正确
  throw new global.errs.Success()
});

module.exports = router;
