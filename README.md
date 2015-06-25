# React Ultimate

Tired of **React Starters** reexplaining another helloworld?

Dreamed of something closer to the industry?

Welcome to **React Ultimate** then.

This project aims to provide examples of fundamental Index & CRUD operations, being relatively framework agnostic.
We're trying to build an architecture that may be ported to different frameworks and even languages.
That should be at least possible, if not easy.

A lot of experiments going on here, so it's definitely not a stable package.
But as this is an app, and not a library, a "backward compatibility" issues are inapplicable.
Fork it, tweak it, break it... if you wish.

## Install

```
$ wget https://github.com/Paqmind/react-ultimate/archive/master.zip; unzip master.zip -d react-ultimate; rm master.zip
$ cd react-starter
$ npm install; bin/install
```

## Run

Production
```
$ npm run build
$ npm run node
```

Development
```
$ npm run dev     [terminal #1]
$ npm run nodemon [terminal #2]
```

## Test

All tests
```
npm test
```

Specific tests (`--` is an NPM syntax to pass arguments)
```
npm test -- --grep "api/robots POST"
```

Refer to [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai)
for more details.

## Architecture FAQ

All React starters / tutorials suffer from being oversimplified.
They don't show any architecture (the most complex part), only a basic file layouts at their best.
TodoApps have similar issues: very specific, single page only, unrealistic models (one field),
no backend, no validation, no users, etc. We want to approach this differently – provide application
which is closer to production (not saying enterprise) level.

### Absolute imports

One of the most annoying NodeJS limitation is the absence of absolute imports. By "absolute" we
mean imports relative to the project root or some top-level folder.

Your imports look like `import "foo"` for libraries but turn into `import "../../../../foo";` mess for app code.
It's a well known problem because such statements are very hard to read and support.
They tend to break every time you move files between folder.

Fortunately absolute imports can be emulated with some amount of twist. The requirement here is to keep IDE navigation and autocompletion features working.
Script **bin/install** add symlinks for every project entry point like `frontend` or `backend` in **node_modules**.
Browserify requires to keep `package.json` for every such entrypoint but Webpack is free of this limitation.

This project is 100% relative-imports free.

### Flux vs Baobab

We don't use Flux. Check [this](https://github.com/acdlite/flummox/issues/63) and
[this](http://christianalfoni.github.io/javascript/2015/02/06/plant-a-baobab-tree-in-your-flux-application.html)
for a shallow answer to *why*.

### Immutable

We experimented with most popular libs: [ImmutableJS](https://github.com/facebook/immutable-js), [Mori](https://github.com/swannodette/mori)
and [Seamless-Immutable](https://github.com/rtfeldman/seamless-immutable).
We tried our best, but the resulting code was really messy and bug-prone all the time.
So we decided to switch to [Ramda](http://ramdajs.com/) which is API incompatible with all of the
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
