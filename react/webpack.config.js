'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const commomPlugins = [
  new HtmlWebpackPlugin({
    template: 'public/index.ejs',
    filename: '../views/pages/index.ejs',
    user: '<%- JSON.stringify(user) %>'
  }),
  new ExtractTextPlugin('[name].bundle.css'),
  new CopyWebpackPlugin([{
    from: path.join(__dirname, 'public'),
    ignore: ['index.ejs']
  }]),
  new ProgressBarPlugin()
]
const optimizePlugins = [
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vendor']
  })
]
// run optimizations only on production
const plugins = process.env.NODE_ENV === 'production' ? commomPlugins.concat(optimizePlugins) : commomPlugins

module.exports = {
  context: __dirname,
  entry: {
    app: ['./main'],
    vendor: ['react', 'react-dom', 'onsenui', 'react-onsenui']
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  target: 'web',
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'file-loader?name=assets/[name].[hash].[ext]'
      }
    ]
  },
  plugins
}
