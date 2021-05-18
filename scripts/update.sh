#!/usr/bin/env bash

npm run build
git tag -d v1.0
git push --delete origin v1.0
git add .
git commit -m "update"
git tag v1.0
