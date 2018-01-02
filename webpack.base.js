const path = require( 'path' );

module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: path.resolve( 'src' ),
        loader: 'istanbul-instrumenter-loader'
      },
      {
        test: /\.js?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          emitWarning: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  }
};
