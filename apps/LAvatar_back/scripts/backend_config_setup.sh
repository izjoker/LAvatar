#!/usr/bin/env bash

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")"&& cd .. && pwd)"
echo "setting submodule"
git submodule init
echo "init"
git submodule update
echo "update"
git submodule foreach git checkout main
echo "checkout"
mv -r "${__dir}"