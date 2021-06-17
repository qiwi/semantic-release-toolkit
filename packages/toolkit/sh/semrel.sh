#!/usr/bin/env bash

cd $(dirname "$0")/..

npm exec -- semantic-release "$@"
