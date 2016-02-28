/**
 * methods
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function (done) {

  const mysql = $.data('db.mysql');

  // enable
  $.method('group.list').register(async function (params, callback) {

    const query = mysql.table('groups');
    if ('enable' in params) query.andWhere({is_enable: params.enable ? 1 : 0});

    const list = await query.select('*');

    callback(null, list);

  });

  done();

};