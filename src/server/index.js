/**
 * super-crontab
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';
import ProjectCore from 'project-core';
import tracer from 'tracer';
import knex from 'knex';


global.$ = new ProjectCore();


// 扩展日志记录
$.extends({
  init: done => {
    $.logger = tracer.colorConsole({
      dateformat: 'yyyy-mm-dd HH:MM:ss.L',
      format: '{{timestamp}} <{{title}}> {{message}}',
    });
    done();
  }
});

// 加载配置文件
$.init.add(next => {
  $.config.load(path.resolve(__dirname, 'config.js'));
  if (process.env.CONFIG_FILE) {
    const file = process.env.CONFIG_FILE;
    $.logger.info(`loading config file: ${file}`);
    $.config.load(file);
  }
  next();
});

// 扩展utils
$.init.load(path.resolve(__dirname, './init/utils.js'));

// 加载models
$.init.add(next => {
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
  next();
});
$.init.load(path.resolve(__dirname, './models'));

// 加载methods
$.init.load(path.resolve(__dirname, './methods'));

// 加载Express
$.init.load(path.resolve(__dirname, './init/express.js'));

$.init(err => {
  if (err) {
    console.error(err.stack || err);
    process.exit(-1);
  }
  $.logger.info('server started');
});

// 捕捉出错信息
$.event.on('error', err => {
  $.logger.error(err.stack || err);
  process.exit();
});

$.ready(() => {
  $.logger.info('server ready');
});
