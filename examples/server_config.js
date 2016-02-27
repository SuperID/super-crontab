module.exports = function (set, get, has) {

  set('db.mysql.connection', {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'super_crontab',
  });

};
