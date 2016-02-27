/**
 * models
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function (done) {

  const mysql = $.data('db.mysql');

  mysql.schema.hasTable('packages')
    .then(exists => {
      if (exists) return done();
      createTable();
    })
    .catch(done);

  function createTable() {
    $.logger.info('create table packages...');
    mysql.schema.createTable('packages', t => {

      t.charset('utf8');

      t.string('name', 255);
      t.string('version', 255);
      t.dateTime('published_at').defaultTo(mysql.fn.now());
      t.text('info');
      t.string('file_hash', 255);
      t.string('file_path', 255);

      t.primary(['name', 'version']);
      t.index('published_at');

    }).then(_ => done()).catch(done);
  }

};