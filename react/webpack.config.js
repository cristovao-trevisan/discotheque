path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

module.exports = {
  entry: ['babel-polyfill', './main.js'],
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      {
       test: /\.(js|jsx)$/,
       exclude: /node_modules/,
       query: {compact: false},
       loader: 'babel-loader'
      },
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.styl$/,
        loader: 'css-loader!stylus-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=/assets/[name].[hash].[ext]&publicPath=/dist'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  devServer: {
    contentBase: './dist/'
  }
}
