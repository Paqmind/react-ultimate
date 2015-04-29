# FAQ

### External vs Internal components

External component's state can be changed through URL.
It allows to bookmark and share page link. Most obvious limitation is that there is no namespacing
in URL (we could add one, but URL is rather short for that sort of things,
and we want to reuse JSON API format on frontend for simplicity).
Another tradeoff is that new URL means `ReactRouter.run` is triggered
which hurts rendering performance (VDOM root redraw).

To sum up: make primary (content) components either external or internal.
Secondary components should be always internal.

### Free port after manual kill

```
$ lsof -i :$PORT -- set desired port, e.g. 3000
$ kill $PID -- set discovered PID, e.g. 2227
```