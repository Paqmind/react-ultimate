#!/bin/sh
mkdir -p ./node_modules
rm -rf ./node_modules/shared
rm -rf ./node_modules/frontend
rm -rf ./node_modules/backend
ln -s ../shared       ./node_modules/shared
ln -s ../frontend/app ./node_modules/frontend
ln -s ../backend/app  ./node_modules/backend

mkdir -p ./build/node_modules
rm -rf ./build/node_modules/shared
rm -rf ./build/node_modules/frontend
rm -rf ./build/node_modules/backend
ln -s ../shared       ./build/node_modules/shared
ln -s ../frontend/app ./build/node_modules/frontend
ln -s ../backend/app  ./build/node_modules/backend
