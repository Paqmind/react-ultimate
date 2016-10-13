let Fs = require("fs")
let Path = require("path")
let {assoc, map, reduce} = require("ramda")
let {Base64} = require("js-base64")
let Webpack = require("webpack")
let GlobalizePlugin = require("globalize-webpack-plugin")
let {NODE_MODULES_DIR, COMMON_DIR, FRONTEND_DIR, BACKEND_DIR, PUBLIC_DIR} = require("common/constants")

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

  // http://webpack.github.io/docs/configuration.html#debug
  debug: true,

  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: null,

  // http://webpack.github.io/docs/configuration.html#profile
  profile: false,

  // http://webpack.github.io/docs/configuration.html#module
  module: {
    noParse: map(dep => {
      return Path.resolve(NODE_MODULES_DIR, dep)
    }, MINIFIED_DEPS),

    // http://webpack.github.io/docs/loaders.html
    loaders: [
      // https://github.com/babel/babel-loader
      {test: /\.(js(\?.*)?)$/, loaders: ["babel?stage=0"], exclude: /node_modules/},

      // https://github.com/webpack/json-loader
      {test: /\.(json(\?.*)?)$/,  loaders: ["json"]},
      {test: /\.(json5(\?.*)?)$/, loaders: ["json5"]},

      // https://github.com/webpack/css-loader
      {test: /\.(css(\?.*)?)$/, loaders: ["style", "css?sourceMap"]},

      // https://github.com/webpack/less-loader
      {test: /\.(less(\?.*)?)$/, loaders: ["style", "css?sourceMap", "less?sourceMap"]},

      // https://github.com/webpack/url-loader
      {test: /\.(jpg(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      {test: /\.(jpeg(\?.*)?)$/,  loaders: ["url?limit=10000"]},
      {test: /\.(png(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      {test: /\.(gif(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      {test: /\.(svg(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      {test: /\.(woff(\?.*)?)$/,  loaders: ["url?limit=100000"]},
      {test: /\.(woff2(\?.*)?)$/, loaders: ["url?limit=100000"]},

      // https://github.com/webpack/file-loader
      {test: /\.(ttf(\?.*)?)$/, loaders: ["file"]},
      {test: /\.(eot(\?.*)?)$/, loaders: ["file"]},
      {test: /\.(wav(\?.*)?)$/, loaders: ["file"]},
      {test: /\.(mp3(\?.*)?)$/, loaders: ["file"]},

      // https://github.com/webpack/raw-loader
      {test: /\.(txt(\?.*)?)$/, loaders: ["raw"]},
    ],
  },

  // http://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    root: FRONTEND_DIR,

    modulesDirectories: ["web_modules", "node_modules"],

    alias: reduce((memo, dep) => {
      let depPath = Path.resolve(NODE_MODULES_DIR, dep)
      return assoc(dep.split(Path.sep)[0], depPath, memo)
    }, {}, MINIFIED_DEPS),
  },

  // http://webpack.github.io/docs/configuration.html#resolveloader
  resolveLoader: {
    root: NODE_MODULES_DIR,
  },

  // http://webpack.github.io/docs/list-of-plugins.html
  plugins: [
    new Webpack.NoErrorsPlugin(),
    new Webpack.IgnorePlugin(/^vertx$/),
    new Webpack.DefinePlugin(DEFINE),
    new Webpack.optimize.DedupePlugin(),
    new GlobalizePlugin({
			production: false,
			developmentLocale: "en",
			supportedLocales: ["en", "ru"],
			messages: "messages/[locale].json",
			output: "i18n/[locale].[hash].js"
		})
  ],

  devServer: {
    headers: {"Access-Control-Allow-Origin": "*"},
  }
}
