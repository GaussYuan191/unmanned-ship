const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");
const { User } = require("./user");
class shipData extends Model {
  static async getData(email) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new global.errs.AuthFailed("用户不存在");
    }
    const data = await shipData.findOne({
      where: {
        uid: user.id,
      },
    });
    if (!data) {
      throw new global.errs.AuthFailed("");
    }
  }
}
