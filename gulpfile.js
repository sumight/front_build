var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var through2 = require("through2");
var jsHint = require("gulp-jshint");
var glob = require('glob');
var dot = require('dot');
var transform = require('vinyl-transform');
var stylish = require('jshint-stylish');
var del = require('del');
var fs = require('fs');
var jsbeautify = require("js-beautify").js_beautify;
var less = require('gulp-less');
var minifycss = require("gulp-minify-css");
var spriter = require("gulp-css-spriter");
var browserSync = require('browser-sync').create();
var fileinclude = require('gulp-file-include');
var reload = browserSync.reload;

// 开启预览服务器
gulp.task('server', ['watch'], function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        browser: "google chrome"
    });
});

// 图片打包
gulp.task("imgpack:dev", function() {
    gulp.src(['./src/images/**/*.@(png|jpg|gif)'])
        .pipe(gulp.dest('./dist/images'))
        .pipe(reload({
            stream: true
        }));
})
gulp.task("imgpack:pub", function() {
    gulp.src(['./src/images/**/*.@(png|jpg|gif)'])
        .pipe(gulp.dest('./public/images'));
})

// less编译
gulp.task('lesspack:dev', function() {
    gulp.src(['./src/less/*.less'])
        .pipe(less())
        .pipe(spriter({
            'spriteSheet': './dist/images/spritesheet.png',
            'pathToSpriteSheetFromCSS': '../images/spritesheet.png',
            'includeMode': 'explicit'
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({
            stream: true
        }));
    gulp.src(['./src/less/*.css'])
        .pipe(spriter({
            'spriteSheet': './dist/images/spritesheet.png',
            'pathToSpriteSheetFromCSS': '../images/spritesheet.png',
            'includeMode': 'explicit'
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({
            stream: true
        }));
})
gulp.task('lesspack:pub', function() {
    gulp.src(['./src/less/*.less'])
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest('./public/css'));
    gulp.src(['./src/less/*.css'])
        .pipe(minifycss())
        .pipe(gulp.dest('./public/css'));
})

// js打包
gulp.task("jspack:dev", ['dotpre'], function() {
    // success
    return gulp.src('./src/js/*.js')
        .pipe(through2.obj(function(file, enc, next) {
            browserify(file.path, {
                    debug: true
                })
                .bundle(function(err, res) {
                    file.contents = res;
                    next(null, file);
                });
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(reload({
            stream: true
        }));
})

gulp.task("jspack:pub", ['dotpre'], function() {
    return gulp.src('./src/js/*.js')
        .pipe(through2.obj(function(file, enc, next) {
            browserify(file.path, {
                    debug: false
                })
                .bundle(function(err, res) {
                    file.contents = res;
                    next(null, file);
                });
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
})


// html打包
gulp.task("htmlpack:dev", function() {
    return gulp.src("./src/*.html")
    .pipe(fileinclude({
        prefix: '@@'
    }))
    .pipe(gulp.dest("./dist"))
    .pipe(reload({
        stream: true
    }))
})

gulp.task("htmlpack:pub", function() {
    return gulp.src("./src/*.html")
    .pipe(fileinclude({
        prefix: '@@'
    }))
    .pipe(gulp.dest("./public"));
})

// 代码规范检查
gulp.task("jshint", function() {
    return gulp.src("./src/js/**/*.js")
        .pipe(jsHint())
        .pipe(jsHint.reporter(stylish));
})

// 编译dot
gulp.task("dotpre", function(cb) {
    var tpls = require("dot").process({
        path: "./src/tpl"
    });
    for (var tmplname in tpls) {
        var tmpl = tpls[tmplname];
        if (!tpls.hasOwnProperty(tmplname)) {
            continue;
        }
        fs.writeFileSync('./src/tpl/' + tmplname + '.js', jsbeautify(('module.exports=' + tmpl.toString()), {
            indent_size: 2
        }));
    }
    cb();

})

// 清理文件
gulp.task("clean:dev", ['jspack:dev', 'htmlpack:dev'], function(cb) {
    del("./src/tpl/*.js");
    cb();
})
gulp.task("clean:pub", ['jspack:pub', 'htmlpack:pub'], function(cb) {
    del("./src/tpl/*.js");
    cb();
})

// 监听文件
gulp.task('watch', ['default'], function() {
    gulp.watch(['./src/js/**/*.js'], ["jspack:dev"]);
    gulp.watch(['./src/less/**/*.@(less|css)'], ["lesspack:dev"]);
    gulp.watch(['./src/images/**/*.@(png|jpg|gif)'], ["imgpack:dev"]);
    gulp.watch(['./src/*.html'], ['htmlpack:dev'])
})

// 发布到开发环境
gulp.task("default", ["jspack:dev", "htmlpack:dev", "clean:dev", "lesspack:dev", "imgpack:dev"]);

// 发布到生产环境
gulp.task("public", ["jspack:pub", "htmlpack:pub", "jshint", "clean:pub", "lesspack:pub", "imgpack:pub"]);
