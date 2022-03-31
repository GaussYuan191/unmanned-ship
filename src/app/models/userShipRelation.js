const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");

class UserShipRelation extends Model {
  
}
User.init(
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
    sid: Sequelize.INTEGER
  },
  { sequelize,
    tableName: 'user_ship_relation'
  }
);

module.exports = {
  UserShipRelation
}