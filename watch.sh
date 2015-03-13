#!/usr/bin/env bash

mkdir -p ./dist/browser
watchify --require ./src/main.js:doodle --outfile dist/browser/main.js --transform babelify --debug --debug
