/**
 * models
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function (done) {

  const mysql = $.data('db.mysql');

  mysql.schema.hasTable('groups')
    .then(exists => {
      if (exists) return done();
      createTable();
    })
    .catch(done);

  function createTable() {
    $.logger.info('create table groups...');
    mysql.schema.createTable('groups', t => {

      t.charset('utf8');

      t.string('name', 255);
      t.boolean('is_enable').defaultTo(false);
      t.text('env', true);

      t.primary('name');

    }).then(_ => {
      $.logger.info('insert default data to groups...');
      return mysql.table('groups').insert({
        name: 'default',
        is_enable: 1,
        env: '{}',
      });
    }).then(_ => done()).catch(done);
  }

};