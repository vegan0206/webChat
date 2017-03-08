/**
 * Created by vegan on 2017/2/25.
 * 测试路由
 */

module.exports = function (app) {
  /* GET test page. */
    app.get('/test', function(req, res, next) {
        res.render('test', { title: 'Express' });
    });

};
