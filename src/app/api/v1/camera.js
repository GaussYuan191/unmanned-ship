const Router = require("koa-router");

const { Camera } = require("../../models/camera");

const { Auth } = require("../../../middlewares/auth");

const router = new Router({
  prefix: "/v1/camera",
});

// router.get("/getData", new Auth().m, async (ctx, next) => {
//   const uid = ctx.auth.uid;
//   let data = await shipData.getData(uid)
//   throw new global.errs.Success(data);
// });
router.get("/getVideo", async (ctx, next) => {
  const queryParam = ctx.query
  let data = await Camera.getVideo(queryParam);
  throw new global.errs.Success(data);
});
// router.post("/uploadData", new Auth().m, async (ctx, next) => {
//   // const uid = ctx.auth.uid;
//   // let data = await shipData.getData(uid)
//   // throw new global.errs.Success(data);
//   console.log("上传的数据--", ctx);
// });

module.exports = router;
