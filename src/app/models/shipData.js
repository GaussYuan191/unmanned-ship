const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");
const { User } = require("./user");
const { UserShipRelation } = require("./userShipRelation");
const {Ship} = require("./ship");
const { LoginType } = require("../lib/enum");

class shipData extends Model {
  static async getDataBy(code = "", type) {
    let user = null;
    switch (type) {
      case LoginType.USER_EMAIL:
        user = await User.findOne({
          where: {
            email: code,
          },
        });
        break;
      case LoginType.USER_MINI_PROGRAM:
        user = await User.findOne({
          where: {
            openid: code,
          },
        });
        break;
      default:
        throw new global.errs.ParameterException("没有相应的处理方法");
        break;
    }

    if (!user) {
      throw new global.errs.AuthFailed("用户不存在");
    }
    let userShipRelation = await UserShipRelation.findOne({
      where: {
        uid: user.id
      }
    })
    let ship = await Ship.findOne({
      where: {
        sid: userShipRelation.sid
      }
    })
    let data = await ShipData.findOne({
      where: {
        uid: user.id,
      },
    });
    console.log('查出的数据', data);
    if (!data) {
      throw new global.errs.AuthFailed("");
    }
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
    hum: Sequelize.INTEGER

  },
  { sequelize,
    tableName: 'ship_data'
  }
);

module.exports = {
  shipData
}