#!/bin/bash

set -eou pipefail

DOCKERCMD=${DOCKER:-docker}

# build privacypass-lib
git submodule init && git submodule update

$DOCKERCMD build --platform=linux/amd64 -t kagi-privacypass-lib-image privacypass-lib
rm -rf privacypass-lib/build && mkdir -p privacypass-lib/build
$DOCKERCMD run --rm -v "$(pwd)/privacypass-lib/build:/build" kagi-privacypass-lib-image

# build the extension
$DOCKERCMD build --platform=linux/amd64 -t kagi-privacypass-extension-image .
rm -rf build && mkdir -p build
$DOCKERCMD run --rm -v "$(pwd)/build:/build" kagi-privacypass-extension-image
