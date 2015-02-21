#!/bin/sh
# Replace gulp interpeter to 6to5-node
if [[ `uname` == 'Darwin' ]]; then
  gulp_file=`which gulp | xargs greadlink -f`
else
  gulp_file=`which gulp | xargs readlink -f`
fi
sed '1 s/node/babel-node/' ${gulp_file} > ~/.temp/gulp.js
mv ~/.temp/gulp.js ${gulp_file}
chmod +x ${gulp_file}
