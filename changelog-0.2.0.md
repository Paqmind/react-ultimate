Upgraded dependencies and fixed some app code

1. Upgrade Node.js to v6.11.0 incl NPM 3.10.10
  Download from website and run the installer
2. Edit package.json:
  "version": "0.2.0",
  "node": "6.11.0",
  "npm": "3.10.10"
3. npm installed webpack and webpack-dev-server compatible versions
4. npm installed ramda and js-base64 (npm run webpack-server now reaches to config issues)
5. Fixed webpack.server.js 
6. run "npm run webpack-server" and find the other deps missing:
  npm install --save react
  npm install --save react-dom
  npm install --save babel-core
  npm install --save babel-loader
  npm install --save babel-preset-es2015
  npm install --save babel-preset-react
  npm install --save babel-plugin-transform-class-properties
  npm install --save babel-plugin-transform-decorators-legacy
  npm install --save babel-plugin-transform-object-assign
  npm install --save babel-plugin-transform-object-rest-spread
  npm install --save babel-polyfill
  npm install --save babel-preset-react
  npm install --save babel-preset-latest
  npm install --save babel-preset-stage-0
  npm install --save babel-preset-stage-1
  npm install --save babel-preset-stage-2
  npm install --save babel-preset-stage-3
  npm install --save baobab
  npm install --save baobab-react
  npm install --save react-document-title
  npm install --save react-hot-loader
  npm install --save react-proxy-loader
  npm install --save react-router
  npm install --save paqmind.data-lens
  npm install --save paqmind.tcomb-lens
  npm install --save tcomb
  npm install --save tcomb-validation

  npm install --save autoprefixer-loader //deprecated use postcss-loader instead
  npm install --save axios
  npm install --save body-parser
  npm install --save bootstrap
  npm install --save bootstrap-ext
  npm install --save classnames
  npm install --save compression
  npm install --save cookie-parser
  npm install --save css-loader
  npm install --save deep-merge
  npm install --save emailjs
  npm install --save event-stream
  npm install --save express
  npm install --save extract-text-webpack-plugin
  npm install --save faker
  npm install --save file-loader
  npm install --save flat
  npm install --save font-awesome
  npm install --save glob
  npm install --save html-loader
  npm install --save json-loader
  npm install --save json5
  npm install --save json5-loader
  npm install --save less
  npm install --save less-loader
  npm install --save lodash.debounce
  npm install --save lodash.throttle
  npm install --save marked
  npm install --save mkdirp
  npm install --save moment
  npm install --save morgan
  npm install --save node-uuid        //deprecated use uuid instead
  npm install --save nunjucks
  npm install --save raw-loader
  npm install --save readable-stream
  npm install --save style-loader
  npm install --save url-loader
  npm install --save util
  npm install --save winston
  npm install --save winston-mail
  npm install --save yargs
  npm install --save babel-eslint
  npm install --save chai
  npm install --save cldr-data
  npm install --save eslint
  npm install --save mocha
  npm install --save nodemon

  plus:
  npm install --save react-addons-test-utils
7.  Removed baobab-react v2.1.2 and installed  v1.0.1 to remove its related webpack errors
8. To fix less webpack issue: changed the module.rules for less in webpack.server.js
9. Fixed react/addons issue: installed the addons bit and updated webpack, plus npm install --save react-transition-group and update the import
10. Webpack compiled successfully :D
11. Fixing the npm start (backend) -- react-router downgraded and changed reactDOM code because react has changed significantly
12. There are various console errors related to propTypes - this is because react-router is old, because upgrading broke the app
13. There are various ReactCSSTransitionGroup console errors - this is because the main <app> component doesnt include transitions.. i couldnt figure out how to fix it after adding them
13. frontend-components-detail-robot.js fixed a react component issue where item.assemblyDate was an object and replaced it with a toString()
14. common-validation.js fixed a "validateData not a function" issue by chagning the exports line, old code is commented out.
15. Mocha tests:
      npm install --save assert
      Couldnt fix the 15 outstanding failed tests