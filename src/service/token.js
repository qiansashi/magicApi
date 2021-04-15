const jsonToken = require('jsonwebtoken');
const secret = 'JM!4q434k.hT4yW';
module.exports = class extends think.Service {
  // 根据token获取userid
  async getUserId() {
    // 获取token
    const token = think.token;
    if (!token) {
      return 0;
    }
    const result = await this.parseToken();
    if (think.isEmpty(result) || result.user_id <= 0) {
      return 0;
    }
    return result.user_id;
  }
  // 获取用户信息
  async getUserInfo() {
    const userId = await this.getUserId();
    if (userId <= 0) {
      return null;
    }
    const userInfo = await this.model('user').where({user_id: userId}).find();
    return think.isEmpty(userInfo) ? null : userInfo;
  }
  // 解析token
  async parseToken() {
    if (think.token) {
      try {
        return jsonToken.verify(think.token, secret);
      } catch (err) {
        return null;
      }
    }
    return null;
  }
  // 加密token
  async createToken(user) {
    const token = jsonToken.sign(user, secret);
    return token;
  }
};
