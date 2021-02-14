#!/usr/bin/env bash

DIR=$(realpath $(dirname "$0"))
cd "$DIR"

# Default to port 3000 if not specified.
PORT="${PORT:-3000}"

sed "s/{{ PORT }}/$PORT/" nginx.conf.template > tmp/nginx.conf
exec nginx -c ./tmp/nginx.conf -p "$DIR"
