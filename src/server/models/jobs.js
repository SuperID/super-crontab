/**
 * models
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function (done) {

  const mysql = $.data('db.mysql');

  mysql.schema.hasTable('jobs')
    .then(exists => {
      if (exists) return done();
      createTable();
    })
    .catch(done);

  function createTable() {
    $.logger.info('create table jobs...');
    mysql.schema.createTable('jobs', t => {

      t.charset('utf8');

      t.string('package', 255);
      t.string('version', 255);
      t.string('group', 255);
      t.string('rule', 255);
      t.text('status');
      t.dateTime('created_at').defaultTo(mysql.fn.now());

      t.primary(['package', 'version', 'group', 'rule']);

    }).then(_ => done()).catch(done);
  }

};