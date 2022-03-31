const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");
const { UserShipRelation } = require("./userShipRelation");
const {Ship} = require("./ship");

class shipData extends Model {
  static async getData(uid) {
    let userShipRelation = await UserShipRelation.findOne({
      where: {
        uid: uid
      }
    })
    if (!userShipRelation) {
      throw new global.errs.QueryError("该用户没有所属的无人船, 请先绑定无人船", 60001);
    }
    let ship = await Ship.findOne({
      where: {
        sid: userShipRelation.sid
      }
    })
    if (!ship) {
      throw new global.errs.QueryError("该无人船的数据不存在",  60002);
    }
    let data = await shipData.findOne({
      where: {
        uid: uid,
        sid: ship.sid
      },
    });

    if (!data) {
      throw new global.errs.QueryError("暂无无人船的航行数据",  60003);
    }
    return {...data.dataValues, ...ship.dataValues};
  }
}
shipData.init(
  {
    id: {
      type: Sequelize.INTEGER,
      //设置为主键  关系型数据库
      //不能重复 不能为空
      //最好为数字，便于查询
      //如果只是简单的自增，并发条件下可能出错
      primaryKey: true,
      //设置自增
      autoIncrement: true
    },
    uid: Sequelize.INTEGER,
    sid: Sequelize.INTEGER,
    battery: Sequelize.INTEGER,
    temp: Sequelize.INTEGER,
    hum: Sequelize.INTEGER,
    speed: Sequelize.DECIMAL(10, 2),
    algae_finish: Sequelize.FLOAT,
    algae_weight: Sequelize.FLOAT
  },
  { sequelize,
    tableName: 'ship_data'
  }
);

module.exports = {
  shipData
}