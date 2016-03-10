"use strict";

let Fs = require("fs");
let Path = require("path");
let Webpack = require("webpack");
let constants = require("shared/constants");

let NODE_MODULES_DIR = constants.NODE_MODULES_DIR;
let SHARED_DIR = constants.SHARED_DIR;
let FRONTEND_DIR = constants.FRONTEND_DIR;
let BACKEND_DIR = constants.BACKEND_DIR;
let PUBLIC_DIR = constants.PUBLIC_DIR;

module.exports = {
  // Compilation target: http://webpack.github.io/docs/configuration.html#target
  target: "web",

  // Entry files: http://webpack.github.io/docs/configuration.html#entry
  entry: {
    bundle: "./frontend.new/app",
  },

  // Output files: http://webpack.github.io/docs/configuration.html#output
  output: {
    // Abs. path to output directory: http://webpack.github.io/docs/configuration.html#output-path
    path: PUBLIC_DIR,

    // Filename of an entry chunk: http://webpack.github.io/docs/configuration.html#output-filename
    filename: "[name].js",

    // Web path (used to prefix URLs): http://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "http://localhost:2992/public/",

    // Include pathinfo in output (like `require(/*./test*/23)`): http://webpack.github.io/docs/configuration.html#output-pathinfo
    pathinfo: true,
  },

  // Debug mode: http://webpack.github.io/docs/configuration.html#debug
  // debug: true,

  // Enhance debugging: http://webpack.github.io/docs/configuration.html#devtool
  // devtool: null,

  // Capture timing information: http://webpack.github.io/docs/configuration.html#profile
  // profile: false,

  // http://webpack.github.io/docs/configuration.html#module
  module: {
    // http://webpack.github.io/docs/loaders.html
    loaders: [
      // JS https://github.com/babel/babel-loader
      {test: /\.(js(\?.*)?)$/, loaders: ["babel?stage=0"], exclude: /node_modules/},

      // JSON https://github.com/webpack/json-loader
      // {test: /\.(json(\?.*)?)$/,  loaders: ["json"]},
      // {test: /\.(json5(\?.*)?)$/, loaders: ["json5"]},

      // RAW https://github.com/webpack/raw-loader
      // {test: /\.(txt(\?.*)?)$/, loaders: ["raw"]},

      // URL: https://github.com/webpack/url-loader
      // {test: /\.(jpg(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      // {test: /\.(jpeg(\?.*)?)$/,  loaders: ["url?limit=10000"]},
      // {test: /\.(png(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      // {test: /\.(gif(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      // {test: /\.(svg(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      // {test: /\.(woff(\?.*)?)$/,  loaders: ["url?limit=100000"]},
      // {test: /\.(woff2(\?.*)?)$/, loaders: ["url?limit=100000"]},

      // FILE: https://github.com/webpack/file-loader
      // {test: /\.(ttf(\?.*)?)$/, loaders: ["file"]},
      // {test: /\.(eot(\?.*)?)$/, loaders: ["file"]},
      // {test: /\.(wav(\?.*)?)$/, loaders: ["file"]},
      // {test: /\.(mp3(\?.*)?)$/, loaders: ["file"]},

      // HTML
      // {test: /\.(html(\?.*)?)$/, loaders: ["html"]},

      // MARKDOWN
      // {test: /\.(md(\?.*)?)$/, loaders: ["html", "markdown"]},

      // CSS: https://github.com/webpack/css-loader
      // {test: /\.(css(\?.*)?)$/, loaders: ["style", "css?sourceMap"]},

      // LESS: https://github.com/webpack/less-loader
      // {test: /\.(less(\?.*)?)$/, loaders: ["style", "css?sourceMap", "less?sourceMap"]},
    ],
  },

  // Module resolving: http://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    // Abs. path with modules
    root: FRONTEND_DIR,

    // Additional folders
    modulesDirectories: ["node_modules"],
  },

  // Loader resolving: http://webpack.github.io/docs/configuration.html#resolveloader
  resolveLoader: {
    // Abs. path with loaders
    root: NODE_MODULES_DIR,
  },

  // http://webpack.github.io/docs/list-of-plugins.html
  // plugins: [
    // new Webpack.NoErrorsPlugin(),
    // new Webpack.IgnorePlugin(/^vertx$/),
    // new Webpack.DefinePlugin(DEFINE),
    // new Webpack.optimize.DedupePlugin(),
  // ],
};
