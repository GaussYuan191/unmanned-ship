const bcrypt = require("bcryptjs");
const { Sequelize, Model } = require("sequelize");

const { sequelize } = require("../../core/db");

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new global.errs.Success("", 0, "用户不存在或密码不正确");
    }
    const correct = bcrypt.compareSync(plainPassword, user.password);
    if (!correct) {
      throw new global.errs.Success("", 0, "用户不存在或密码不正确");
    }
    return user;
  }
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid,
      },
    });
    return user;
  }
  static async registerByOpenid(openid) {
    return await User.create({
      openid,
    });
  }
  static async getUserList(queryParam) {
    let { reqPageNum = "", reqPageSize = "", uid = "" } = queryParam;
    reqPageNum = Number(reqPageNum);
    reqPageSize = Number(reqPageSize);
    console.log("请求参数", queryParam, uid);
    let user;
    if (uid) {
      user = await User.findAndCountAll({
        attributes: { exclude: ["password"] },
        distinct: true,
        where: {
          uid: uid,
        },
      });
    } else {
      user = await User.findAndCountAll({
        offset: (reqPageNum - 1) * reqPageSize,
        limit: reqPageSize,
        attributes: { exclude: ["password"] },
        distinct: true,
      });
    }
    if (!user) {
      throw new global.errs.NotFound("用户不存在");
    }
    console.log("用户数据", user.count);
    let data = { userInfoList: user.rows, ...queryParam, total: user.count };
    return data;
  }
}

User.init(
  {
    uid: {
      type: Sequelize.INTEGER,
      //设置为主键  关系型数据库
      //不能重复 不能为空
      //最好为数字，便于查询
      //如果只是简单的自增，并发条件下可能出错
      primaryKey: true,
      //设置自增
      autoIncrement: true,
    },
    nickname: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(128),
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      //set方法，自动加密
      set(val) {
        const salt = bcrypt.genSaltSync(10);
        const psw = bcrypt.hashSync(val, salt);
        this.setDataValue("password", psw);
      },
    },
    openid: {
      type: Sequelize.STRING(64),
      unique: true,
    },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    // delete_at: Sequelize.DATE,
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 8,
    },
  },
  { sequelize, tableName: "user" }
);

module.exports = {
  User,
};
//数据迁移 SQL 更新 风险
