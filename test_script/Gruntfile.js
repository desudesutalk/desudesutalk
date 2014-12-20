module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        concat: {
            basic: {
                "options": { "separator": "\n" },
                "files": {
                    "dist/crypto.js": ["src/crypto/elliptic.min.js","src/crypto/sjcl.js","src/crypto/sjcl.ccm_hack.js"],
                    "dist/libs.js": ["src/libs/zepto.min.js","src/libs/jquery.identicon5.js","src/libs/base58.js",
                                     "src/libs/pako.min.js",
                                     "src/libs/highlight.pack.js"],

                    "ddt.user.js": ["src/metablock.js", 'src/_head.js', "dist/crypto.js","dist/libs.js",
                                    "src/misc/cryptcore.js",
                                    "src/misc/storage.js",
                                    "src/misc/helpers.js",
                                    "src/misc/utf8array.js",
                                    "src/misc/jsf5steg.js",
                                    "src/misc/jpeg.js",
                                    "src/misc/boards.js",
                                    "src/misc/codec.js",
                                    "src/misc/contacts.js",
                                    "src/misc/crypt.js",
                                    "src/misc/jpeg.js",
                                    "src/misc/ui.js",
                                    "src/misc/wakabamark.js",
                                    "src/main.js","src/_tail.js"],
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
