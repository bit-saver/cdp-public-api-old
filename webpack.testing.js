const nodeExternals = require( 'webpack-node-externals' );
const path = require( 'path' );

process.env.NODE_ENV = 'testing';

module.exports = {
  target: 'node',
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  resolve: {
    alias: {
      '~/helpers.test': path.resolve( __dirname, 'test/helpers.test' ),
      '~helpers.test': path.resolve( __dirname, 'test/helpers.test' ),
      '~api.test': path.resolve( __dirname, 'test/api.test' ),
      '~/api.test': path.resolve( __dirname, 'test/api.test' )
    }
  },
  devtool: 'cheap-module-source-map',
  externals: [ nodeExternals() ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [ [ 'env', { modules: false } ], 'stage-0' ],
              plugins: [ 'transform-regenerator', 'transform-runtime' ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  }
};
