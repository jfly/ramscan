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

# This whole pause/unpause thing shouldn't be necessary. scanbm *should*
# automatically do this for us, but I cannot get it working for the life of me:
# https://wiki.archlinux.org/index.php/Scanner_Button_Daemon
function pause_scanbd() {
    sudo kill -s SIGUSR1 "$(pidof scanbd)"
    sleep 0.5
}

function unpause_scanbd() {
    sudo kill -s SIGUSR2 "$(pidof scanbd)"
}

function scanit() {
    pause_scanbd
    trap unpause_scanbd EXIT
    DEVICE=pixma:04A91913_4B6895
    scanimage --device "$DEVICE" --format=jpeg --output-file "$__tmp_file" --resolution 300 --progress
    mogrify -rotate -90 "$__tmp_file"
}

# fakeit
scanit
mv "$__tmp_file" "$__output_file"
