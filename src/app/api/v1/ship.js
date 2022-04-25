const Router = require("koa-router");

const { shipData } = require("../../models/shipData");
const { Ship } = require("../../models/ship");
const { Auth } = require("../../../middlewares/auth");
const { sleep } = require("../../../utils/sleep");
const { AddShipDataValidator, AddShipValidator ,UpdateShipDataValidator} = require("../../validators/validator");
const router = new Router({
  prefix: "/v1/ship",
});
let flag = true;
router.post("/getData", new Auth(Auth.USER).m, async (ctx, next) => {
  let queryParam = {...ctx.request.body, ...ctx.auth};
  let data = await shipData.getData(queryParam);
  throw new global.errs.Success(data);
});
router.all('/ws/getData', async (ctx) => {
  const queryParam = ctx.query
   // 给客户端发送链接成功信息
  let showShipData = async () => {
    let data = await shipData.getData(queryParam);
    console.log("websoet返回的数据中")
    ctx.websocket.send(JSON.stringify(data));
  }
  // 监听客户端发送过来的信息
  ctx.websocket.on('message', function(message) {
      console.log('接收的信息', JSON.parse(message.toString()));
      // uid为接收方，将接收到的信息发送给接收方uid,可以根据自己的需求处理数据再发送
      
  });
  // 定时2秒 发送一次
  // setInterval(showShipData, 2000);
  
})
router.post("/getShipList", new Auth(Auth.USER).m, async (ctx, next) => {
  let queryParam = {...ctx.request.body, ...ctx.auth};
  let data = await Ship.getShipData(queryParam);
  throw new global.errs.Success(data);
});
router.post("/add", new Auth(Auth.ADMIN).m, async (ctx, next) => {
  const v = await new AddShipValidator().validate(ctx);
  let data = await Ship.addShip(v.get("body"));
  throw new global.errs.Success("", 0, "无人船新增成功");
});
router.post("/update", new Auth(Auth.USER).m, async (ctx, next) => {
  const v = await new UpdateShipDataValidator().validate(ctx);
  let data = await Ship.updateShip(v.get("body"));
  throw new global.errs.Success("", 0, "无人船修改成功");
});
router.post("/uploadData", new Auth(Auth.USER).m, async (ctx, next) => {
  if (flag) {
    const v = await new AddShipDataValidator().validate(ctx);
    await shipData.addData(v.get("body"));
    flag = false;
    sleep(990).then((res) => {
      flag = true;
    });
    throw new global.errs.Success("", 0, "上传数据成功");
  } else {
    
    throw new global.errs.QueryError("上传数据的间隔小于1分钟");
  }
});

module.exports = router;
