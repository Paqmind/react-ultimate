#!/bin/sh

NODE_ENV=production

# Go to project folder
cd ~/twitto.paqmind.com

# Run git pull
git pull

# Run gulp prod
gulp prod

# Go to home folder
cd ~

# TODO restart node.js service
