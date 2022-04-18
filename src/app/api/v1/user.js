const Router = require("koa-router");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");
const { RegisterValidator } = require("../../validators/validator");

const router = new Router({
  prefix: "/v1/user",
});

// 注册
// 参数：email password1 password2
router.post("/register", async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let queryParam = ctx.request.body;
  let { reqPageNum, reqPageSize, uid = "" } = queryParam;
  reqPageNum = Number(reqPageNum);
  reqPageSize = Number(reqPageSize);
  console.log("请求参数", queryParam, uid);
  const v = await new RegisterValidator().validate(ctx);

  const user = {
    email: v.get("body.email"),
    password: v.get("body.password1"),
    nickname: v.get("body.nickname"),
    level: v.get("body.level"),
  };
  console.log("用户数据", user);
  const r = await User.create(user);
  //调用错误抛出正确
  throw new global.errs.Success();
});

// 查询所有用户
// 参数：
router.post("/userList", async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let queryParam = ctx.request.body;
  let data = await User.getUserList(queryParam);
  //调用错误抛出正确
  throw new global.errs.Success(data);
});
// 修改
// 参数：user
router.post("/update", async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let queryParam = ctx.request.body;
  let { uid } = queryParam;
  console.log("请求参数", queryParam);
  let data = await User.update(
    {
      ...queryParam, //要修改的数据
    },
    {
      where: { uid }, //查询修改项的条件
    }
  );
  if (data.length != 0) {
    throw new global.errs.Success("", 0, "修改成功");
  } else {
    throw new global.errs.EditError("修改失败");
  }
});
// 删除
router.post("/delete", async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let queryParam = ctx.request.body;
  let { uid } = queryParam;
  console.log("请求参数", queryParam, uid);
  if (!uid) {
    throw new global.errs.ParameterException();
  }

  console.log(await User.findAndCountAll({ where: { uid: 2 } }));
  let data = await User.destroy({
    where: {
      uid: uid,
    },
  });
  console.log("data", data);
  if (data) {
    throw new global.errs.Success("", 0, "删除成功");
  } else {
    throw new global.errs.EditError("没有该用户，删除失败");
  }

  //调用错误抛出正确
});
router.post("/updatePassword", async (ctx, next) => {
  //validator必须位于第一行，起到守门员的作用
  let queryParam = ctx.request.body;
  let { uid = "", oldPassword = "", newPassword = "" } = queryParam;
  console.log("请求参数", queryParam);
  try {
    let passwordData = await User.findOne({
      where: {
        uid: uid,
      },
      attributes: ["password"],
    });
    const correct = bcrypt.compareSync(
      oldPassword,
      passwordData.dataValues.password
    );
    if (!correct) {
      throw new global.errs.EditError("原密码错误，修改失败");
    }

    let data = await User.update(
      {
        password: newPassword, //要修改的数据
      },
      {
        where: { uid }, //查询修改项的条件
      }
    );
    if (data.length != 0) {
      throw new global.errs.Success("", 0, "修改成功");
    } else {
      throw new global.errs.EditError("修改失败");
    }
  } catch (err) {
    throw new global.errs.EditError("修改失败");
  }
});
module.exports = router;
