#!/usr/bin/env bash

npm install

mkdir -p ./dist
browserify --require ./src/index.js:doodle --outfile dist/index.js --transform babelify
browserify --require ./src/index.js:doodle --require ./src/demo.js:demo --outfile dist/demo.js  --transform babelify
