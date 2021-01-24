## Running the app

    $ make run

And see it running on http://localhost:3000!

# Scanner buttons

followed instructions on https://wiki.archlinux.org/index.php/Scanner_Button_Daemon
ignored issue with cp
had to change user to `root` in /etc/scanbd/scanbd.conf
# SANE_CONFIG_DIR=/etc/scanbd/sane.d/ scanbd -f -c /etc/scanbd/scanbd.conf
also had to tweak /etc/scanbd/scanner.d/pixma.conf to have absolute path to script
relevant env var: $$SCANBD_ACTION
...
# SANE_CONFIG_DIR=/etc/scanbd/sane.d scanbm -c /etc/scanbd/scanbd.conf
## put `curl -i -X POST localhost:3000/api/v1/scan` in /etc/scanbd/example.script
# SANE_CONFIG_DIR=/etc/scanbd/sane.d/ scanbd -f -c /etc/scanbd/scanbd.conf


## Development

    make fix
    make check

## Notes

-   https://github.com/wix/react-native-interactable / https://github.com/arqex/react-interactable look nice, but also seem to be recently abandonded =(
-   https://github.com/pmndrs/react-use-gesture looks active
-   https://github.com/bmcmahen/react-gesture-responder
