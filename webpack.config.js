const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

config = {
  entry: {
    script: ['./src/index.tsx']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist/'),
    publicPath: './',
  },
  resolve: {
    modules: ['node_modules'],
    extensions:['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {   
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { 
              minimize: true,
            },
          },
          'sass-loader?sourceMap',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
  performance: {
    hints: false,
  },
};

module.exports = config;