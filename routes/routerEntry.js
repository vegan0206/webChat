/**
 * Created by vegan on 2017/2/25.
 * 路由入口
 */
var test = require(rootPath + "/routes/test");
var index = require(rootPath + "/routes/index");
var upload = require(rootPath + "/routes/upload");

module.exports = function (app) {
    //- 测试页面
    test(app);
    //- 主页
    index(app);
    //- 上传文件
    upload(app);
};