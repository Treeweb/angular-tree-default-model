module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    var _ = require('lodash');

    var karmaConfig = function(configFile, customOptions) {
        var options = {
            configFile: configFile,
            keepalive: true
        };
        var travisOptions = process.env.TRAVIS && {
            browsers: ['Firefox'],
            reporters: 'dots'
        };
        return _.extend(options, customOptions, travisOptions);
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        meta: {
            banner: '/*!\n' +
                ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd hh:mm") %> \n' +
                '<%= pkg.homepage ? " * " + pkg.homepage + "" : "" %> \n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> \n' +
                ' * Licensed <%= pkg.license %> ' +
                '\n*/'

        },
        buildFile: {
            concat : 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
            minified : 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
                tasks: ['jshint', 'karma:unit']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                eqeqeq: true,
                globals: {
                    angular: true
                }
            }
        },

        karma: {
            unit: {
                options: karmaConfig('karma.conf.js', {
                    singleRun: true
                })
            },
            jenkins: {
                options: karmaConfig('karma.conf.js', {
                    singleRun: true,
                    preProcessors: {
                        'src/**/*.js': 'coverage'
                    },
                    reporters: ['progress', 'dots', 'junit', 'coverage'],
                    junitReporter: {
                        outputFile: 'test-results.xml'
                    },
                    coverageReporter: {
                        type: 'html',
                        dir: 'coverage/'
                    },
                    browsers: ['PhantomJS']
                })
            },
            server: {
                options: karmaConfig('karma.conf.js', {
                    singleRun: false
                })
            }
        },
        changelog: {
            options: {
                dest: 'CHANGELOG.md'
            }
        },
        concat: {
            src: {
                src: ['src/**/*.js'],
                dest: '<%= buildFile.concat %>'
            }
        },
        ngmin: {
            src: {
                src: '<%= concat.src.dest %>',
                dest: '.tmp/<%= concat.src.dest %>.ng-min.js'
            }
        },
        uglify: {
            src: {
                files: {
                    '<%= buildFile.minified %>': '<%= ngmin.src.dest %>'
                }
            }
        },
        copy: {
            build: {
                files: [
                    {src: ['*.md','LICENSE'], dest: 'dist/', filter: 'isFile'}
                ]
            }
        },
        clean: {
            build: {
                src: ['dist/']
            },
            tmp: {
                src: ['.tmp']
            }
        },
        usebanner: {
            build: {
                options: {
                    position: 'top',
                    banner: '<%= meta.banner %>',
                    linebreak: true
                },
                files: {
                    src: [ '<%= buildFile.concat %>', '<%= buildFile.minified %>' ]
                }
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'karma:unit']);
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('test-server', ['karma:server']);
    grunt.registerTask('jenkins', ['jshint', 'karma:jenkins']);

    grunt.registerTask('build', [
        'jshint',
        'karma:unit',
        'clean',
        'concat',
        'ngmin',
        'uglify',
        'copy:build',
        'usebanner:build',
        'clean:tmp'
    ]);
};
