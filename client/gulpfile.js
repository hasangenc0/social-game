const gulp = require('gulp');
const exec = require('child_process').exec;
const webpack_stream = require('webpack-stream')

// Run build script
function buildWasm() {
  exec('sh build.sh', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
}

// Watch files
function watchFiles() {
  console.log("Watching files..");
  gulp.watch(['src/shapes/*.cpp'], buildWasm);
}

// Webpack Development
gulp.task('webpack' ,() => {
  process.env.NODE_ENV = 'development';
  const webpack_config = require('./webpack.config.js');
  return webpack_stream(webpack_config);
});

const watch = gulp.parallel(watchFiles, 'webpack');

exports.watch = watch;