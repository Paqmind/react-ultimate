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

We experimented with most popular libs: [ImmutableJS](https://github.com/facebook/immutable-js), [Mori](https://github.com/swannodette/mori)
and [Seamless-Immutable](https://github.com/rtfeldman/seamless-immutable).
We tried our best, but the resulting code was really messy and bug-prone all the time.
So we decided to switch to [Ramda](http://ramdajs.com/) which is API incompatible with all of them
above. It does not enforce immutability, but encourage it, having zero mutable operations in toolkit.

### Builds

Webpack TODO describe

### Live and Hot Reloads

TODO describe

## Architecture in Depth

Read this only after a look on the code.

### URL-bound vs URL-unbound components

All stateful components can be divided to URL-bound and URL-unbound.
By definition, state of URL-bound components can be changed through URL.
It allows to bookmark and share page link and reproduce expectable state by
just entring page.

There is no namespacing in URL (we could add one, but URL is rather short for that sort of things,
and we want to keep JSON API format in client for simplicity) that's why the possible number of URL-bound
components is limited to one per page.

Another tradeoff is that new URL means `ReactRouter.run` is triggered
which means redraw of the Root component which hurts rendering performance ().

To sum up: make primary (content) components either URL-bound or URL-unbound depending
on your business priorities. Secondary components will always be URL-unbound.

## Wiki

See [wiki](https://github.com/Paqmind/react-starter/wiki/Workflow) for more information.
