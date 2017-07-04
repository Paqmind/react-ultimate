//DEV server config

let Fs = require("fs")
let Path = require("path")
let {assoc, map, reduce} = require("ramda")
let {Base64} = require("js-base64")
let Webpack = require("webpack")
let {NODE_MODULES_DIR, COMMON_DIR, FRONTEND_DIR, BACKEND_DIR, PUBLIC_DIR} = require("common/constants")
let ExtractTextPlugin = require("extract-text-webpack-plugin")

// Paths to minified library distributions relative to the root node_modules
const MINIFIED_DEPS = [
  "moment/min/moment.min.js",
]

const API_AUTH = process.env.hasOwnProperty("API_USER_NAME") && process.env.hasOwnProperty("API_USER_PASS")
  ? "Basic " + Base64.encode(process.env.API_USER_NAME + ":" + process.env.API_USER_PASS)
  : undefined

const DEFINE = {
  "process.env": {
    "NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  "config": {
    "api-auth": JSON.stringify(API_AUTH),
  },
}

module.exports = {
  // http://webpack.github.io/docs/configuration.html#target
  target: "web",

  // http://webpack.github.io/docs/configuration.html#entry
  entry: {
    bundle: "./frontend/app",
  },

  // http://webpack.github.io/docs/configuration.html#output
  output: {
    // http://webpack.github.io/docs/configuration.html#output-path
    path: PUBLIC_DIR,

    // http://webpack.github.io/docs/configuration.html#output-filename
    filename: "[name].js",

    // http://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "http://localhost:2992/public/",

    // http://webpack.github.io/docs/configuration.html#output-pathinfo
    pathinfo: true,
  },

  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: false,

  // http://webpack.github.io/docs/configuration.html#profile
  profile: false,

  // http://webpack.github.io/docs/configuration.html#module
  module: {
    noParse: map(dep => {
      return Path.resolve(NODE_MODULES_DIR, dep)
    }, MINIFIED_DEPS),

    // http://webpack.github.io/docs/loaders.html
    rules: [
      // https://github.com/babel/babel-loader
      {test: /\.(js(\?.*)?)$/, loader: "babel-loader", exclude: /node_modules/},

      // https://github.com/webpack/json-loader
      //{test: /\.(json(\?.*)?)$/,  loader: "json-loader"},
      {test: /\.(json5(\?.*)?)$/, loader: "json5-loader"},

      // https://github.com/webpack/css-loader
      {test: /\.(css(\?.*)?)$/, use: [{ loader: "style-loader", options: { sourceMap: true } }] },

      // https://github.com/webpack/less-loader
      {test: /\.(less(\?.*)?)$/, use: ["style-loader", "css-loader", "less-loader"] },
      //{test: /\.(less(\?.*)?)$/, use: [{ loader: "less-loader", options: { sourceMap: true } }] },

      // https://github.com/webpack/url-loader
      {test: /\.(jpg(\?.*)?)$/,   use: [{loader: "url-loader", options: { limit: 10000 } }]},
      {test: /\.(jpeg(\?.*)?)$/,  use: [{loader: "url-loader", options: { limit: 10000 } }]},
      {test: /\.(png(\?.*)?)$/,   use: [{loader: "url-loader", options: { limit: 10000 } }]},
      {test: /\.(gif(\?.*)?)$/,   use: [{loader: "url-loader", options: { limit: 10000 } }]},
      {test: /\.(svg(\?.*)?)$/,   use: [{loader: "url-loader", options: { limit: 10000 } }]},
      {test: /\.(woff(\?.*)?)$/,  use: [{loader: "url-loader", options: { limit: 100000 } }]},
      {test: /\.(woff2(\?.*)?)$/, use: [{loader: "url-loader", options: { limit: 100000 } }]},

      // https://github.com/webpack/file-loader
      {test: /\.(ttf(\?.*)?)$/, loader: "file-loader"},
      {test: /\.(eot(\?.*)?)$/, loader: "file-loader"},
      {test: /\.(wav(\?.*)?)$/, loader: "file-loader"},
      {test: /\.(mp3(\?.*)?)$/, loader: "file-loader"},

      // https://github.com/webpack/raw-loader
      {test: /\.(txt(\?.*)?)$/, loader: "raw-loader"},
    ],
  },

  // http://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    modules: [
      FRONTEND_DIR,
      "web_modules",
      "node_modules"
    ],

    alias: reduce((memo, dep) => {
      let depPath = Path.resolve(NODE_MODULES_DIR, dep)
      return assoc(dep.split(Path.sep)[0], depPath, memo)
    }, {}, MINIFIED_DEPS),
  },

  // http://webpack.github.io/docs/configuration.html#resolveloader
  resolveLoader: {
    //root: NODE_MODULES_DIR,
  },

  // http://webpack.github.io/docs/list-of-plugins.html
  plugins: [
    new Webpack.NoEmitOnErrorsPlugin(),
    new Webpack.IgnorePlugin(/^vertx$/),
    new Webpack.DefinePlugin(DEFINE),
    new Webpack.LoaderOptionsPlugin({debug: true}),
    //new Webpack.optimize.DedupePlugin(),
  ],

  devServer: {
    headers: {"Access-Control-Allow-Origin": "*"},
  }
}
