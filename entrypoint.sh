#!/bin/bash

set -ex

if [ "$1" = 'run' ]; then
    exec yarn start
elif [ "$1" = 'migrate' ]; then
    exec yarn sync
elif [ "$1" = 'migrate_and_run' ]; then
    yarn sync
    exec yarn start
else
    echo "Please specify one of run, migrate, or migrate_and_run"
fi
