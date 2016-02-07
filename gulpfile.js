var gulp = require('gulp'),
    Q = require('q'),
    spritesmith = require('gulp.spritesmith'),
    livereload = require('gulp-livereload'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sprite', spriteTask);
gulp.task('less', lessTask);
gulp.task('less-sprite', ['sprite'], lessTask);
gulp.task('assets', ['less-sprite']);
gulp.task('watch', ['assets'], watchTask);

function spriteTask() {
    var defImg = Q.defer(),
        defCss = Q.defer();

    var spriteData = gulp.src('src/sprite-source/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.less'
        }));

    spriteData.img
        .pipe(gulp.dest('src/images/sprite'))
        .pipe(livereload())
        .on('end', defImg.resolve);

    spriteData.css
        .pipe(gulp.dest('src/images/sprite'))
        .on('end', defCss.resolve);

    return Q.all([defImg.promise, defCss.promise]);
}

function lessTask(done) {
    return gulp.src('src/less/*.less', { base: '.' })
        .pipe(less({
            relativeUrls: true,
            pretty: true
        }))
        .on('error', done)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .on('error', done)
        .pipe(gulp.dest('.'))
        .pipe(livereload());
}

function watchTask() {
    var lessPaths = [
            'src/less/*.less',
            'src/less/components/**/*.less',
            'src/images/sprite/*.less'
        ],
        spritePaths = [
            'src/sprite-source/*.png'
        ];

    livereload.listen({
        basePath: 'src'
    });

    gulp
        .watch(lessPaths, ['less'])
        .on('change', printEvent);

    gulp
        .watch(spritePaths, ['sprite'])
        .on('change', printEvent);
}

function printEvent(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}