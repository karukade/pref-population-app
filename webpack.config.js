/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack")
const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const TsConfigWebpackPlugin = require("ts-config-webpack-plugin")
const ScssConfigWebpackPlugin = require("scss-config-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

require("dotenv").config()

const plugins = [
  new TsConfigWebpackPlugin(),
  new ScssConfigWebpackPlugin(),
  new HtmlPlugin({
    template: "./src/index.html",
  }),
  new webpack.EnvironmentPlugin(["API_KEY"]),
].concat(process.env.NODE_ENV === "analyze" ? new BundleAnalyzerPlugin() : [])

module.exports = {
  devServer: {
    contentBase: [path.join(__dirname, "dist")],
  },
  plugins,
}
