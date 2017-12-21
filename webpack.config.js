const path = require( 'path' );
const merge = require( 'webpack-merge' );
const baseConfig = require( './webpack.base.js' );
const webpackNodeExternals = require( 'webpack-node-externals' );

const config = {
  name: 'elasticsearch public api',

  // Inform webpack that we're building a bundle
  // for nodeJS, rather than for the browser
  target: 'node',

  entry: [ 'babel-polyfill', path.resolve( __dirname, 'src/index.js' ) ],

  // Tell webpack where to put the output file that is generated
  output: {
    filename: 'build/server.js'
  },

  externals: [ webpackNodeExternals() ]
};

module.exports = merge( baseConfig, config );
