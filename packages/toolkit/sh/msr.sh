#!/usr/bin/env bash

cd $(dirname "$0")/..

npm exec -- multi-semantic-release "$@"
