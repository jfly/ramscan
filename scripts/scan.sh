#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "Error: Must specify an output file!" > /dev/stderr
    exit 1
fi

__output_file="$1"

__tmp_file=/tmp/scan.tmp


function fakeit() {
    printf "Progress: 0%%"
    sleep 1
    printf "\rProgress: 10%%"

    wget -O "$__tmp_file" -q https://picsum.photos/1200/600

    printf "\rProgress: 50%%"
    sleep 1
    printf "\rProgress: 60%%"
    sleep 1
    printf "\rProgress: 100%%"
}

function scanit() {
    DEVICE=pixma:04A91913_4B6895
    scanimage --device "$DEVICE" --format=jpeg --output-file "$__tmp_file" --resolution 300 --progress
}

# fakeit
scanit
mv "$__tmp_file" "$__output_file"
