#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "Error: Must specify an output file!" > /dev/stderr
    exit 1
fi

__output_file="$1"

__tmp_file=/tmp/scan.tmp
wget -O "$__tmp_file" -q --show-progress --progress=bar:force https://picsum.photos/1200/600
mv "$__tmp_file" "$__output_file"
