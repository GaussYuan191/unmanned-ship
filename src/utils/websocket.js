const WebSocket = require("ws");
const url = require("url");
const { shipData } = require("../app/models/shipData");
const { Ship } = require("../app/models/ship");
class ws {
  static online = 0; // 在线连接
  static ws = WebSocket.Server; //默认实例
  static shipDataTime = {}; //获取无人船定时任务id
  static init(server) {
    // 创建实例
    this.ws = new WebSocket.Server({ server, path: "/v1/ws" });
    this.ws.on("connection", async (ws, request) => {
      console.log("请求链接", request.url);
      if (!request.url.includes("/v1/ws")) {
        ws.send(JSON.stringify("请求路径错误"));
        return ws.close();
      }
      this.online = this.ws._server._connections;
      console.log(`socket当前在线${this.online}个连接`);
      const param = url.parse(request.url, true)?.query;
      try {
        //do something
        const id = param?.id;
        ws.id = id; // 添加ws实例的唯一标识
        this.sendShipData(id, ws, param);
      } catch (error) {
        console.log("websocket connection error", error);
        return ws.close();
      }
    });
  }
  //
  static sendShipData(uid, ws, param) {
    try {
      const type = param?.type;
      const sid = param?.sid;
      console.log("请求参数", param);
      if (!uid) {
        ws.send(JSON.stringify("缺少用户id"));
        return ws.close();
      }
      if (!type) {
        ws.send(JSON.stringify("缺少请求数据名"));
        return ws.close();
      }
      if (!sid) {
        ws.send(JSON.stringify("缺少无人船id"));
        return ws.close();
      }
      let showShipData = async (queryParam) => {
        shipData.getData(queryParam).then(
          (res) => {
            console.log("查询成功, websoet返回的数据中");
            ws.send(JSON.stringify(res));
          },
          (err) => {
            console.log("无人船查询数据异常", err);
            ws.send(JSON.stringify(err));
            clearInterval(this.shipDataTime[uid]);
            return ws.close();
          }
        );
        Ship.findAndCountAll({ where: { sid } }).then(
          (res) => {
            let shipStatus = res.rows[0].dataValues.status;
            if (shipStatus == 0) {
              let result = {
                msg: "无人船运行异常",
                data: "",
                error_code: 40000,
              };
              ws.send(JSON.stringify(result));
            }
          },
          (err) => {
            console.log("无人船查询数据异常", err);
            ws.send(JSON.stringify(err));
            clearInterval(this.shipDataTime[uid]);
            return ws.close();
          }
        );
      };

      let timer;
      // showShipData({ uid: uid, sid: sid });
      if (!this.shipDataTime[uid]) {
        this.shipDataTime[uid] = setInterval(() => {
          return showShipData({ uid: uid, sid: sid });
        }, 4000);
      } else {
        this.shipDataTime[uid] = null;
        clearInterval(this.shipDataTime[uid]);
      }

      // console.log('用户定时任务id', this.shipDataTime[uid])
    } catch (err) {
      console.log("websocket error", err);
      return ws.close();
    }
  }
  // 发送客户端数据
  static sendToCliect(Data) {
    let iskeep = false; // 加个变量做下发成功判断
    if (!(this.ws instanceof WebSocket.Server)) {
      return iskeep;
    }
    const { id } = Data;
    this.ws.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.id === id) {
        // 发送给指定匹配id
        console.log("回复数据", JSON.stringify(Data));
        client.send(JSON.stringify(Data));
        iskeep = true;
      }
    });
    return iskeep;
  }
}
module.exports = ws;
