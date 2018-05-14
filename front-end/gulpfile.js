var gulp = require('gulp');

gulp.task('bundle', function(){
	var fs = require("fs")
var browserify = require('browserify')
//var vueify = require('vueify')

return browserify('./bundlee.js')
 //.transform(vueify)
  .bundle()
  .pipe(fs.createWriteStream("bundle.js"))
})

gulp.task('watch', function(){
	gulp.watch('bundlee.js', ['bundle']);
	gulp.watch('**/*.vue', ['bundle']);
})

