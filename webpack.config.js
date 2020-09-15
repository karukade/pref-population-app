/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack")
const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const TsConfigWebpackPlugin = require("ts-config-webpack-plugin")
const ScssConfigWebpackPlugin = require("scss-config-webpack-plugin")

require("dotenv").config()

module.exports = {
  devServer: {
    contentBase: [path.join(__dirname, "dist")],
  },
  plugins: [
    new TsConfigWebpackPlugin(),
    new ScssConfigWebpackPlugin(),
    new HtmlPlugin({
      template: "./src/index.html",
    }),
    new webpack.EnvironmentPlugin(["API_KEY"]),
  ],
}
