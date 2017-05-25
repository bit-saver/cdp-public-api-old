const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const helpers = require('./helpers/webpack.modules');

module.exports = {
  name: 'elasticsearch public api',
  target: 'node',
  entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
  output: {
    filename: 'build/server.js'
  },
  module: merge(helpers.babelConfig()),
  externals: [nodeExternals()]
};
