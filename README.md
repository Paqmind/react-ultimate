# React Ultimate

Tired of **React Starters** reexplaining another hello-world?

Dreamt of something closer to the industry?

Welcome to **React Ultimate** then.

[Demo instance](http://react-starter.paqmind.com/) (may be outdated to GitHub version).

## Install

```
$ wget https://github.com/Paqmind/react-starter/archive/master.zip; unzip master.zip -d react-starter; rm master.zip
$ cd react-starter
$ npm install; bower install; bin/install
```

### Temporary workaround

See https://github.com/Yomguithereal/baobab-react/issues/26
We use a temporary https://github.com/ivan-kleshnin/baobab-react fork to workaround this.

Run this to convert ES6 -> ES5 syntaxes.
```
$ cd node_modules/baobab-react
$ npm run prepublish
$ cd ../../
```

## Run

Production
```
$ npm start
```

Development
```
$ npm run nodemon [terminal-1]
$ npm run dev     [terminal-2]
```

There are a few of react-starters out there. Let's compare.

## Comparison

<table>
<tr>
  <td>Vendor</td>
  <th>Paqmind</th>
  <th>Kriasoft</th>
</tr>
<tr>
  <td>Links</td>
  <th><a href="https://github.com/Paqmind/react-starter">GitHub</a></th>
  <th><a href="https://github.com/kriasoft/react-starter-kit">GitHub</a>, <a href="http://reactjs.kriasoft.com">Demo</a></th>
</tr>
<tr>
  <td>Language</td>
  <th>ES6 (Babel)</th>
  <th>ES6 (Babel)</th>
</tr>
<tr>
  <td>Frontend</td>
  <th>React / Baobab</th>
  <th>React / Flux</th>
</tr>
<tr>
  <td>Backend</td>
  <th>Express</th>
  <th>Express</th>
</tr>
<tr>
  <td>Bundlers</td>
  <th>Gulp, Browserify</th>
  <th>Gulp, Webpack</th>
</tr>
<tr>
  <td>Architecture</td>
  <th>Domain Driven</th>
  <th>Aspect Driven</th>
</tr>
<tr>
  <td>Immutable</td>
  <th>yes</th>
  <th>no</th>
</tr>
<tr>
  <td>Index example</td>
  <th>yes (in progress)</th>
  <th>no</th>
</tr>
<tr>
  <td>CRUD example</td>
  <th>yes</th>
  <th>no</th>
</tr>
<tr>
  <td>Streaming example</td>
  <th>no (in progress)</th>
  <th>no</th>
</tr>
<tr>
  <td>Tests</td>
  <th>–</th>
  <th>Jest (unit), Karma (unit), Protractor (e2e)</th>
</tr>
<tr>
  <td>Additional</td>
  <th>–</th>
  <th>BrowserSync, Flow</th>
</tr>
</table>

## Remarks

### Architecture

All React starters / tutorials suffer from being oversimplified.
They don't show any architecture (the most complex part), only a basic file layouts at their best.
TodoApps have similar issues: very specific, single page only, unrealistic models (one field),
no backend, no validation, no users, etc.
We want to approach this differently – provide application which is close to real-world examples.

We also want to test-n-proof Domain Driven architecture (we are bored of models/controllers/views folders
at the root).

### Relative imports

One of the Node.js biggest fails – the absence of relative imports. Fortunately they can be emulated with
some amount of twist. The requirement here is to keep IDE navigation and autocompletion features working.
Script **bin/linkfolders** symlinks application entry points in **node_modules**. Every such point must contain distinct
**package.json** to be compatible with Browserify expectations. But now you may replace all those
ugly, unreadable, unsupportable relative imports with brand shiny absolute.

### Immutable

[Immutable-js](http://facebook.github.io/immutable-js/docs/#/) is used at backend.
Baobab is incompatible with Immutable.

### Browser Sync (live reload)

TODO

### Browserify vs WebPack.

Not really like both. TODO take a second look at WebPack

### Builds

Despite ES6, builds are quite fast thanks to Watchify, Babelify and parallel execution (spawns).
Only app files are under constant watching. All vendors go to separate bundle.

## Wiki

See [wiki](https://github.com/Paqmind/react-starter/wiki/Workflow) for more information.
