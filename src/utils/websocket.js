const WebSocket = require('ws')
const querystring = require('querystring')
class ws {
  static online = 0; // 在线连接
  static ws = WebSocket.Server; //默认实例
  static init(server) {
    // 创建实例
    this.ws = new WebSocket.Server({ server, path: "/v1/ws" });
    this.ws.on("connection", async (ws, request) => {
      console.log('请求链接', request.url)
      if (!request.url.includes("/v1/ws")) {
        return ws.close();
      }
      this.online = this.ws._server._connections;
      console.log(`socket当前在线${this.online}个连接`);
      const {
        query: { id },
      } = querystring.parse(request.url);
      if (!id) {
        return ws.close();
      }
      try {
        //do something
        // 这里可以做一些加强判断查询数据库等行为

        ws.id = id; // 添加ws实例的唯一标识
        const obj = { message: "连接成功", retCode: 200 };
        ws.send(JSON.stringify(obj));
      } catch (error) {
        console.log("websocket connection error", error);
        return ws.close();
      }
    });
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
