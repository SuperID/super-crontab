/**
 * express
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';
import rd from 'rd';
import {Namespace} from 'lei-ns';
import express from 'express';
import serveStatic from 'serve-static';
import bodyParser from 'body-parser';
import multiparty from 'connect-multiparty';
import connect from 'connect';

export default async function (done) {

  $.logger.info('initing express...');

  const PROJECT_WEB_DIR = path.resolve(__dirname, '../../web');

  const app = express();
  $.data.set('express.app', app);

  const router = express.Router();
  $.data.set('express.router', router);

  const body = connect();
  body.use(multiparty());
  body.use(bodyParser.urlencoded({extended: false}));
  body.use(bodyParser.json());
  $.data.set('express.body');
  router.use(body);

  const ASSETS_DIR = path.resolve(PROJECT_WEB_DIR, 'assets');
  $.data.set('express.dir.assets', ASSETS_DIR);
  $.logger.info('web assets on path %s', ASSETS_DIR)
  app.use('/assets', serveStatic(ASSETS_DIR));

  const BUNDLE_DIR = path.resolve(PROJECT_WEB_DIR, 'bundles');
  $.data.set('express.dir.bundles', BUNDLE_DIR);
  $.logger.info('web bundles on path %s', BUNDLE_DIR)
  app.use('/bundles', serveStatic(BUNDLE_DIR));

  const PAGES_DIR = path.resolve(PROJECT_WEB_DIR, 'pages');
  $.data.set('express.dir.pages', PAGES_DIR);
  $.logger.info('web pages on path %s', PAGES_DIR)
  app.use('/pages', serveStatic(PAGES_DIR));

  //----------------------------------------------------------------------------

  $.data.set('middleware.login', function (req, res, next) {
    if (req.session.user && req.session.user.id) {
      req.data.set('user', req.session.user);
      if (req.params.company_id) {
        $.method('company.get').call({id: req.params.company_id})
          .then(company => {
            if (company && company.owner_id === req.session.user.id) {
              req.data.set('company', company);
              next();
            } else {
              next(new $.utils.PermissionDeniedError(`don't allowed to access company`));
            }
          })
          .catch(next);
      } else {
        next();
      }
    } else {
      next(new $.utils.UserNotLoginError());
    }
  });

  router.use(function (req, res, next) {
    req.data = new Namespace();
    res.apiSuccess = function (data) {
      res.json({result: data});
    };
    res.apiError = function (err) {
      if (err instanceof Error) {
        res.json({
          error: err.message,
          code: err.code,
        });
      } else {
        res.json({error: err});
      }
    };
    if (typeof req.query.$fields === 'string') {
      req.query.$fields = req.query.$fields.split(',').map(v => v.trim()).filter(v => v);
    }
    if (typeof req.query.$order === 'string') {
      req.query.$order = req.query.$order.split(',').map(v => v.trim()).filter(v => v);
    }
    if (typeof req.query.$join === 'string') {
      req.query.$join = req.query.$join.split(',').map(v => v.trim()).filter(v => v);
    }
    next();
  });

  app.use(router);

  app.use('/api', function (err, req, res, next) {
    res.apiError(err);
  });

  //----------------------------------------------------------------------------

  const routerWrap = {};
  ['get', 'head', 'post', 'put', 'del'].forEach(method => {
    routerWrap[method] = function (path, ...args) {
      const wrapArgs = args.map(fn => {
        return function (req, res, next) {
          try {
            const r = fn(req, res, next);
            if (r instanceof Promise) {
              r.catch(next);
            }
          } catch (err) {
            return next(err);
          }
        };
      });
      router[method].call(router, path, ...wrapArgs);
    };
  });
  $.data.set('express.routerWrap', routerWrap);

  function loadRoutes(file) {
    $.logger.info('load routes file %s', file);
    return new Promise((resolve, reject) => {
      require(file).default(err => {
        err ? reject(err) : resolve();
      });
    });
  }

  const files = rd.readFileFilterSync(path.resolve(__dirname, '../routes'), /\.js$/);
  $.logger.info('found %s routes', files.length);
  try {
    for (const file of files) {
      await loadRoutes(file);
    }
  } catch (err) {
    return done(err);
  }

  //----------------------------------------------------------------------------

  if ($.config.has('web.port') && $.config.get('web.port') > 0) {
    $.logger.info('listen on port %s...', $.config.get('web.port'));
    app.listen($.config.get('web.port'), done);
  } else {
    $.logger.info('no listen port has been set');
    done();
  }

};