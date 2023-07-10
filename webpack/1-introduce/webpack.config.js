// webpack.config.js  
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  mode: 'development',  
  entry: './index.js',  
  output: {  
    path: path.resolve(__dirname, 'public'), // 👈 指定絕對路徑
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
  }
};