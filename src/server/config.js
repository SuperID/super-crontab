module.exports = function (set, get, has) {

  set('web.port', 3000);
  set('web.session.maxAge', 3600000 * 24 * 7);

  set('db.mysql.pool', {min: 0, max: 10});

};
