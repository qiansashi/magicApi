/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const Base = require('./base.js');
const fs = require('fs');
const salt = 'sdu@s3of9$do*ldmf';
const picUrl = 'http://www.yfspecialweb.cn:9999/imgs/';
module.exports = class extends Base {
  async indexAction() {
    const username = this.post('username');
    const password = this.post('password');
    const user = await this.model('user').where({
      name: username
    }).find();
    if (think.isEmpty(user)) {
      return this.fail(402, '请先注册！');
    }
    console.log(think.md5(password + salt));
    if (think.md5(password + salt) !== user.password) {
      return this.fail(403, '密码错误！');
    }
    await this.model('user').where({
      user_id: user.user_id
    }).update({
      last_login_time: parseInt(Date.now() / 1000)
    });
    const TokenSerivce = this.service('token', 'user');
    const sessionKey = await TokenSerivce.createToken({
      user_id: user.user_id
    });
    if (think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }
    const userInfo = {
      user_id: user.user_id,
      name: user.name,
      avatar: user.avatar,
      last_login_time: user.last_login_time
    };
    return this.success({
      token: sessionKey,
      userInfo: userInfo
    });
  }
  async uploadAvatarAction() {
    const uploadFile = this.file('file');
    const localPath = 'C:/Users/94132/Desktop/测试/';
    const newFilePath = localPath + uploadFile.name;
    const sameFile = fs.readFile(newFilePath, (err, data) => {
      if (err) {
        this.fail('文件有误或存在相同文件名!');
      }
    });
    const picData = fs.readFileSync(uploadFile.path);
    fs.writeFile(newFilePath, picData, (err, data) => {
      if (err) {
        this.fail('存储过程中出现错误!');
      }
    });
    return this.success({
      img_url: picUrl + uploadFile.name,
      localPath: newFilePath
    });
  }
  async registerAction() {
    const username = this.post('username');
    const password = this.post('password');
    const avatar = this.post('avatar');
    if (password.length > 127 || username.length > 40) {
      return this.fail(405, '请勿超过限定长度！');
    }
    const check = await this.model('user').where({
      name: username
    }).find();
    if (!think.isEmpty(check)) {
      return this.fail(406, '该用户名已注册！');
    }
    const pwd = think.md5(password + salt);
    const rtime = parseInt(Date.now() / 1000);
    await this.model('user').add({
      name: username,
      password: pwd,
      avatar: avatar,
      register_time: rtime,
      last_login_time: rtime
    });
    return this.success({
      status: '注册成功！'
    });
  }
};
