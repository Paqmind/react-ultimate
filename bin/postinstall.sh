#!/usr/bin/env sh

# Seed code folders (enables absolute paths like `import x from "frontend"`)
ln -sfn ../common   node_modules/common
ln -sfn ../frontend node_modules/frontend
ln -sfn ../backend  node_modules/backend
ln -sfn ../public   node_modules/public
