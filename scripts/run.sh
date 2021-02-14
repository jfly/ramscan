#!/usr/bin/env bash

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


start_tmux ramscan \
    scanbd "SANE_CONFIG_DIR=/etc/scanbd/sane.d/ sudo -E scanbd -f -c /etc/scanbd/scanbd.conf" \
    meteor "echo TODO: run meteor here"
