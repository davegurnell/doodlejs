#!/usr/bin/env bash

mkdir -p ./dist
watchify --require ./src/index.js:doodle --require ./src/demo.js:demo --outfile dist/demo.js  --transform babelify --debug
