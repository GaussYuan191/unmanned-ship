const Router = require("koa-router");

const { Auth } = require("../../../middlewares/auth");
const { Flow } = require("@models/flow");
const { Art } = require("@models/art");
const { Favor } = require("@models/favor");

const { PositiveIntegerValidator, classicValidator } = require("@validator/validator");
const router = new Router({
  prefix: "/v1/classic"
});

router.get("/", async (ctx, next) => {
  ctx.body = { key: "classic name" };
});

//最新信息
router.get("/latest", new Auth().m, async (ctx, next) => {
  //排序查找最新
  const flow = await Flow.findOne({
    order: [["index", "DESC"]]
  });
  const art = await Art.getData(flow.art_id, flow.type);
  console.log("art", art)
  const likeLatest = await Favor.userLikeIt(
    flow.art_id,
    flow.type,
    ctx.auth.uid
  );
  // art是一个类，对象序列化json
  art.setDataValue("index", flow.index);
  art.setDataValue("like_status", likeLatest);
  // 下面的方法不严谨
  // art.dataValues.index = flow.index

  //全局model JSON序列化
  // art.exclude = ['index','like_status','title']
  ctx.body = art;
});

//下一期信息
router.get("/:index/next", new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  });
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index : index + 1
    }
  })
  if(!flow){
    throw new global.errs.NotFound()
  }
  const art = await Art.getData(flow.art_id, flow.type);
  const likeNext = await Favor.userLikeIt(
    flow.art_id,
    flow.type,
    ctx.auth.uid
  );
  art.setDataValue("index", flow.index);
  art.setDataValue("like_status", likeNext);
  ctx.body = art;
});

//上一期信息
router.get("/:index/previous", new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  });
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index : index - 1
    }
  })
  if(!flow){
    throw new global.errs.NotFound()
  }
  const art = await Art.getData(flow.art_id, flow.type);
  const likePrevious = await Favor.userLikeIt(
    flow.art_id,
    flow.type,
    ctx.auth.uid
  );
  art.setDataValue("index", flow.index);
  art.setDataValue("like_status", likePrevious);
  ctx.body = art;
});

// 获取某一个期刊的详细信息
// 如果只有少数几次复用，不建议重构，会损失灵活性
router.get('/:type/:id', new Auth().m, async(ctx, next) => {
  const v = await new classicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = v.get('path.type')

  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
  artDetail.art.setDataValue('like_status', artDetail.like_status)
  ctx.body = artDetail.art
})

// 获取点赞情况
router.get('/:type/:id/favor', new Auth().m, async (ctx, next) => {
  const v = await new classicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = v.get('path.type')
  // const art = await Art.getData(id, type)
  // if(!art) {
  //   throw new global.errs.NotFound()
  // }
  // const like = await Favor.userLikeIt(
  //   id,
  //   type,
  //   ctx.auth.uid
  // );
  //根据'/:type/:id'接口优化，实例化类方法
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
  ctx.body = {
    fav_nums: artDetail.art.fav_nums,
    like_status: artDetail.like_status
  }
})

//获取所有喜欢的列表
router.get('/favor', new Auth().m, async ctx => {
  const uid = ctx.auth.uid
  ctx.body = await Favor.getMyClassicFavors(uid)
})

module.exports = router;
