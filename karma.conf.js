'use strict';

var path = require('path');

var absoluteBasePath = path.resolve(__dirname);

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: [
      'browserify',
      'jasmine'
    ],

    files: [
      'test/**/*Spec.js',
    ],

    preprocessors: {
        'test/**/*Spec.js': ['browserify']
    },

    reporters: ['dots'],

    browsers: ['Chrome'],

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,

    browserNoActivityTimeout: 30000,
    
    browserify: {
      debug: true,
      paths: [ absoluteBasePath ],
      transform: [ [ 'stringify', { global: true, extensions: [ '.xml', '.css' ] } ] ]
    }
  })
}
