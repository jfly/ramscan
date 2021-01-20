#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "Error: Must specify an output file!" > /dev/stderr
    exit 1
fi

__output_file="$1"

wget -O "$__output_file" -q --show-progress --progress=bar:force https://picsum.photos/1200/600
