module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            src: ['src/js/**/*.js', '!src/js/lib/*'],
            options: {
                specs: 'tests/spec/**/*.js',
                helpers: 'tests/helpers/**/*.js',
                outfile: 'tests/_specRunner.html'
            }
        },

        jshint: {
            foo: {
                src: ['src/js/**/*.js', '!src/js/lib/*']
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: ['src/js/**/*.js', '!src/js/lib/*'],
                dest: 'build/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },

        cssmin: {
            combine: {
                files: {
                    'build/<%= pkg.name %>.css': 'src/css/*.css'
                }
            },
            minify: {
                src: 'build/<%= pkg.name %>.css',
                dest: 'build/<%= pkg.name %>.min.css'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');


    //Tasks
    grunt.registerTask('build', ['concat', 'uglify', 'cssmin']);
    grunt.registerTask('tests', ['jshint', 'jasmine']);

    grunt.registerTask('default', ['tests']);

};