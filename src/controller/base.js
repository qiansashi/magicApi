module.exports = class extends think.Controller {
  async __before() {
    think.token = this.ctx.header['magic-token'] || '';
    const tokenSerivce = think.service('token', 'user');
    think.userId = await tokenSerivce.getUserId();
    if (this.ctx.controller === 'file') {
      if (think.userId <= 0) {
        return this.fail(401, '请先登录，再查看文件！');
      }
    }
  }
};
