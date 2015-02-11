#!/bin/sh

# Go to project folder
cd ~/twitto.paqmind.com

# Make temp dir
mkdir -p ~/.temp

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
source ./fixes/gulp.sh

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
source ./fixes/globule.sh

# Fix **elliptic** strange import bug (mismatch of browserify and wathichify version)
#source ./fixes/elliptic.sh TODO no longer required?

# Run gulp prod
gulp prod

# Go to home folder
cd ~
