/**
 * Created by vegan on 2017/2/25.
 * 上传文件路由
 */

module.exports = function (app) {
    /* GET home page. */
    app.get('/upload', function(req, res, next) {
        // res.render('index', { title: 'Express' });
        res.end();
    });
};