# React Starter

There are a few of them. Let's compare.

## Features

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
  <th>React / Reflux</th>
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
  <td>Index</td>
  <th>+ (in progress)</th>
  <th>-</th>
</tr>
<tr>
  <td>CRUD</td>
  <th>+ (in progress)</th>
  <th>-</th>
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

### Browser Sync
No Browser Sync cause it creates more complexity and usability issues than solves.
May break on errors leaving you wondering whether it were updated or not.

### Browserify vs WebPack.
Don't like this [mess](https://github.com/kriasoft/react-starter-kit/blob/master/webpack.config.js).
Trying to stay with Browserify.
