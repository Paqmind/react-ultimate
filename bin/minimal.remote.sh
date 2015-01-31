#!/bin/sh

# Go to project folder
cd ~/minimal.paqmind.com

# Source functions
source ./bin/functions.sh

# Install express-generator if not installed
if [ $(npm_package_installed express-generator -g) == 0 ]; then
  $(npm install express-generator -g)
fi

# Scaffold demo app
express . -f

# Install local packages
npm install

# Run express server with app-level debug
DEBUG=minimal ./bin/www

# Go to home folder
cd ~
