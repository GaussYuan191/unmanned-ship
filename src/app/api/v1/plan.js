const Router = require("koa-router");

const { Plan } = require("../../models/plan");
const { Ship } = require("../../models/ship");
const { Auth } = require("../../../middlewares/auth");
const { AddPlanDataValidator } = require("../../validators/validator");
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
router.post("/add", async (ctx, next) => {
  const v = await new AddPlanDataValidator().validate(ctx);
  let queryParam = v.get("body");
  let data = await Plan.addPlan(queryParam);
  throw new global.errs.Success(data);
});

module.exports = router;
