const Router = require("koa-router");

const { Plan } = require("../../models/plan");
const { Ship } = require("../../models/ship");
const { Auth } = require("../../../middlewares/auth");
const { AddPlanDataValidator } = require("../../validators/validator");
const router = new Router({
  prefix: "/v1/plan",
});

router.post("/getPlanList", async (ctx, next) => {
  let queryParam = ctx.request.body;

  let data = await Plan.getPlanData(queryParam);
  throw new global.errs.Success(data);
});
router.post("/do", async (ctx, next) => {
  let queryParam = ctx.request.body;

  let data = await Plan.doPlan(queryParam);
  throw new global.errs.Success(data);
});
router.post("/add", async (ctx, next) => {
  const v = await new AddPlanDataValidator().validate(ctx);
  let queryParam = v.get("body");
  let data = await Plan.addPlan(queryParam);
  throw new global.errs.Success(data);
});
router.post("/delete", async (ctx, next) => {
  let queryParam = ctx.request.body;
  let data = await Plan.deletePlan(queryParam);
  throw new global.errs.Success(data);
});

module.exports = router;
