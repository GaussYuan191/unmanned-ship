const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");

class Camera extends Model {
  static async getCameraData(queryParam) {
    let { reqPageNum = "", reqPageSize = "", uid = "" } = queryParam;
    reqPageNum = Number(reqPageNum);
    reqPageSize = Number(reqPageSize);
    let data;
    if (uid) {
      let userShipRelation = await UserShipRelation.findOne({
        where: {
          uid: uid,
        },
      });
      if (!userShipRelation) {
        throw new global.errs.QueryError(
          "该用户没有所属的无人船, 请先绑定无人船",
          60001
        );
      }
      data = await Ship.findAndCountAll({
        where: {
          sid: userShipRelation.sid,
        },
      });
    } else {
      data = await Ship.findAndCountAll({
        offset: (reqPageNum - 1) * reqPageSize,
        limit: reqPageSize,
        distinct: true,
      });
      console.log("data", data);
    }
    if (!data) {
      throw new global.errs.QueryError("该无人船的数据不存在", 60002);
    }
    return data.rows;
  }
}

Camera.init(
  {
    cid: {
      type: Sequelize.INTEGER,
      //设置为主键  关系型数据库
      //不能重复 不能为空
      //最好为数字，便于查询
      //如果只是简单的自增，并发条件下可能出错
      primaryKey: true,
      //设置自增
      autoIncrement: true,
    },
    cstatus: Sequelize.INTEGER,
  },
  { sequelize, tableName: "camera" }
);

module.exports = {
  Camera,
};
//数据迁移 SQL 更新 风险
