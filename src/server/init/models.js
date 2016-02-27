/**
 * models
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';
import knex from 'knex';
import rd from 'rd';

export default function (done) {

  $.logger.info('initing models...');
  const mysql = knex({
    client: 'mysql',
    connection: $.config.get('db.mysql.connection'),
    pool: {
      min: $.config.get('db.mysql.pool.min'),
      max: $.config.get('db.mysql.pool.max'),
    },
  });
  $.data.set('db.mysql', mysql);

  function loadModel(file) {
    $.logger.info('load model file %s', file);
    return new Promise((resolve, reject) => {
      require(file).default(err => {
        err ? reject(err) : resolve();
      });
    });
  }

  const files = rd.readFileFilterSync(path.resolve(__dirname, '../models'), /\.js$/);
  $.logger.info('found %s models', files.length);
  (async function () {
    try {
      for (const file of files) {
        await loadModel(file);
      }
    } catch (err) {
      return done(err);
    }
    done();
  })();

};