## Running the app

    $ make run

And see it running on http://localhost:3000!

## Development

    make fix
    make check

## Installing on Raspberry Pi

    # Follow the instructions here: https://github.com/jfly/jpi#basic-arch
    ssh alarm@alarmpi

    sudo pacman -S sane

    sudo scanimage -L  # confirm that you see your printer listed

    # Fixup scanner permissions (from https://wiki.archlinux.org/index.php/SANE#Permission_problem)
    sudo pacman -S usbutils
    sudo usermod -a -G scanner alarm
    sudo usermod -a -G lp alarm

    scanimage -L  # confirm that you still see your printer listed

    # Install + configure misc stuff
    sudo pacman -S nodejs npm nginx vim tmux rsync
    sudo systemctl start nginx && sudo systemctl stop nginx  # needed to create the various /var/lib/nginx/* directories nginx needs
    sudo vim /etc/locale.gen  # uncomment en_US.UTF-8 UTF-8
    sudo locale-gen

    # Install + start up docker
    sudo pacman -S docker
    sudo systemctl enable --now docker

    # Clone ramscan
    # Create ramscan directory
    sudo mkdir /ramscan
    sudo chown alarm:alarm /ramscan
    make deploy

    # Set up scanbd
    # Modified instructions from https://wiki.archlinux.org/index.php/Scanner_Button_Daemon.
    # 1. Install scanbd. The aur package doesn't work on armv7h, but you can just
    #    edit the `arch=` array: https://aur.archlinux.org/packages/scanbd/
    sudo pacman -S wget base-devel
    mkdir aur; cd aur
    wget https://aur.archlinux.org/cgit/aur.git/snapshot/scanbd.tar.gz
    tar xf scanbd.tar.gz
    cd scanbd
    sed -i "s/arch=('x86_64')/arch=('aarch64')/" PKGBUILD  # The aur package doesn't say it works on aarch64, but it does ;)
    makepkg -s
    sudo pacman -U scanbd-1.5.1-5-aarch64.pkg.tar.xz  # something like this, the version might be different

    # 2. Copy + edit conf files
    sudo cp -r /etc/sane.d/* /etc/scanbd/sane.d/
    echo 'net' | sudo tee /etc/sane.d/dll.conf  # remove everything but 'net'
    echo 'connect_timeout = 3

localhost # scanbm is listening on localhost' | sudo tee /etc/sane.d/net.conf
sudo sed -i 's/^net$/# net # Commented out for scandb/' /etc/scanbd/sane.d/dll.conf # comment out 'net'

    # 3. jfly specific hacks
    #    For whatever reason, enabling the services doesn't work. Instead I:
    #      - Change user to `root` in /etc/scanbd/scanbd.conf
    #      - Change `debug-level` to `2` in /etc/scanbd/scanbd.conf
    #      - Change `script = "/ramscan/scripts/scanbd-action.sh"` in /etc/scanbd/scanner.d/pixma.conf

    # 4. Set up ramscan to start on boot
    echo '[Unit]

Description=Start up ramscan tmux session

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/ramscan/scripts/run.sh
ExecStop=/usr/bin/tmux kill-server ramscan
KillMode=none
User=alarm
Group=alarm

[Install]
WantedBy=multi-user.target' | sudo tee /etc/systemd/system/ramscan.service
sudo systemctl enable --now ramscan.service

To debug, attach to the running tmux process using `tmux attach -t ramscan`.
