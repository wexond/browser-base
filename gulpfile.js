'use strict'

let gulp = require('gulp')
let electron = require('electron-connect').server.create()

gulp.task('default', function () {
  electron.start(['main.js', 'dev'])
  gulp.watch('main.js', electron.restart)
  gulp.watch(['./src/**/*.js', './src/**/*.css', './src/**/*.html'], electron.reload)
})