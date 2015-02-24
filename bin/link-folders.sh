#!/bin/sh
mkdir -p ./node_modules
rm -f ./node_modules/shared
rm -f ./node_modules/frontend
rm -f ./node_modules/backend
ln -s ../shared       ./node_modules/shared
ln -s ../frontend/app ./node_modules/frontend
ln -s ../backend      ./node_modules/backend

mkdir -p ./build/node_modules
rm -f ./build/node_modules/shared
rm -f ./build/node_modules/frontend
rm -f ./build/node_modules/backend
ln -s ../shared       ./build/node_modules/shared
ln -s ../frontend/app ./build/node_modules/frontend
ln -s ../backend      ./build/node_modules/backend
