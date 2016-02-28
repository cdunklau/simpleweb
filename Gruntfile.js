module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        esversion: 6,
        undef: true,
        curly: true,
        eqeqeq: true,
        node: true
      },
      tests: {
        options: {
          jasmine: true
        },
        src: 'tests'
      },
      lib: {src: 'lib'},
      demo: {src: 'demo'},
      meta: {src: ['package.json', 'Gruntfile.js']}
    },
    jasmine_nodejs: {
      options: {},
      all: { specs: ['tests/**'] }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  grunt.registerTask('default', ['jshint', 'jasmine_nodejs']);
};
