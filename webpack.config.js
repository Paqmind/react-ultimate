// IMPORTS =========================================================================================
import Path from "path";
import Webpack from "webpack";

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
    filename: "[name].js",

    // Web path (used to prefix URLs) http://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "http://localhost:2992/public/",

    // ??? http://webpack.github.io/docs/configuration.html#output-chunkfilename
    //chunkFilename: "[id].js", // TODO need?

    // ??? http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
    sourceMapFilename: "debugging/[file].map",

    // ??? http://webpack.github.io/docs/configuration.html#output-librarytarget
    //libraryTarget: undefined,

    // Include pathinfo in output (like `require(/*./test*/23)`) http://webpack.github.io/docs/configuration.html#output-pathinfo
    pathinfo: true,
  },

  // Debug mode http://webpack.github.io/docs/configuration.html#debug
  debug: true,

  // Enhance debugging http://webpack.github.io/docs/configuration.html#devtool
  devtool: "source-map",

  // Capture timing information http://webpack.github.io/docs/configuration.html#profile
  //profile: true,

  // Module http://webpack.github.io/docs/configuration.html#module
  module: {
    loaders: [ // http://webpack.github.io/docs/loaders.html
      // JS
      {test: /\.(js(\?.*)?)$/, loaders: ["babel?stage=0"], exclude: /node_modules/ }, // ["react-hot", "babel"]     ????
    ],
  },

  // Module resolving http://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    // Abs. path with modules
    root: Path.join(__dirname, "/frontend"),

    // node_modules and like that
    modulesDirectories: ["web_modules", "node_modules"],
  },

  // Loader resolving http://webpack.github.io/docs/configuration.html#resolveloader
  resolveLoader: {
    // Abs. path with loaders
    root: Path.join(__dirname, "/node_modules"),

    alias: {},
  },

  // Keep bundle dependencies http://webpack.github.io/docs/configuration.html#externals
  //externals: [],

  // Plugins http://webpack.github.io/docs/list-of-plugins.html
  plugins: [
    new Webpack.IgnorePlugin(/^vertx$/),
  //  new Webpack.IgnorePlugin(/^dns$/),
  //  new Webpack.IgnorePlugin(/^net$/),
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
        jsonStats.publicPath = "http://localhost:2992/public/";
        require("fs").writeFileSync(__dirname + "/public/stats.json", JSON.stringify(jsonStats));
      });
    },
    //new Webpack.PrefetchPlugin("react"),
    //new Webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
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
  }
};
