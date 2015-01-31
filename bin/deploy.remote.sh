#!/bin/sh

# Does not work without it (though this is in loaded ~/.bashrc ...)
source ~/.nvm/nvm.sh

# Install global dependencies
npm install -g marked
npm install -g nodemon
npm install -g gulp
npm install -g 6to5
npm install -g bower

# Replace gulp interpeter to 6to5-node
if [[ `uname` == 'Darwin' ]]; then
  gulpFile=`which gulp | xargs greadlink -f`
else
  gulpFile=`which gulp | xargs readlink -f`
fi
sed '1 s/node/6to5-node/' ${gulpFile} > /tmp/gulp.js
mv /tmp/gulp.js ${gulpFile}
chmod +x ${gulpFile}

# Git init
rm -fr .git
git init
git remote add origin git@github.com:Paqmind/twitto.git
git fetch
git reset --hard origin/master
git branch --set-upstream master origin/master

# Install local dependencies
npm install
bower install

# Fix **globule** outdated dependency (**lodash**): remove to use project-level one
rm -rf node_modules/gulp/node_modules/vinyl-fs/node_modules/glob-watcher/node_modules/gaze/node_modules/globule/node_modules/lodash

# Run gulp prod
gulp prod
