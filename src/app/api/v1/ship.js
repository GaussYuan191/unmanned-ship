const Router = require("koa-router");

const { shipData } = require("../../models/shipData");
const { Ship } = require("../../models/ship");
const { Auth } = require("../../../middlewares/auth");
const { sleep } = require("../../../utils/sleep");
const { AddShipDataValidator } = require("../../validators/validator");
const router = new Router({
  prefix: "/v1/ship",
});
let flag = true;
router.post("/getData", async (ctx, next) => {
  // const uid = ctx.auth.uid;
  let queryParam = ctx.request.body;
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
  setInterval(showShipData, 2000);
  
})
router.post("/getShipList", async (ctx, next) => {
  let queryParam = ctx.request.body;
  let data = await Ship.getShipData(queryParam);
  throw new global.errs.Success(data);
});
router.post("/uploadData", new Auth().m, async (ctx, next) => {
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
