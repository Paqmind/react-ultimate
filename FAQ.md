# FAQ

### Free port after manual kill

```
$ lsof -i :$PORT -- set desired port, e.g. 3000
$ kill $PID -- set discovered PID, e.g. 2227
```
