module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        concat: {
            basic: {
                "options": { "separator": "\n" },
                "files": {
                    "dist/crypto.js": ["src/crypto/jsbn.js","src/crypto/jsbn2.js","src/crypto/prng4.js","src/crypto/rng.js","src/crypto/sha1.js","src/crypto/sha256.js",
                                       "src/crypto/rsa.js","src/crypto/rsa2.js","src/crypto/rsa-sign.js","src/crypto/sjcl.js"],
                    "dist/libs.js": ["src/libs/zepto.min.js","src/libs/jquery.identicon5.js",
                                     "src/libs/rawdeflate.min.js","src/libs/rawinflate.min.js",
                                     "src/libs/highlight.pack.js"],

                    "ddt.user.js": ["src/metablock.js", 'src/_head.js', "dist/crypto.js","dist/libs.js","src/misc/*.js","src/main.js","src/_tail.js"],
                    "ddt.meta.js": ["src/metablock.js"]
                }
            }
        },

        jshint: {
            all: ['src/**/*.js', 'src/misc/*.js'],
            options: {
                ignores: ['src/_tail.js','src/metablock.js','src/_head.js','src/_tail.js','src/crypto/*.js','src/libs/*.js'],
                strict: true,
                browser: true,
                devel: true,
            }
        }
    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Task definitions
    grunt.registerTask('default', ['jshint', 'concat']);
};
