module.exports = function(grunt) {

    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        cssmin: {
            options: {
                advanced: true,
                aggressiveMerging: true,
                semanticMerging: true
            },
            target: {
                files: {
                    '_site/css/main.css': [
                        '_site/css/main.css'
                    ]
                }
            }
        },

        imagemin: {
            dynamic: {                         
                options: {                     
                    optimizationLevel: 3,
                    svgoPlugins: [
                        {
                            removeViewBox: false
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '_site/img/', 
                        src: [
                            '**/*.{png,jpg,gif}'
                        ],
                        dest: '_site/img/'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: {
                    '_site/index.html': '_site/index.html'
                }
            }
        },

        concat: {
            css: {
                src: [
                    '_site/css/main.css'
                ],
                dest: '_site/css/main.css'
            }
        },

        watch: {
            options: {
                event: [
                    'changed',
                    'added',
                    'deleted'
                ],
                spawn: true,
                atBegin: true,
                livereload: true
            },

            images: {
                files: [
                    'img/*'
                ],

                tasks: [
                    'imagemin',
                    'exec:buildDev',
                    'concat'
                ]
            },

            jekyll: {
                files: [

                    // styles (sass)
                    '_sass/*.scss',
                    'css/*.scss',

                    // views
                    '_layouts/*.html',
                    '_includes/*.html',
                    'index.html',

                    // configurations
                    '*.yml',
                    'Gruntfile.js'
                ],

                tasks: [
                    'exec:buildDev',
                    'concat'
                ]
            }
        },

        exec: {

            // builds
            buildDev: {
                cmd: 'JEKYLL_ENV=development jekyll build -c _config.yml,_config_dev.yml'
            },
            buildStg: {
                cmd: 'JEKYLL_ENV=staging jekyll build -c _config.yml,_config_stg.yml'
            },
            buildPrd: {
                cmd: 'JEKYLL_ENV=production jekyll build -c _config.yml,_config_prd.yml'
            },

            // deploys
            deployPrd: {
                cmd: 'rsync -azpog --progress --delete-excluded' +
                    ' --exclude "Gruntfile.js"' +
                    ' --exclude "img/src-sprite"' +
                    ' --exclude "package.json"' +
                    ' --exclude "node_modules/"' +
                    ' --exclude "README.md"' +
                    ' --exclude "LICENSE"' +
                    ' -e "ssh -q" _site/ root@andrewslince.me:/var/www/andrewslince.me/'
            }
        }
    });

    // load tasks
    require('load-grunt-tasks')(grunt);

    // register tasks
    grunt.registerTask('default', [
        'exec:buildDev',
        'concat'
    ]);

    grunt.registerTask('deploy-prd', [
        'exec:buildPrd',
        'htmlmin',
        'imagemin',
        'cssmin',
        'exec:deployPrd'
    ]);
};