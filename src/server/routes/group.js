/**
 * routes
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';

export default function (done) {

  const router = $.data('express.routerWrap');


  router.get('/api/groups', async function (req, res, next) {

    let groups = await $.method('group.list').call({enable: true});
    groups = groups.map(v => {
      return {name: v.name};
    });

    res.apiSuccess({count: groups.length, groups});

  });


  done();

};
