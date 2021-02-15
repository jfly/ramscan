#!/usr/bin/env bash

function log() {
    logger -t "scanbd: $0" "$1"
    echo "$1"
}
log "Begin of $SCANBD_ACTION ($SCANBD_TARGET) for device $SCANBD_DEVICE"

curl -i -X POST localhost:80/api/v1/scan

log "End of $SCANBD_ACTION ($SCANBD_TARGET) for device $SCANBD_DEVICE"
