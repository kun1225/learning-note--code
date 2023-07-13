// webpack.config.js  
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  // entry: {
  //   index: {
  //     import: './src/index.js',
  //     dependOn: 'shared-moment'
  //   },
  //   another: {
  //     import: './src/another-module.js',
  //     dependOn: 'shared-moment',
  //   },
  //   'shared-moment': ['moment']
  // },  
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  output: {  
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[contenthash].js',  
    clean: true,
  },
  mode: 'development',  
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};