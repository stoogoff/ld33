var gulp = require("gulp");
var sass = require("gulp-sass");
var rjs = require("gulp-requirejs");
var rename = require("gulp-rename");


// helper functions
var path = {
	src: function(path) {
		return "../src/" + path;
	},
	dest: function(path) {
		return "../dist/" + path;
	},
	root: function(path) {
		return __dirname + path;
	}
};


// main tasks
gulp.task("sass", function() {
	return gulp.src(path.src("/media/css/*.sass")).pipe(sass({ indentedSyntax: true })).pipe(gulp.dest(path.dest("/media/css/")));
});

gulp.task("copy-static", function() {
	["img", "audio", "data"].forEach(function(key) {
		gulp.src(path.src("/media/" + key + "/**")).pipe(gulp.dest(path.dest("/media/" + key + "/")));
	});
});

gulp.task("copy-phaser", function() {
	// copy phaser directly as using requirejs causes problems (probably scope related)
	// also, it's way quicker to copy ~700KB on each build than to run it through requirejs
	gulp.src(path.root("/lib/phaser.min.js")).pipe(rename("phaser.js")).pipe(gulp.dest(path.dest("/media/js/")));
	gulp.src(path.root("/lib/phaser.map")).pipe(gulp.dest(path.dest("/media/js/")));
});

gulp.task("copy-phaser-debug", function() {
	// copy phaser directly as using requirejs causes problems (probably scope related)
	gulp.src(path.root("/lib/phaser.js")).pipe(gulp.dest(path.dest("/media/js/")));
});

gulp.task("copy-root", function() {
	return gulp.src(path.src("/*")).pipe(gulp.dest(path.dest("/")));
});

gulp.task("js", function() {
	return rjs({
		baseUrl: path.src("/media/js"),
		out: "app.js",
		name: "app",
		include: "almond",
		wrap: false,
		insertRequire: ["app"],
		paths: {
			underscore: path.root("/lib/underscore-min"),
			almond: path.root("/lib/almond-0.3.1"),
		},
		shim: {
			underscore: {
				exports: "_"
			}
		}
	}).pipe(gulp.dest(path.dest("/media/js/")));
});

// default task - loads sites from config and runs the tasks for the supplied site
gulp.task("default", function() {
	gulp.run("copy-root", "copy-static", "sass", "js", "copy-phaser-debug");
});

gulp.task("live", function() {
	gulp.run("copy-root", "copy-static", "sass", "js", "copy-phaser");
});