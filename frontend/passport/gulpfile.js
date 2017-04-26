/**
 * Author: dongwenzhao/kingdee
 * Date: 16/10/20
 * Time: 上午9:29
 *
 *
 * The build process consists of following steps:
 * 1. clean /passport folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 *
 */
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    runSequence = require('run-sequence'),
    spritesmith = require('gulp.spritesmith'),
    modRewrite  = require('connect-modrewrite'),
    zip = require('gulp-zip');

//将项目包压缩成zip包
gulp.task('dist-zip', function() {
    return gulp.src('./passport/**/*')
        .pipe(zip('./passport.zip')).pipe(gulp.dest('./'));
});

// 优化图片
gulp.task('images', function() {
    return gulp.src('./images/**/*')
        .pipe($.changed('./passport/images'))
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./passport/images'));
});

// browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
    browserSync.init({
        startPath: '/',
        port: 4000,
        server: {
            baseDir: './',
            middleware: [
                modRewrite([
                    '!\\.\\w+$ /index.html [L]'
                ])
            ]
        }
    });
});

// minify JS
// gulp.task('minify-js', function() {
//     gulp.src('./js/**/*.js')
//         .pipe(gulp.dest('./passport/js'))
// });

//压缩js
gulp.task('minify-js', function() {
    return gulp.src(['./js/**/*.js', '!./js/common/**/*', '!./js/lib/**/*', '!./js/jquery/**/*'])
        .pipe($.uglify())
        .pipe(gulp.dest('./passport/js'))
});

// 压缩css
gulp.task('minify-css', function() {
    gulp.src(['./styles/**/*.css', '!./styles/**/*.min.css'])
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.minifyCss({
            keepBreaks: true
        }))
        .pipe(rev())
        .pipe(gulp.dest('./passport/styles'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist/css'));
});


// copy所有bower_companents 下的文件
gulp.task('bower', function() {
    return gulp.src(['./bower_components/**/*'])
        .pipe(gulp.dest('passport/bower_components'));
});



// copy fonts from a module outside of our project (like Bower)
// gulp.task('fonts', function() {
//     gulp.src('./fonts/**/*.{ttf,woff,eof,eot,svg}')
//         .pipe($.changed('./passport/fonts'))
//         .pipe(gulp.dest('./passport/fonts'));
// });

// start webserver
gulp.task('server', function(done) {
    return browserSync({
        server: {
            baseDir: './'
        }
    }, done);
});

// start webserver from passport folder to check how it will look in production
gulp.task('server-build', function(done) {
    return browserSync({
        server: {
            baseDir: './passport/'
        }
    }, done);
});

// 删除构建文件夹
gulp.task('clean:build', function(cb) {
    del([
        './passport/',
        './dist',
        './_build',
        'passport.zip'
    ], cb);
});

// concat files
gulp.task('concat', function() {
    gulp.src('./js/*.js')
        .pipe($.concat('scripts.js'))
        .pipe(rev())
        .pipe(gulp.dest('./passport/'));
});

// SASS task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function() {
    return gulp.src('styles/app.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            style: 'expanded'
        }))
        .on('error', $.notify.onError({
            title: 'SASS 编译失败',
            message: $.sass.onError
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('styles'))
        .pipe(reload({
            stream: true
        }))
        .pipe($.notify({
            message: '样式文件编译成功！'
        }));
});

// SASS Build task
gulp.task('sass:build', function() {
    var s = $.size();

    return gulp.src('styles/app.scss')
        .pipe($.sass({
            style: 'compact'
        }))
        .pipe($.autoprefixer('last 3 version'))
        .pipe($.uncss({
            html: ['./index.html', './views/**/*.html', './components/**/*.html'],
            ignore: [
                '.index',
                '.slick',
                /\.owl+/,
                /\.owl-next/,
                /\.owl-prev/
            ]
        }))
        .pipe($.minifyCss({
            keepBreaks: true,
            aggressiveMerging: false,
            advanced: false
        }))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(rev())
        .pipe(gulp.dest('passport/css'))
        .pipe(s)
        .pipe($.notify({
            onLast: true,
            message: function() {
                return 'Total CSS size ' + s.prettySize;
            }
        }));
});


// BUGFIX: warning: possible EventEmitter memory leak detected. 11 listeners added.
require('events').EventEmitter.prototype._maxListeners = 100;

// index.html build
gulp.task('login', function() {
    var date = new Date().getTime();
    var temp = 'js/templates.js?v=' + date + '';
    return gulp.src([ './index.html'])
        .pipe($.htmlReplace({
            'templates': temp
        }))
        .pipe($.usemin({
            css: [$.minifyCss(), $.rev()],
            csses: [$.minifyCss(), $.rev()],
            cssTop: [$.minifyCss(), $.rev()],
            cssZw: [$.minifyCss(), $.rev()],
            libs: [$.uglify(), $.rev()],
            nonangularlibs: [$.uglify(), $.rev()],
            angularlibs: [$.uglify(), $.rev()],
            appcomponents: [$.uglify(), $.rev()],
            mainapp: [$.uglify(), $.rev()],
            app: [$.uglify(), $.rev()]

        }))
        .pipe(gulp.dest('./passport/'));
});



// minify HTML
gulp.task('minify-html', function() {
    var opts = {
        comments: true, //不删除注释
        spare: true, //不删除多余属性
        conditionals: true, //不删除浏览器注释
        quotes: true // 不删除多余引号
    };
    return gulp.src(['./passport/*.html'])
        .pipe($.minifyHtml(opts))
        .pipe(gulp.dest('./passport/'));
});

// make templateCache from all HTML files
gulp.task('templates', function() {
    return gulp.src([
            './**/*.html',
            '!bower_components/**/*.*',
            '!node_modules/**/*.*',
            '!passport/**/*.*'
        ])
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.angularTemplatecache({
            module: 'MainApp'
        }))
        .pipe(gulp.dest('passport/js'));
});

// reload all Browsers
gulp.task('bs-reload', function() {
    browserSync.reload();
});
//打包特殊文件
gulp.task('SpecialFile', function() {
    gulp.src('./js/common/**/*')
        .pipe(gulp.dest('passport/js/common/'));
    gulp.src('./js/lib/**/*')
        .pipe(gulp.dest('passport/js/lib/'));
    gulp.src('./js/jquery/**/*')
        .pipe(gulp.dest('passport/js/jquery/'));
    gulp.src('./bower_components/select2/*.png')
        .pipe(gulp.dest('passport/styles/'));
    gulp.src('./js/common/zTree/V3/css/zTreeStyle/img/**/*')
        .pipe(gulp.dest('passport/styles/img/'));
    gulp.src('./template/**/*')
        .pipe(gulp.dest('passport/template/'));
    gulp.src('./js/services/**/*.json')
        .pipe(gulp.dest('passport/js/services/'));
    gulp.src('./js/appReport/**/*.json')
        .pipe(gulp.dest('passport/js/appReport/'));
    gulp.src('./js/appReadMeter/json/**/*.json')
        .pipe(gulp.dest('passport/js/appReadMeter/json/'));
    gulp.src('./tpl_gassafe.html')
        .pipe(gulp.dest('passport/'));
     gulp.src('./fonts/**/*')
        .pipe(gulp.dest('passport/fonts/'));

});
// calculate build folder size
gulp.task('build:size', function() {
    var s = $.size();
    return gulp.src('./passport/*.*')
        .pipe(s)
        .pipe($.notify({
            onLast: true,
            message: function() {
                return 'Total build size ' + s.prettySize;
            }
        }));
});


// default task to be run with `gulp` command
// this default task will run BrowserSync & then use Gulp to watch files.
// when a file is changed, an event is emitted to BrowserSync with the filepath.
gulp.task('default', ['browser-sync', 'sass'], function() {
    gulp.watch('styles/*.css', function(file) {
        if (file.type === "changed") {
            reload(file.path);
        }
    });
    gulp.watch(['*.html', 'views/**/*.html'], ['bs-reload']);
    gulp.watch(['js/**/*.js', 'js/**/*.json'], ['bs-reload']);
    gulp.watch('styles/**/*.css', ['bs-reload']);
    gulp.watch('styles/**/*.scss', ['sass']);
});


// css sprite
var configs = {
    //修改图片位置
    spritesSource: './images/sprites/**/*',
    spritesMithConfig: {
        // cssOpts: 'spriteSrc', //变量名称
        imgName: '../images/sprites/sprite.png', //图片名称
        cssName: 'sprite.scss',
        cssFormat: 'scss', //生成scss文件名称
        algorithm: 'binary-tree',
        // cssTemplate: 'scss.template.mustache', //cssTemplate 参数来自定义模板 { {} }是输出,#符号是循环，../的意思是返回上一层的作用域链
        padding: 5,
        cssVarMap: function(sprite) {
            sprite.name = 'icon-' + sprite.name
        }
    },
    spritesOutputPath: './sprites/',
    spritesCssOutputPath: './styles/sprites/'
}

gulp.task('sprite', function(callback) {
    runSequence(
        'sprite:build',
        'images',
        callback
    )
});
//创建图片精灵
gulp.task('sprite:build', function() {
    var spriteData = gulp.src(configs.spritesSource)
        .pipe(spritesmith(
            configs.spritesMithConfig
        ));
    spriteData.img.pipe(gulp.dest(configs.spritesOutputPath)); // output path for the sprite
    spriteData.css.pipe(gulp.dest(configs.spritesCssOutputPath)); // output path for the CSS
});
/**
 * 添加 各种环境下的API 地址
 */
gulp.task('dev', function() {
    gulp.src('./appSetting.js')
        .pipe($.preprocess({ context: { NODE_ENV: 'DEVELOPMENT', DEBUG: true } }))
        .pipe(gulp.dest('./js/common/'));
});

gulp.task('test', function() {
    gulp.src('./appSetting.js')
        .pipe($.preprocess({ context: { NODE_ENV: 'TEST', DEBUG: true } }))
        .pipe(gulp.dest('./js/common/'));
});

gulp.task('demo', function() {
    gulp.src('./appSetting.js')
        .pipe($.preprocess({ context: { NODE_ENV: 'DEMO', DEBUG: true } }))
        .pipe(gulp.dest('./js/common/'));
});

gulp.task('prod', function() {
    gulp.src('./appSetting.js')
        .pipe($.preprocess({ context: { NODE_ENV: 'PRODUCTION' } }))
        .pipe(gulp.dest('./js/common/'));
});

gulp.task('prod-aliyun', function() {
    gulp.src('./appSetting.js')
        .pipe($.preprocess({ context: { NODE_ENV: 'PRODUCTION-ALIYUN' } }))
        .pipe(gulp.dest('./js/common/'));
});
/**
 * build task:
 * 1. clean /passport folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 *
 */
// 测试打包
gulp.task('build-test', function(cb) {
    runSequence(
        'clean:build',
        'bower',
        'images',
        'test',
        'templates',
        'minify-css',
        'login',
        'SpecialFile',
        'minify-js',
        'minify-html',
        'dist-zip',
        cb);
});
// 测试打包
gulp.task('build-demo', function(cb) {
    runSequence(
        'clean:build',
        'bower',
        'images',
        'demo',
        'templates',
        'minify-css',
        'login',
        'SpecialFile',
        'minify-js',
        'minify-html',
        'dist-zip',
        cb);
});
//正式环境打包
gulp.task('build-pro', function(cb) {
    runSequence(
        'clean:build',
        'bower',
        'images',
        'prod',
        'templates',
        'minify-css',
        'login',
        'SpecialFile',
        'minify-js',
        'minify-html',
        'dist-zip',
        cb);
});

//阿里云环境打包
gulp.task('build-aliyun', function(cb) {
    runSequence(
        'clean:build',
        'bower',
        'images',
        'prod-aliyun',
        'templates',
        'minify-css',
        'login',
        'SpecialFile',
        'minify-js',
        'minify-html',
        'dist-zip',
        cb);
});
