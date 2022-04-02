const Router = require("koa-router");

const { Auth } = require("../../../middlewares/auth");
const { UserShipRelation } = require("../../models/userShipRelation");
const router = new Router({
  prefix: "/v1/relation",
});

router.post("/add", new Auth().m, async (ctx, next) => {
  const uid = ctx.auth.uid;
  const sid = ctx.request.body.sid;
  await UserShipRelation.add(uid, sid);
  throw new global.errs.Success();
});

module.exports = router;
