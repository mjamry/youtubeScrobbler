module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        dirs:
        {
            src: 'src',
            dst: 'build/<%= pkg.name %>_<%= pkg.version %>'
        },

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
            html: '<%= dirs.src %>/index.html',
            options: {
                dest: '<%= dirs.dst %>'
            }
        },

        usemin: {
            html: '<%= dirs.dst %>/index.html'
        },

        copy: {
            copyIndex:{
                src: '<%= dirs.src %>/index.html',
                dest: '<%= dirs.dst %>/index.html'
            },
            copyChangelog:{
                src: '<%= dirs.src %>/CHANGELOG.html',
                dest: '<%= dirs.dst %>/CHANGELOG.html'
            },
            copyPages:{
                src: '<%= dirs.src %>/pages/*.html',
                dest: "<%= dirs.dst %>/pages",
                flatten: true,
                expand:true
            },
            copyThemes:{
                src: '<%= dirs.src %>/css/themes/*.css',
                dest: '<%= dirs.dst %>/css/themes',
                flatten: true,
                expand:true
            },
            copyLibrariesStyles:{
                src: '<%= dirs.src %>/css/lib/*.css',
                dest: '<%= dirs.dst %>/css/lib',
                flatten: true,
                expand:true
            },
            copyJSLibs:{
                src:'<%= dirs.src %>/js/lib/*.js',
                dest:'<%= dirs.dst %>/js/lib',
                flatten:true,
                expand:true
            },
            copyMedia:{
                src:'<%= dirs.src %>/media/*',
                dest:'<%= dirs.dst %>/media',
                flatten:true,
                expand:true
            },
            copyPhp:{
                src:'<%= dirs.src %>/php/*.php',
                dest:'<%= dirs.dst %>/php',
                flatten:true,
                expand:true
            }
        },

        shell: {
            updateChangelog: {
                command: 'python updateChangelogIssues.py'
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
    grunt.loadNpmTasks('grunt-shell');

    //Tasks
    grunt.registerTask('build', ['copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'shell:updateChangelog']);
    grunt.registerTask('tests', ['jshint', 'jasmine']);

    grunt.registerTask('default', ['tests']);
    grunt.registerTask('changelog', ['shell:updateChangelog']);
};