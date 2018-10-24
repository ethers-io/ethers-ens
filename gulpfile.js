'use strict';

const fs = require('fs');

const browserify = require("browserify");
const gulp = require("gulp");
const through = require('through');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

function createTransform(transforms, show) {
    if (!show) { show = { }; }

    function padding(length) {
        let pad = '';
        while (pad.length < length) { pad += ' '; }
        return pad;
    }

    function transformFile(path) {
        for (let pattern in transforms) {
            if (path.match(new RegExp('/' + pattern + '$'))) {
                return transforms[pattern];
            }
        }
        return null;
    }

    return function(path, options) {
        let data = '';

        return through(function(chunk) {
            data += chunk;
        }, function () {
            let transformed = transformFile(path);
            let shortPath = path;
            if (shortPath.substring(0, __dirname.length) == __dirname) {
                shortPath = shortPath.substring(__dirname.length);
            }
            let size = fs.readFileSync(path).length;
            if (transformed != null) {
                if (show.transformed) {
                    console.log('Transformed:', shortPath, padding(70 - shortPath.length), size, padding(6 - String(size).length), '=>', transformed.length);
                }
                data = transformed;
            } else {
                if (show.preserved) {
                    console.log('Preserved:  ', shortPath, padding(70 - shortPath.length), size);
                }
            }
            this.queue(data);
            this.queue(null);
        });
    }
}

function taskBundle(name, options) {
    let show = options.show || { };

    function readShim(filename) {
        return fs.readFileSync('./shims/' + filename + '.js').toString();
    }

    let transforms = {
        "ethers/dist/ethers.js": "module.exports = global.ethers;"
    };

    gulp.task(name, function () {

        let result = browserify({
            basedir: '.',
            debug: false,
            entries: [ './index.js' ],
            cache: { },
            packageCache: {},
            standalone: "ENS",
            transform: [ [ createTransform(transforms, show), { global: true } ] ],
        })
        .bundle()
        .pipe(source(options.filename))

        if (options.minify) {
            result = result.pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
        }

        result = result.pipe(gulp.dest(options.dest));

        return result;
    });
}

taskBundle("default", {
    dest: "dist",
    filename: "ethers-ens.js",
    minify: false,
    show: { preserved: true, transformed: true }
});
