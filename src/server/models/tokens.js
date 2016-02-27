/**
 * models
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function (done) {

  const mysql = $.data('db.mysql');

  mysql.schema.hasTable('tokens')
    .then(exists => {
      if (exists) return done();
      createTable();
    })
    .catch(done);

  function createTable() {
    $.logger.info('create table tokens...');
    mysql.schema.createTable('tokens', t => {

      t.charset('utf8');

      t.string('token', 255);
      t.string('type', 10);
      t.dateTime('created_at').defaultTo(mysql.fn.now());
      t.dateTime('expire_at').defaultTo(mysql.fn.now());

      t.primary('token');

    }).then(_ => done()).catch(done);
  }

};