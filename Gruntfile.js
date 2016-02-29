module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jscs: {
      options: {
        preset: 'node-style-guide',
        jsDoc: {
          checkAnnotations: 'jsdoc3',
          checkParamExistence: true,
          checkTypes: 'strictNativeCase',
          enforceExistence: {
            allExcept: ['exports'],
          },
        },
      },
      src: ['lib', 'tests', 'demo', 'Gruntfile.js'],
    },
    jshint: {
      options: {
        esversion: 6,
        undef: true,
        curly: true,
        eqeqeq: true,
        node: true,
      },
      tests: {
        options: {
          jasmine: true,
        },
        src: 'tests',
      },
      lib: {src: 'lib'},
      demo: {src: 'demo'},
      meta: {src: ['package.json', 'Gruntfile.js'],},
    },
    jasmine_nodejs: {  // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      options: {},
      all: {specs: ['tests/**'],},
    },
  });

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  grunt.registerTask('default', ['jscs', 'jshint', 'jasmine_nodejs']);
};
