const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./app/index.js",
  devtool: 'eval-cheap-source-map',
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      { test: /\.(js|jsx|ts|tsx)$/, exclude: /node_modules/, use: ["babel-loader"] },
      { test: /\.(css|scss)$/, use: ["style-loader", "css-loader", "sass-loader"] },
      { test: /\.html$/, use: "html-loader" },
      { test: /\.(glsl)$/, use: "webpack-glsl-loader" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({template: "./app/index.html"}),
    new webpack.ProvidePlugin({process: 'process/browser'}),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.glsl', '.css', '.scss'],
  },
};