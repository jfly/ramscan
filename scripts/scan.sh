#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "Error: Must specify an output file!" > /dev/stderr
    exit 1
fi

__output_file="$1"

__tmp_file=/tmp/scan.tmp

echo "0%"
sleep 1
echo "10%"

wget -O "$__tmp_file" -q https://picsum.photos/1200/600

echo "50%"
sleep 1
echo "60%"
sleep 1
echo "100%"
mv "$__tmp_file" "$__output_file"
