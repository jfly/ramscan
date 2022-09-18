#!/usr/bin/env bash

set -e

# Copied from https://github.com/jfly/dotfiles/blob/4503f99aebafb6074521d439fdfc2c88066a74d4/commonrc/aliases#L187
function start_tmux {
    function print_usage {
        echo "Usage: $0 [NAME] [title1] [cmd1] [title2] [cmd2] ..."
    }
    if test $# -eq 0; then
        print_usage > /dev/stderr
        return
    fi
    NAME=$1
    shift
    if test $(( $# % 2 )) -ne 0; then
        echo "You must specify an equal number of titles and commands." > /dev/stderr
        echo "" > /dev/stderr
        print_usage > /dev/stderr
        return
    fi

    tmux new-session -d -s "$NAME" # start tmux

    while test $# -gt 0; do
        TITLE="$1"
        shift
        CMD="$1"$'\n'
        shift
        tmux rename-window -t "$NAME" "$TITLE" # set title of window
        tmux send-keys -t "$NAME" "$CMD" # run command in window
        if test $# -gt 0; then
            tmux new-window -t "$NAME"
        fi
    done
}


cd /ramscan
# Note that we run the main app in a loop because it often starts up before
# mongo, and then crashes while trying to connect to the database. This has a
# side effect of also causing us to restart if the app crashes for any
# reason, which may or may not be useful...

# Note: we're using mongo 4 because mongo 5 dropped support for the flavor of
# arm that the Raspberry Pi 3B+ has:
# https://jira.mongodb.org/browse/SERVER-55178
start_tmux ramscan \
    scanbd "SANE_CONFIG_DIR=/etc/scanbd/sane.d/ sudo -E scanbd -f -c /etc/scanbd/scanbd.conf" \
    mongodb "sudo docker rm -f mongodb && sudo docker run --name mongodb -p 27017:27017 mongo:4.4.11" \
    nginx "PORT=80 sudo -E scripts/nginx.sh" \
    meteor "while true; do RAMSCAN_ROOT=/ramscan MONGO_URL='mongodb://localhost:27017/ramscan' ROOT_URL='http://$(cat /etc/hostname):3000' PORT=3001 node ~/bundle/main.js; sleep 5; done"
