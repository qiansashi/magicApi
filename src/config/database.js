const mysql = require('think-model-mysql');

module.exports = {
  handle: mysql,
  database: 'magicDB',
  prefix: 'magic_',
  encoding: 'utf8mb4',
  host: '127.0.0.6',
  port: '3306',
  user: 'root',
  password: 'Dongyifan1999030',
  dateStrings: true
};
