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
            concat : 'dist/<%= pkg.name %>.js',
            minified : 'dist/<%= pkg.name %>.min.js'
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
                tasks: ['jshint', 'karma:unit']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js','demo/*.js'],
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
                dest: '<%= concat.src.dest %>'
            }
        },
        uglify: {
            src: {
                files: {
                    '<%= buildFile.minified %>': '<%= concat.src.dest %>'
                }
            }
        },
        copy: {
            build: {
                files: [
                    {src: ['*.md','LICENSE','.travis.yml'], dest: 'dist/', filter: 'isFile'}
                ]
            },
            ghPages : {
                files: [
                    {expand: true, flatten: true, src: ['demo/*'], dest: 'gh-pages/', filter: 'isFile'}
                ]
            }
        },
        clean: {
            build: {
                src: ['dist/*','!dist/.git*']
            },
            ghPages: {
                src: ['gh-pages/*','!dist/.git*']
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
        },
        buildcontrol: {
            options: {
                commit: true,
                push: true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            dist: {
                options: {
                    dir: 'dist',
                    branch: 'distribution',
                    remote: 'https://github.com/Treeweb/angular-tree-default-model.git'
                }
            },
            ghPages: {
                options: {
                    dir : 'demo',
                    branch: 'gh-pages',
                    remote: 'https://github.com/Treeweb/angular-tree-default-model.git',
                    message: 'Built %sourceName% gh-pages from commit %sourceCommit% on branch %sourceBranch%'
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
        'usebanner:build'
    ]);

    grunt.registerTask('distribution', [
        'build',
        'buildcontrol:dist'
    ]);

    grunt.registerTask('gh-pages', [
        'clean:ghPages',
        'copy:ghPages',
        'buildcontrol:ghPages',
        'clean:ghPages'
    ]);
};
