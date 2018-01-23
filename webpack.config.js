const path = require( 'path' );
const merge = require( 'webpack-merge' );
const baseConfig = require( './webpack.base' );
const webpackNodeExternals = require( 'webpack-node-externals' );

const config = {
  target: 'node',

  entry: './src/index.js',

  output: {
    path: path.join( __dirname, 'build' ),
    filename: 'server.js'
  },

  externals: [webpackNodeExternals()]
};

module.exports = merge( baseConfig, config );
