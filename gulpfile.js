/**
 * Created by vegan on 2017/2/24.
 */
var gulp = require("gulp");
var uglify = require('gulp-uglify');//js压缩
var minifycss = require("gulp-minify-css");//css压缩
var concat = require('gulp-concat');
var changed = require("gulp-changed");
var autoprefixer = require("gulp-autoprefixer"); //自动浏览器前缀
var browserSync = require('browser-sync').create(); //- 浏览器同步
var nodemon = require('gulp-nodemon');

//js任务
gulp.task("js-task", function() {
    gulp.src(["public/src/javascripts/*.js","public/src/javascripts/**/*.js"])
        .pipe(changed("public/build/javascripts",{extension:'.js'}))
        .pipe(uglify()) //压缩js
        // .pipe(rev())
        .pipe(gulp.dest("public/build/javascripts"))
        .pipe(browserSync.stream());
});
//css任务
gulp.task("css-task", function() {
    gulp.src(["public/src/stylesheets/*.css","public/src/stylesheets/**/*.css"])
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
        }))
        .pipe(changed("public/build/stylesheets",{extension:'.css'}))
        .pipe(minifycss())//压缩css
        // .pipe(rev())
        .pipe(gulp.dest("public/build/stylesheets"))
        .pipe(browserSync.stream());
});

// browserSync
// 创建一个任务确保JS任务完成之前能够继续响应
// 浏览器重载
gulp.task("browserSync", ["css-task","js-task"], browserSync.reload);

gulp.task("browserSync-serve", ["css-task","js-task"], function () {
    nodemon({
        script: './bin/www',
        ignore: ['.idea', 'node_modules'],
        env: {
            'NODE_ENV': 'development'
        }
    });
    // 从这个项目的根目录启动服务器
    browserSync.init({
        proxy: 'http://localhost:3000', //- 代理网址
        notify: true,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        },
        open: false,
        host: "192.168.1.101",
        port: 5000
    });

    // 添加 browserSync.reload 到任务队列里
    // 所有的浏览器重载后任务完成。
    gulp.watch(["public/src/stylesheets/*.css","public/src/stylesheets/**/*.css"],["css-task"]);
    gulp.watch(["public/src/javascripts/*.js","public/src/javascripts/**/*.js"],["js-task"]);
    gulp.watch(["views/**/*.jade"]).on("change", browserSync.reload);
});

//默认任务
//-
gulp.task("default", ["css-task", "js-task","browserSync-serve","browserSync"], function() {
    //监听css变化
    gulp.watch(["public/src/stylesheets/*.css","public/src/stylesheets/**/*.css"], ["css-task"]);
    //js
    gulp.watch(["public/src/javascripts/*.js","public/src/javascripts/**/*.js"], ["js-task"]);
});