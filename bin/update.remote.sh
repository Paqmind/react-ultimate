#!/bin/sh

NODE_ENV=production

# Go to project folder
cd ~/twitto.paqmind.com

# Pull git branch with "force" semantics
git fetch --all
git reset --hard origin/master

# Update NPM (via install, yes)
npm install
bower install

# Run gulp prod
gulp prod

# Go to home folder
cd ~

# TODO restart node.js service
