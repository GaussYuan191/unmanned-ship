const { LinValidator, Rule } = require("../../core/lin-validator-v2");

const { User } = require("../models/user");
const { LoginType, ArtType } = require("../lib/enum");

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule("isInt", "需要是正整数", { min: 1 })];
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.email = [new Rule("isEmail", "不符合Email规范")];
    this.password1 = [
      new Rule("isLength", "密码至少6个字符，最多32个字符", {
        min: 6,
        max: 32
      }),
      new Rule(
        "matches",
        "密码不符合规范",
        "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]"
      )
    ];
    this.password2 = this.password1;
    this.nickname = [
      new Rule("isLength", "昵称不符合长度规范", {
        min: 2,
        max: 32
      })
    ];
  }
  validatePassword(vals) {
    const psw1 = vals.body.password1;
    const psw2 = vals.body.password2;
    if (psw1 !== psw2) {
      throw new Error("两个密码必须相同");
    }
  }
  async validateEmail(vals) {
    const email = vals.body.email;
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    if (user) {
      throw new Error("email已存在");
    }
  }
}

class TokenValidator extends LinValidator {
  constructor() {
    super();
    this.account = [
      new Rule("isLength", "不符合账号规则", { min: 2, max: 32 })
    ];
    this.secret = [
      new Rule("isOptional"),
      new Rule("isLength", "至少6个字符", {
        min: 6,
        max: 128
      })
    ];
  }
  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error("type是必选参数");
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error("type参数不合法");
    }
  }
}

class NotEmptyValidator extends LinValidator {
  constructor() {
    super();
    this.token = [new Rule("isLength", "不允许为空", { min: 1 })];
  }
}
class AddShipDataValidator extends LinValidator {
  constructor() {
    super();
    this.sid = [new Rule("isLength", "无人船id不允许为空", { min: 1 })];
    this.battery = [new Rule("isLength", "电量不允许为空", { min: 0 })];
    this.temp = [new Rule("isLength", "温度不允许为空", { min: 1 })];
    this.hum = [new Rule("isLength", "湿度不允许为空", { min: 1 })];
    this.speed = [new Rule("isLength", "速度不允许为空", { min: 1 })];
    this.algae_finish = [new Rule("isLength", "蓝藻打捞完成度不允许为空", { min: 1 })];
    this.algae_weight = [new Rule("isLength", "蓝藻打捞量不允许为空", { min: 1 })];
    this.status = [new Rule("isLength", "运行状态不允许为空", { min: 1 })];
  }
}
class AddShipValidator extends LinValidator {
  constructor() {
    super();
    this.name = [new Rule("isLength", "无人船名字不允许为空", { min: 1 })];
    this.cid = [new Rule("isLength", "绑定的摄像头编号不允许为空", { min: 1 })];
  }
}
class UpdateShipDataValidator extends LinValidator {
  constructor() {
    super();
    this.sid = [new Rule("isLength", "无人船id不允许为空", { min: 1 })];
    this.name = [new Rule("isLength", "无人船名字不允许为空", { min: 1 })];
  }
}
class AddPlanDataValidator extends LinValidator {
  constructor() {
    super();
    this.sid = [new Rule("isLength", "无人船id不允许为空", { min: 1 })];
    this.pname = [new Rule("isLength", "计划的名字运行为空", { min: 1 })];
    this.operation = [new Rule("isLength", "操作不允许为空", { min: 1 })];
  }
}


// 提取type检测
function checkType(vals) {
  const type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error("type是必选参数");
  }
  if (!LoginType.isThisType(type)) {
    throw new Error("type参数不合法");
  }
}

function checkArtType(vals) {
  const type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error("type是必选参数");
  }
  if (!ArtType.isThisType(type)) {
    throw new Error("type参数不合法");
  }
}

// 类的方式 进一步验证type是否合法，是否是以定义的type中的一种
// class Checker {
//   constructor(type){
//     this.enumType = type
//   }
//   check(vals) {
//     const type = vals.body.type || vals.path.type
//     if (!type) {
//       throw new Error("type是必选参数");
//     }
//     if (!this.enumType.isThisType(type)) {
//       throw new Error("type参数不合法");
//     }
//   }
// }

class SearchValidator extends LinValidator {
  constructor() {
    super();
    this.q = [
      new Rule("isLength", "搜索关键词不能为空", {
        min: 1,
        max: 16
      })
    ];
    this.start = [
      new Rule("isInt", "不符合规范", { min: 0, max: 60000 }),
      new Rule("isOptional", "", 0)
    ];
    this.count = [
      new Rule("isInt", "不符合规范", { min: 1, max: 20 }),
      new Rule("isOptional", "", 20)
    ];
  }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor(){
    super()
    this.content = [
      new Rule('isLength', '必须在1到12个字符之间', {
        min: 1,
        max: 12
      })
    ]
  }
}
module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  SearchValidator,
  AddShortCommentValidator,
  AddShipDataValidator,
  AddPlanDataValidator,
  AddShipValidator,
  UpdateShipDataValidator
};
