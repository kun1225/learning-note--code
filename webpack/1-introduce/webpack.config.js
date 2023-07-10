// webpack.config.js  
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  mode: 'development',  
  entry: './index.js',  
  output: {  
    filename: 'main.[contenthash].js',  
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '/'),
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
  }
};