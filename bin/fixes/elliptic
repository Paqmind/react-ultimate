#!/bin/sh
# Fix **elliptic** strange import bug
elliptic_file=node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic.js
sed 's/elliptic.version = .*;/elliptic.version = "x";/' ${elliptic_file} > ~/.temp/elliptic.js
mv ~/.temp/elliptic.js ${elliptic_file}
chmod +x ${elliptic_file}
