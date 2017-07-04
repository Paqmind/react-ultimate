let Fs = require("fs")
let Path = require("path")
let {assoc, map, reduce} = require("ramda")
let {Base64} = require("js-base64")
let Webpack = require("webpack")
let CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin")
let ExtractTextPlugin = require("extract-text-webpack-plugin")
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

const AUTOPREFIXER = "autoprefixer?{browsers: ['> 1%']}"

module.exports = {
  // http://webpack.github.io/docs/configuration.html#target
  target: "web",

  // http://webpack.github.io/docs/configuration.html#entry
  entry: {
    bundle: "./frontend/app",

		vendors: [
			"globalize",
			"globalize/dist/globalize-runtime/number",
			"globalize/dist/globalize-runtime/plural",
			"globalize/dist/globalize-runtime/message",
			"globalize/dist/globalize-runtime/currency",
			"globalize/dist/globalize-runtime/date",
			"globalize/dist/globalize-runtime/relative-time"
		],
  },

  // http://webpack.github.io/docs/configuration.html#output
  output: {
    // http://webpack.github.io/docs/configuration.html#output-path
    path: PUBLIC_DIR,

    // http://webpack.github.io/docs/configuration.html#output-filename
    filename: "[name].js?[chunkhash]",

    // http://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "/public/",

    // http://webpack.github.io/docs/configuration.html#output-pathinfo
    pathinfo: false,
  },

  // http://webpack.github.io/docs/configuration.html#debug
  debug: false,

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
      {test: /\.(js(\?.*)?)$/, loaders: ["babel-loader"], exclude: /node_modules/},

      // https://github.com/webpack/json-loader
      {test: /\.(json(\?.*)?)$/,  loaders: ["json"]},
      {test: /\.(json5(\?.*)?)$/, loaders: ["json5"]},

      // https://github.com/webpack/css-loader
      {test: /\.(css(\?.*)?)$/, loader: ExtractTextPlugin.extract(`css!${AUTOPREFIXER}`)},

      // https://github.com/webpack/less-loader
      {test: /\.(less(\?.*)?)$/, loader: ExtractTextPlugin.extract(`css!${AUTOPREFIXER}!less`)},

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

  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/addons': true,
    'react/lib/ReactContext': true
  },

  // http://webpack.github.io/docs/list-of-plugins.html
  plugins: [
    new Webpack.NoErrorsPlugin(),
    new Webpack.IgnorePlugin(/^vertx$/),
    new Webpack.DefinePlugin(DEFINE),
    new Webpack.optimize.DedupePlugin(),
		new Webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
		}),
    new Webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js?[chunkhash]"),
    new Webpack.optimize.UglifyJsPlugin({mangle: {except: ["$", "window", "document", "console"]}}),
    new ExtractTextPlugin("[name].css?[contenthash]"),
    function () {
      this.plugin("done", function (stats) {
        let jsonStats = stats.toJson({
          chunkModules: true,
        })
        jsonStats.publicPath = "/public/"
        Fs.writeFileSync(
          Path.join(PUBLIC_DIR, "assets.json"),
          JSON.stringify(jsonStats.assetsByChunkName)
        )
      })
    },
  ],
}
