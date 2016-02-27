/**
 * methods
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';
import rd from 'rd';

export default function (done) {

  $.logger.info('initing methods...');


  const defaultParams = [
    {field: '$offset', default: 0, test: (v) => !isNaN(v), format: (v) => Number(v)},
    {field: '$limit', default: 50, test: (v) => !isNaN(v), format: (v) => Number(v)},
    {field: '$order', default: ['id', 'asc'], test: (v) => Array.isArray(v)},
  ];
  function defaultQueryListParams(params, callback) {
    for (const item of defaultParams) {
      if (item.test(params[item.field])) {
        params[item.field] = item.format ? item.format(params[item.field]) : params[item.field];
      } else {
        params[item.field] = item.default;
      }
    }
    callback(null, params);
  }
  $.method('*.list').before(defaultQueryListParams);
  $.method('*.list.*').before(defaultQueryListParams);


  function loadMethods(file) {
    $.logger.info('load method file %s', file);
    return new Promise((resolve, reject) => {
      require(file).default(err => {
        err ? reject(err) : resolve();
      });
    });
  }

  const files = rd.readFileFilterSync(path.resolve(__dirname, '../methods'), /\.js$/);
  $.logger.info('found %s methods', files.length);
  (async function () {
    try {
      for (const file of files) {
        await loadMethods(file);
      }
    } catch (err) {
      return done(err);
    }
    done();
  })();

};