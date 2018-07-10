const gulp = require("gulp");
const nodemon = require("gulp-nodemon");


gulp.task("default", ["nodemon"], function () { });

gulp.task("nodemon", function (cb) {
    var started = false;

    return nodemon({
        script: "server.js",
        ignore: ["./static", "./public"],
        nodeArgs: ["--inspect=0.0.0.0:9229"],
    }).on("start", function () {
        if (!started) {
            cb();
            started = true;
        }
    });
});