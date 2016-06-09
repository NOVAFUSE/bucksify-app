module.exports = function (grunt) {
    'use strict';

	grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-script-inject');
    
    function getConfiguration() {
    	var config;
    	try{
    		config = grunt.file.readJSON('config.json');
    	} catch(e){
    		config = grunt.file.readJSON('config/config.json');
    	}
    	return config;
    }
    
    function getFileContent(filePath) {
    	var content = '';
    	try{
    		content = grunt.file.read(filePath).toString();
    	} catch(e){
    		grunt.log.ok('getFileContent: '+e)
    	}
    	return content;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
       
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            scriptinject: {
            	tasks: ['scriptinject'],
            	files: ['src/app/**/*.js'],
            	options: {
            		event: ['added', 'deleted']
            	}
            },
            livereload: {
                options: {
                    livereload: {
            
                	}
                },
                files: [
                    '**/*.html',
                    '**/*.css',
                    '**/*.js'
                ]
            }
        },
        connect: {
            server: {
                options: {
                    protocol: 'http',
                    port: 9000,
                    hostname: 'localhost',
                    livereload: true,
                    base: 'src'
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            reports: ['reports'],
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '*.zip',
                        'dist/{,*/}*',
                        'dist/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        
        scriptinject: {
            dist: {
                srcs: ['src/app/modules/**/*.js'], //order is important if this script will be concated and minified
                html: 'src/index.html', //file that as the block comment to look for a place to insert the script tags
                without: 'src/' //this script will be used to remove this block of string of script tag file location
            }
        },
		

		wiredep: {

		  task: {

			src: [
			  'src/index.html'
			],

			options: {
			}
		  }
		}
        
     });


    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'scriptinject',
			'wiredep',
            'connect:server',
            'watch'
        ]);
    });


};