const Router = require("koa-router");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");
const { RegisterValidator } = require("../../validators/validator");
const { Auth } = require("../../../middlewares/auth");
const router = new Router({
  prefix: "/v1/user",
});

// 注册
// 参数：email password1 password2
router.post("/register", new Auth(Auth.ADMIN).m, async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let queryParam = ctx.request.body;
  console.log("注册请求参数", queryParam);
  const v = await new RegisterValidator().validate(ctx);
  const user = {
    email: v.get("body.email"),
    password: v.get("body.password1"),
    nickname: v.get("body.nickname"),
  };
  // console.log("用户数据", user);
  await User.create(user);
  //调用错误抛出正确
  throw new global.errs.Success("", 0, "注册成功");
});

// 查询所有用户
// 参数：
router.post("/userList", new Auth(Auth.USER).m, async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let queryParam = {...ctx.request.body, ...ctx.auth};
  let data = await User.getUserList(queryParam);
  //调用错误抛出正确
  throw new global.errs.Success(data);
});
// 修改
// 参数：user
router.post("/update", new Auth(Auth.USER).m, async (ctx, next) => {
  let param = ctx.request.body;
  await User.updateUser(param);
});
// 删除
router.post("/delete",new Auth(Auth.ADMIN).m, async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let param = ctx.request.body;
  await User.deleteUser(param);

  //调用错误抛出正确
});
router.post("/updatePassword", async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let param = ctx.request.body;
  await User.updatePassword(param)
});
module.exports = router;
