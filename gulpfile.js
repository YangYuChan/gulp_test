//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    sass = require('gulp-sass'),  //本地安装gulp-sass
    concat = require('gulp-concat'), // 合并文件
    uglify = require('gulp-uglify'),//本地安装gulp-uglify压缩js文件
    cssmin = require('gulp-minify-css'),//本地安装gulp-minify-css压缩css文件
    htmlmin = require('gulp-htmlmin'), //本地安装gulp-htmlmin压缩html文件
    imagemin = require('gulp-imagemin'),//压缩图片
    rev = require('gulp-rev-append'), //添加版本号
    autoprefixer = require('gulp-autoprefixer'), //设置浏览器版本自动处理浏览器前缀
    livereload = require('gulp-livereload'),  //当监听文件发生变化时，浏览器自动刷新页面
	connect = require('gulp-connect');//使用connect启动一个Web服务器
	
	
	
//定义一个testSass任务（自定义任务名称）
gulp.task('testSass', function () {
    gulp.src('src/scss/style.less') //该任务针对的文件
        .pipe(sass()) //该任务调用的模块
        .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
});

//合并文件
gulp.task('testConcat', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js'));
});

//定义一个js压缩任务
gulp.task('jsmin', function () {
	//压缩src/js目录下的所有js文件，除了test1.js和test2.js（**匹配src/js的0个或多个子文件夹）
    //gulp.src(['src/js/*.js', '!src/js/**/{test1,test2}.js']) 
    gulp.src(['src/js/index.js','src/js/detail.js']) //多个文件以数组形式传入
        
        //.pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
           // mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
       // }))

       //.pipe(uglify({
         //   mangle: true,//类型：Boolean 默认：true 是否修改变量名
         //   compress: true,//类型：Boolean 默认：true 是否完全压缩
         //   preserveComments: 'all' //保留所有注释
        //}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js')); //将会在dist/js下生成index.min.js ,details.min.js
});

//定义一个css压缩任务
gulp.task('testCssmin', function () {
    gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
        //.pipe(cssmin({
        //    advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        //    compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        //    keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
        //    keepSpecialComments: '*'
        //    保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        //}))
});

//定义一个html压缩任务
gulp.task('testHtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});

//定义一个图片压缩任务
gulp.task('testImagemin', function () {
    gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

//定义一个添加版本号任务
gulp.task('testRev', function () {
    gulp.src('src/index.html')
        .pipe(rev())
        .pipe(gulp.dest('dist/html'));
});
//处理浏览器前缀
gulp.task('testAutoFx', function () {
    gulp.src('src/css/index.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('connect', function() {
    connect.server({
        host: '192.168.1.172', //地址，可不写，不写的话，默认localhost
        port: 3000, //端口号，可不写，默认8000
        root: './', //当前项目主目录
        livereload: true //自动刷新
    });
});
gulp.task('html', function() {
    gulp.src('./*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('./css/*.css', ['html']); //监控css文件
    gulp.watch('./js/*.js', ['html']); //监控js文件
    gulp.watch(['./*.html'], ['html']); //监控html文件
}); //执行gulp server开启服务器

gulp.task('default',['connect','html','testSass','testConcat','jsmin','testCssmin','testHtmlmin','testImagemin','testRev','testAutoFx','watch']); //定义默认任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径