Upgraded dependencies and fixed some app code due to changes. This works on Node.js to v6.11.0 incl NPM 3.10.10.

Here are the changes made from previous version:

1. Edit package.json:
  "version": "0.2.0",
  "node": "6.11.0",
  "npm": "3.10.10",
  Removed dependencies
2. Installed all dependencies fresh, including replacements where some were deprecated.
3. Rewrote parts of webpack.server.js to meet webpack v2 syntax
4.  Removed baobab-react v2.1.2 and installed  v1.0.1 to remove its related webpack errors
5. Downgraded react-router and changed reactDOM code because react has changed syntax
6. There are various console errors related to propTypes - this is because react-router is old and don't inhibit functionality
7. There are various ReactCSSTransitionGroup console errors - this is because the main <app> component doesnt include transitions and doesn't inhibit functionality
8. frontend-components-detail-robot.js fixed a react component issue where item.assemblyDate was an object and replaced it with a string
9. common-validation.js fixed a "validateData not a function" issue by changing the exports line, old code is commented out.
10. Mocha tests - 15 failing, unsure how to fix them