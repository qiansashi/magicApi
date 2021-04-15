/* eslint-disable no-console */
const Base = require('./base.js');
const fs = require('fs');
module.exports = class extends Base {
  async indexAction() {
    // const user = await this.model('user').where({
    //   user_id: 1002
    // }).select();
    // return this.success({
    //   user: user
    // });
    const userId = think.userId;
    const htmlFile = await this.model('file').field('file_id,name,location_url,create_time').where({
      user_id: userId,
      is_deleted: 0
    }).select();
    // console.log(htmlFile);
    return this.success(htmlFile);
  }
  async readFileAction() {
    const fileId = this.get('fileId');
    const selectedFile = await this.model('file').field('location_url,local_address').where({
      file_id: fileId,
      is_deleted: 0
    }).find();
    if (think.isEmpty(selectedFile)) {
      return this.fail(407, '找不到该文件！');
    }
    const filePath = selectedFile.local_address;
    // console.log(filePath);
    try {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      if (fileData == null) {
        return this.fail(408, '文件找不到源路径！');
      } else {
        return this.success({
          fileId: fileId,
          locationUrl: selectedFile.location_url,
          file: fileData
        });
      }
    } catch (err) {
      console.log(err);
      return this.fail(409, '路径错误');
    }
    // return this.success('读取成功！');
  }
  async saveFileAction() {
    const fileId = this.post('fileId');
    const fileData = this.post('fileData');
    const selectedFile = await this.model('file').field('location_url,local_address').where({
      file_id: fileId,
      is_deleted: 0
    }).find();
    if (think.isEmpty(selectedFile)) {
      return this.fail(407, '找不到该文件！');
    }
    const filePath = selectedFile.local_address;
    try {
      fs.writeFile(filePath, fileData, (err, data) => {
        if (err) {
          this.fail('存储过程中出现错误!');
        } else {
          return this.success(selectedFile);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  async newFileAction() {
    const fileName = this.post('fileName');
    const fileData = this.post('fileData');
    const check = await this.model('file').where;
    const newFile = await this.model('file').add({
      name: fileName

    });
  }
};
