/**
 * Created by vegan on 2017/2/25.
 * 主页路由
 */

module.exports = function (app) {
    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
};