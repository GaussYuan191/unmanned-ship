const Router = require("koa-router");

const { Plan } = require("../../models/plan");
const { Ship } = require("../../models/ship");
const { Auth } = require("../../../middlewares/auth");

const router = new Router({
  prefix: "/v1/plan",
});

// router.get("/getData", new Auth().m, async (ctx, next) => {
//   const uid = ctx.auth.uid;
//   let data = await shipData.getData(uid)
//   throw new global.errs.Success(data);
// });
router.post("/getPlanList", async (ctx, next) => {
  let queryParam = ctx.request.body;

  let data = await Plan.getPlanData(queryParam);
  throw new global.errs.Success(data);
});
// router.post("/uploadData", new Auth().m, async (ctx, next) => {
//   // const uid = ctx.auth.uid;
//   // let data = await shipData.getData(uid)
//   // throw new global.errs.Success(data);
//   console.log("上传的数据--", ctx);
// });

module.exports = router;
