#!/usr/bin/env bash

npm install

mkdir -p ./dist/node
babel -d ./src ./dist/node

mkdir -p ./dist/browser
browserify --require ./src/main.js:doodle --outfile dist/browser/main.js --transform babelify --debug
