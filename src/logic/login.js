module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'post';
    this.rules = {
      username: { required: true, string: true },
      password: { required: true, string: true }
    };
  }
};
