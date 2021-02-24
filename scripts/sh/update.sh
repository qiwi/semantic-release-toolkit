#!/bin/bash

NPM_UPGRADE="npm-upgrade"
PACKAGES=$(cat package.json | jq -r '.workspaces | join(" ")')

eval $NPM_UPGRADE

for f in $PACKAGES; do
  if [ -d "$f" ]; then
     cd $f
     eval $NPM_UPGRADE
  fi
done
