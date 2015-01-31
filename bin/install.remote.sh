#!/bin/sh

# Go to project folder
cd ~/twitto.paqmind.com

# Source functions
source ./bin/functions.sh

# Install global dependencies
if [ $(npm_package_installed marked -g) == 0 ]; then
  npm install marked -g
fi
if [ $(npm_package_installed nodemon -g) == 0 ]; then
  npm install nodemon -g
fi
if [ $(npm_package_installed gulp -g) == 0 ]; then
  npm install gulp -g
fi
if [ $(npm_package_installed 6to5 -g) == 0 ]; then
  npm install 6to5 -g
fi
if [ $(npm_package_installed bower -g) == 0 ]; then
  npm install bower -g
fi

# Replace gulp interpeter to 6to5-node
if [[ `uname` == 'Darwin' ]]; then
  gulp_file=`which gulp | xargs greadlink -f`
else
  gulp_file=`which gulp | xargs readlink -f`
fi
sed '1 s/node/6to5-node/' ${gulp_file} > /tmp/gulp.js
mv /tmp/gulp.js ${gulp_file}
chmod +x ${gulp_file}

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

# Fix **elliptic** strange import bug
elliptic_file=node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic.js
sed 's/elliptic.version = .*;/elliptic.version = "x";/' ${elliptic_file} > /tmp/elliptic.js
mv /tmp/elliptic.js ${elliptic_file}

# Run gulp prod
gulp prod

# Go to home folder
cd ~
