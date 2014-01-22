module.exports = function(grunt) { 'use strict';

	var zipFile = 'AngularCalculator.zip';

	grunt.initConfig({
		zipFile: zipFile,
		
		jshint: {
			files: ['*.js'],

			options: {
				ignores: [
					'coverage/**',
					'**/node_modules/**',
					'jquery-1.9.1.js',
					'qunit-1.13.0.css',
					'qunit-1.13.0.js'
				],
				reporter: 'checkstyle',
				reporterOutput: 'result.xml',
				strict: true,
				newcap: false,
				globals: {
					describe: true,
					afterEach: true,
					beforeEach: true,
					inject: true,
					it: true,
					jasmine: true,
					expect: true,
					angular: true,
					module: true,
					Crafty: true
				}
			}
		},

		clean :	{
			work: {
				src : [ 
					"**/node_modules/**", 
				]
			},
			
			zip: {
				src: [  ]
			}
		},

		compress: {
				angularCalculator: {
					options: {
						archive: '<%= zipFile %>',
						mode: 'zip'
					},
					files: [
						{ src: './*.html' },
						{ src: './*.js*' },
						{ src: './*.css' },
						{ src: './Assets/**' },
						{ src: './Library/**' },
						{ src: './Source/**' },
						{ src: './Style/**' },
						{ src: './Tests/**' },
						{ src: './LICENSE' },
						{ src: './README.md' }
					]
				}
			},

		copy: {
			main: {
				src: '<%= zipFile %>',
				dest: process.env.HOMEPATH + '/Aptana Rubles/ElfRuble/templates/'
			}
		},

		bowercopy: {
			options: {
				destPrefix: 'Library',
				srcPrefix: 'bower_components'
				// clean: true
			},
			plugins: {
				options: {
					destPrefix: 'public/js/plugins'
				},
				files: {
					// Make dependencies follow your naming conventions
					'jquery.chosen.js': 'chosen/public/chosen.js'
				}
			},
			jasmine: {
				options: {
				},
				files: {
					'jasmine.js': 'jasmine/lib/jasmine-core/jasmine.js',
					'jasmine.css': 'jasmine/lib/jasmine-core/jasmine.css',
					'jasmine-html.js': 'jasmine/lib/jasmine-core/jasmine-html.js',
					'boot.js': 'jasmine/lib/jasmine-core/boot.js',
					'console.js': 'jasmine/lib/console/console.js',
					'jasmine_favicon.png': 'jasmine/images/jasmine_favicon.png'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bowercopy');

	grunt.registerTask('dist', ['clean:zip', 'compress:angularCalculator', 'copy:main']);
};