# React Ultimate

Tired of **React Starters** reexplaining another helloworld?

Dreamed of something closer to the industry?

Welcome to **React Ultimate** then. This project is fairly experimental but we're sure it already
yields a lot of interesting observations. Just give it a try.

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

## Architecture FAQ

All React starters / tutorials suffer from being oversimplified.
They don't show any architecture (the most complex part), only a basic file layouts at their best.
TodoApps have similar issues: very specific, single page only, unrealistic models (one field),
no backend, no validation, no users, etc. We want to approach this differently – provide application
which is closer to production (not saying enterprise) level.

### Flux vs Baobab

We don't use Flux. Check [this](https://github.com/acdlite/flummox/issues/63) and
[this](http://christianalfoni.github.io/javascript/2015/02/06/plant-a-baobab-tree-in-your-flux-application.html)
for a shallow answer to *why*.

### Relative imports

One of the NodeJS biggest fails – the absence of relative imports. Fortunately they can be emulated with
some amount of twist. The requirement here is to keep IDE navigation and autocompletion features working.
Script **bin/linkfolders** symlinks application entry points in **node_modules**. Every such point must contain distinct
**package.json** to be compatible with Browserify expectations. But now you may replace all those
ugly, unreadable, unsupportable relative imports with brand shiny absolute.

### Immutable

We tried to use [Immutable](https://github.com/facebook/immutable-js) and [Mori](https://github.com/swannodette/mori)
but the resulting code was extremely bloated and noisy. The potential for bugs was surely increased rather
than reduced. We still considering [Seamless-Immutable](https://github.com/rtfeldman/seamless-immutable) though.

### Builds

Despite ES6, builds are quite fast thanks to Watchify, Babelify and parallel execution (spawns).
Only app files are under constant watching. All vendors go to separate bundle.

### Browserify vs WebPack.

We're going to switch to WebPack a bit later.

### Browser Sync (live reload)

Will be available with WebPack builds.

## Architecture in Depth

Read this only after a look on the code.

### External vs Internal components

External component's state can be changed through URL.
It allows to bookmark and share page link. Most obvious limitation is that there is no namespacing
in URL (we could add one, but URL is rather short for that sort of things,
and we want to reuse JSON API format on frontend for simplicity).
Another tradeoff is that new URL means `ReactRouter.run` is triggered
which hurts rendering performance (VDOM root redraw).

To sum up: make primary (content) components either external or internal.
Secondary components should be always internal.

## Wiki

See [wiki](https://github.com/Paqmind/react-starter/wiki/Workflow) for more information.
