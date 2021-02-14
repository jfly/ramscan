## Running the app

    $ make run

And see it running on http://localhost:3000!

## Development

    make fix
    make check

## Installing on Raspberry Pi

    # Follow the instructions here: https://github.com/jfly/jpi#basic-arch
    ssh -A alarm@alarmpi

    sudo pacman -S sane

    sudo scanimage -L  # confirm that you see your printer listed

    # Fixup scanner permissions (from https://wiki.archlinux.org/index.php/SANE#Permission_problem)
    sudo pacman -S usbutils
    sudo usermod -a -G scanner alarm
    sudo usermod -a -G lp alarm

    scanimage -L  # confirm that you still see your printer listed

    # Install + configure misc stuff
    sudo pacman -S nodejs npm nginx git vim tmux
    sudo systemctl start nginx && sudo systemctl stop nginx  # needed to create the various /var/lib/nginx/* directories nginx needs
    sudo vim /etc/locale.gen  # uncomment en_US.UTF-8 UTF-8
    sudo locale-gen

    # Clone ramscan
    git clone git@github.com:jfly/ramscan.git

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
    sudo sed -i 's/^net$/#<<< net/' /etc/scanbd/sane.d/dll.conf  # comment out 'net'

    # 3. jfly specific hacks
    #    For whatever reason, enabling the services doesn't work. Instead I:
    #      - Change user to `root` in /etc/scanbd/scanbd.conf
    #      - Change `debug-level` to `2` in /etc/scanbd/scanbd.conf
    #      - Change `script = "/home/alarm/ramscan/scripts/scanbd-action.sh"` in /etc/scanbd/scanner.d/pixma.conf

    # 4. Set up ramscan to start on boot
    echo '[Unit]
Description=Start up ramscan tmux session

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/home/alarm/ramscan/scripts/run.sh
ExecStop=/usr/bin/tmux kill-server ramscan
KillMode=none
User=alarm
Group=alarm


[Install]
WantedBy=multi-user.target' | sudo tee /etc/systemd/system/ramscan.service
    sudo systemctl enable --now ramscan.service

To debug, attach to the running tmux process using `tmux attach -t ramscan`.

## TODO - integrate

    meteor bundle ~/tmp/ramscan-bundled  # use meteor build instead?
    scp ~/tmp/ramscan-bundled alarm@alarmpi:
    ssh alarm@alarmpi
    tar xvf ramscan-bundled

    sudo pacman -S docker
    sudo systemctl enable --now docker
    sudo docker run -it ubuntu:20.04
    # https://developer.mongodb.com/how-to/mongodb-on-raspberry-pi/
        apt-get update
        apt-get install wget gnupg2
        wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" > /etc/apt/sources.list.d/mongodb-org-4.4.list
        apt-get update
        apt-get install -y mongodb-org


    # install mongodb (https://aur.archlinux.org/packages/mongodb-bin/)
    # =( =( https://archlinuxarm.org/forum/viewtopic.php?f=15&t=14481
    # https://stackoverflow.com/a/31466503/1739415
