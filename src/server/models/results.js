/**
 * models
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function (done) {

  const mysql = $.data('db.mysql');

  mysql.schema.hasTable('results')
    .then(exists => {
      if (exists) return done();
      createTable();
    })
    .catch(done);

  function createTable() {
    $.logger.info('create table results...');
    mysql.schema.createTable('results', t => {

      t.charset('utf8');

      t.string('package', 255);
      t.string('version', 255);
      t.string('group', 255);
      t.dateTime('started_at').defaultTo(mysql.fn.now());
      t.dateTime('stopped_at');
      t.text('data');

      t.index('package');
      t.index('version');
      t.index('group');

    }).then(_ => done()).catch(done);
  }

};