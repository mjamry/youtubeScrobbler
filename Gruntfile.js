module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            src: ['src/js/**/*.js', '!src/js/lib/*'],
            options: {
                vendor: 'http://code.jquery.com/jquery-1.9.0rc1.js',
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

        useminPrepare: {
            html: 'src/index.html',
            options: {
                dest: 'build'
            }
        },

        usemin: {
            html: 'build/index.html'
        },

        copy: {
            copyIndex:{
                src: 'src/index.html',
                dest: 'build/index.html'
            },
            copyPages:{
                src: 'src/pages/*.html',
                dest: "build/pages",
                flatten: true,
                expand:true
            },
            copyThemes:{
                src: 'src/css/themes/*.css',
                dest: 'build/css/themes',
                flatten: true,
                expand:true
            },
            copyLibrariesStyles:{
                src: 'src/css/lib/*.css',
                dest: 'build/css/lib',
                flatten: true,
                expand:true
            },
            copyJSLibs:{
                src:'src/js/lib/*.js',
                dest:'build/js/lib',
                flatten:true,
                expand:true
            },
            copyMedia:{
                src:'src/media/*',
                dest:'build/media',
                flatten:true,
                expand:true
            },
            copyPhp:{
                src:'src/php/*.php',
                dest:'build/php',
                flatten:true,
                expand:true
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');


    //Tasks
    grunt.registerTask('build', ['copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin']);
    grunt.registerTask('tests', ['jshint', 'jasmine']);

    grunt.registerTask('default', ['tests']);

};