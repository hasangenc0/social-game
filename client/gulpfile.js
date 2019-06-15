const gulp = require('gulp');
const exec = require('child_process').exec;
const webpack_stream = require('webpack-stream')

function buildWasm(done) {
  exec('sh build.sh', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
  done();
}

// Watch Wasm
gulp.task('watch-wasm', () => {
  console.log("Watching files..");
  gulp.watch(['src/shapes/*.cpp'], buildWasm);
});

// Webpack Development
gulp.task('webpack', (done) => {
  process.env.NODE_ENV = 'development';
  const webpack_config = require('./webpack.config.js');
  webpack_stream(webpack_config);
  done();
});

const watch = gulp.parallel('watch-wasm', 'webpack');

exports.wasm = buildWasm;
exports.watch = watch;