// IMPORTS =========================================================================================
import Path from "path";
import {assoc, map, reduce} from "ramda";
import Webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";

// INITIAL DATA ====================================================================================
let node_modules = Path.resolve(__dirname, "node_modules");

// Paths to minified library distributions relative to project's node_modules folder
let minifiedDeps = [
  //"react/dist/react.min.js",
  //"react-router/dist/react-router.min.js",
  "moment/min/moment.min.js",
];

const autoprefixer = "autoprefixer?{browsers: ['> 5%']}";

// CONFIG ==========================================================================================
export default {
  // Compilation target http://webpack.github.io/docs/configuration.html#target
  target: "web",

  // Entry files http://webpack.github.io/docs/configuration.html#entry
  entry: {
    main: "./frontend/scripts/app",
  },

  // Output files http://webpack.github.io/docs/configuration.html#output
  output: {
    // Abs. path to output directory http://webpack.github.io/docs/configuration.html#output-path
    path: Path.join(__dirname, "/public"),

    // Filename of an entry chunk http://webpack.github.io/docs/configuration.html#output-filename
    filename: "bundle.js?[chunkhash]",

    // Web path (used to prefix URLs) http://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "/public/",

    // ??? http://webpack.github.io/docs/configuration.html#output-chunkfilename
    //chunkFilename: "[name].js?[chunkhash]", // TODO need?

    // ??? http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
    sourceMapFilename: "debugging/[file].map",

    // ??? http://webpack.github.io/docs/configuration.html#output-librarytarget
    //libraryTarget: undefined,

    // Include pathinfo in output (like `require(/*./test*/23)`) http://webpack.github.io/docs/configuration.html#output-pathinfo
    pathinfo: false,
  },

  // Debug mode http://webpack.github.io/docs/configuration.html#debug
  debug: false,

  // Enhance debugging http://webpack.github.io/docs/configuration.html#devtool
  devtool: undefined,

  // Capture timing information http://webpack.github.io/docs/configuration.html#profile
  profile: false,

  // Module http://webpack.github.io/docs/configuration.html#module
  module: {
    noParse: map(dep => {
      return Path.resolve(node_modules, dep);
    }, minifiedDeps),

    loaders: [ // http://webpack.github.io/docs/loaders.html
      // JS
      {test: /\.(js(\?.*)?)$/, loaders: ["babel?stage=0"], exclude: /node_modules/},

      // JSON
      {test: /\.(json(\?.*)?)$/,  loaders: ["json"]},
      {test: /\.(json5(\?.*)?)$/, loaders: ["json5"]},

      // RAW
      {test: /\.(txt(\?.*)?)$/, loaders: ["raw"]},

      // URL
      {test: /\.(jpg(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      {test: /\.(jpeg(\?.*)?)$/,  loaders: ["url?limit=10000"]},
      {test: /\.(png(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      {test: /\.(gif(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      {test: /\.(svg(\?.*)?)$/,   loaders: ["url?limit=10000"]},
      {test: /\.(woff(\?.*)?)$/,  loaders: ["url?limit=100000"]},
      {test: /\.(woff2(\?.*)?)$/, loaders: ["url?limit=100000"]},

      // FILE
      {test: /\.(ttf(\?.*)?)$/, loaders: ["file"]},
      {test: /\.(eot(\?.*)?)$/, loaders: ["file"]},
      {test: /\.(wav(\?.*)?)$/, loaders: ["file"]},
      {test: /\.(mp3(\?.*)?)$/, loaders: ["file"]},

      // HTML
      {test: /\.(html(\?.*)?)$/, loaders: ["html"]},

      // MARKDOWN
      {test: /\.(md(\?.*)?)$/, loaders: ["html", "markdown"]},

      // CSS
      {test: /\.(css(\?.*)?)$/, loader: ExtractTextPlugin.extract(`css!${autoprefixer}`)},

      // LESS
      {test: /\.(less(\?.*)?)$/, loader: ExtractTextPlugin.extract(`css!${autoprefixer}!less`)},
    ],
  },

  // Module resolving http://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    // Abs. path with modules
    root: Path.join(__dirname, "/frontend"),

    // node_modules and like that
    modulesDirectories: ["web_modules", "node_modules"],

    // ???
    alias: reduce((memo, dep) => {
      let depPath = Path.resolve(node_modules, dep);
      return assoc(dep.split(Path.sep)[0], depPath, memo);
    }, {}, minifiedDeps),
  },

  // Loader resolving http://webpack.github.io/docs/configuration.html#resolveloader
  resolveLoader: {
    // Abs. path with loaders
    root: Path.join(__dirname, "/node_modules"),
  },

  // Keep bundle dependencies http://webpack.github.io/docs/configuration.html#externals
  //externals: [],

  // Plugins http://webpack.github.io/docs/list-of-plugins.html
  plugins: [
    new Webpack.NoErrorsPlugin(),
    new Webpack.IgnorePlugin(/^vertx$/),
    new Webpack.optimize.UglifyJsPlugin({mangle: {except: ["$", "window", "document", "console"]}}),
    new ExtractTextPlugin("bundle.css"), // ?[contenthash]
  ],

  /*plugins: [
    function () {
      this.plugin("done", function (stats) {
        let jsonStats = stats.toJson({
          chunkModules: true,
          exclude: [
            /node_modules[\\\/]react(-router)?[\\\/]/,
            /node_modules[\\\/]items-store[\\\/]/
          ]
        });
        jsonStats.publicPath = "/public/";
        require("fs").writeFileSync(__dirname + "/public/stats.json", JSON.stringify(jsonStats));
      });
    },
    //new Webpack.PrefetchPlugin("react"),
    //new Webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
    //new Webpack.DefinePlugin({
    //  "process.env": {
    //    NODE_ENV: JSON.stringify("production")
    //  }
    //}),
  ],*/

  // CLI mirror http://webpack.github.io/docs/configuration.html#devserver
  /*devServer: {
    stats: {
      cached: false,
      exclude: [
        /node_modules[\\\/]react(-router)?[\\\/]/,
        /node_modules[\\\/]items-store[\\\/]/
      ]
    }
  }*/

  // Include polyfills or mocks for various node stuff http://webpack.github.io/docs/configuration.html#node
  node: {
    // Required to include Joi
    net: "empty",
    dns: "empty",
  },

  //postcss: [
  //  autoprefixer({ browsers: ["> 5%"] })
  //],
};
