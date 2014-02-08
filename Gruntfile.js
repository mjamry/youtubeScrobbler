module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            pivotal: {
                src: ['src/js/**/*.js', '!src/js/lib/*'],
                options: {
                    spec: 'tests/spec/**/*.js'
                }
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
            dist: {
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
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat')

    grunt.registerTask('tests', ['jshint', 'jasmine']);
    grunt.registerTask('build', ['concat', 'uglify']);

};