//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    sass = require('gulp-sass'),  //本地安装gulp-sass
    concat = require('gulp-concat'), // 合并文件
    uglify = require('gulp-uglify'),//本地安装gulp-uglify压缩js文件
    cssmin = require('gulp-minify-css'),//本地安装gulp-minify-css压缩css文件
    htmlmin = require('gulp-minify-html'), //本地安装gulp-htmlmin压缩html文件
    imagemin = require('gulp-imagemin'),//压缩图片
    rev = require('gulp-rev'), //添加版本号
    rename = require('gulp-rename'), //添加重命名文件
    autoprefixer = require('gulp-autoprefixer'), //设置浏览器版本自动处理浏览器前缀
    livereload = require('gulp-livereload'),  //当监听文件发生变化时，浏览器自动刷新页面
    watch = require('gulp-watch'), //监听
    webserver = require('gulp-webserver'); //本地服务器
	
	
	
//定义一个testSass任务（自定义任务名称）
gulp.task('wdSass', function () {
    gulp.src('src/scss/*.scss') //该任务针对的文件
        .pipe(sass()) //该任务调用的模块
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/css')) //将会在src/css下生成index.css
});

//定义一个js压缩任务
gulp.task('jsmin', function () {
	//压缩src/js目录下的所有js文件，除了test1.js和test2.js（**匹配src/js的0个或多个子文件夹）
    //gulp.src(['src/js/*.js', '!src/js/**/{test1,test2}.js']) 
    gulp.src('src/js/*.js') //多个文件以数组形式传入
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js')); //将会在dist/js下生成index.min.js ,details.min.js
});

//定义一个css压缩任务
gulp.task('wdCssmin', function () {
    gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

//定义一个html压缩任务
gulp.task('wdHtmlmin', function () {
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
gulp.task('wdImagemin', function () {
    gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

//处理浏览器前缀
gulp.task('wdAutoFx', function () {
    gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task("webserver",function(){
	gulp.src("./src") //服务器目录（.代表根目录）
	.pipe(webserver({  //运行gulp-webserver
		host: '192.168.1.116', //地址，可不写，不写的话，默认localhost
        port: '8000', //端口号，可不写，默认8000
		livereload:true,  //启动LiveReload
		open:true   //服务器启动时自动打开网页
	}))
})
gulp.task('watch', function() {
    gulp.watch('src/scss/*.scss', ['wdSass']); //监控css文件
    gulp.watch('src/js/*.js', ['jsmin']); //监控js文件
    gulp.watch(['src/*.html'], ['wdHtmlmin']); //监控html文件
}); //执行gulp server开启服务器


gulp.task('default',['wdSass','jsmin','wdCssmin','wdHtmlmin','wdImagemin','wdAutoFx','webserver','watch']); //定义默认任务
