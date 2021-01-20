#!/usr/bin/env bash

DIR=$(dirname "$0")
exec nginx -c nginx.conf -p "$DIR"
