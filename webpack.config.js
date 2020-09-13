/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack")
const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const CommonConfigWebpackPlugin = require("common-config-webpack-plugin")

require("dotenv").config()

module.exports = {
  devServer: {
    contentBase: [path.join(__dirname, "dist")],
  },
  plugins: [
    new CommonConfigWebpackPlugin(),
    new HtmlPlugin({
      template: "./src/index.html",
    }),
    new webpack.EnvironmentPlugin(["API_KEY"]),
  ],
}
