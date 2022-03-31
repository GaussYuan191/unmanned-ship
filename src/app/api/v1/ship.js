const Router = require("koa-router");

const { shipData } = require("../../models/shipData");
const { Auth } = require("../../../middlewares/auth");

const router = new Router({
  prefix: "/v1/ship",
});

router.get("/getData", new Auth().m, async (ctx, next) => {
  const uid = ctx.auth.uid;
  let data = await shipData.getData(uid)
  throw new global.errs.Success(data);
});


module.exports = router;
