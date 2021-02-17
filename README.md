## Running the app

    $ make run

And see it running on http://localhost:3000!

## Development

    make fix
    make check

## Installing on Raspberry Pi

    # Follow the instructions here: https://github.com/jfly/jpi#basic-arch
    ssh alarm@alarmpi
    echo "ramscan" > /etc/hostname
    sudo reboot

    ssh alarm@ramscan
    sudo pacman -S sane

    sudo scanimage -L  # confirm that you see your printer listed

    # Fixup scanner permissions (from https://wiki.archlinux.org/index.php/SANE#Permission_problem)
    sudo pacman -S usbutils
    sudo usermod -a -G scanner alarm
    sudo usermod -a -G lp alarm

    scanimage -L  # confirm that you still see your printer listed

    # Install + configure misc stuff
    sudo pacman -S nodejs npm nginx vim tmux rsync imagemagick
    sudo systemctl start nginx && sudo systemctl stop nginx  # needed to create the various /var/lib/nginx/* directories nginx needs
    sudo vim /etc/locale.gen  # uncomment en_US.UTF-8 UTF-8
    sudo locale-gen

    # Install + start up docker
    sudo pacman -S docker
    sudo systemctl enable --now docker.service

    # Clone ramscan
    # Create ramscan directory
    sudo mkdir /ramscan
    sudo chown alarm:alarm /ramscan
    make deploy

    # Set up samba share of the /uploads directory
    sudo pacman -S samba
    echo | sudo tee /etc/samba/smb.conf <<EOF
# This is the main Samba configuration file. You should read the
# smb.conf(5) manual page in order to understand the options listed
# here. Samba has a huge number of configurable options (perhaps too
# many!) most of which are not shown in this example
#
# For a step to step guide on installing, configuring and using samba,
# read the Samba-HOWTO-Collection. This may be obtained from:
#  http://www.samba.org/samba/docs/Samba-HOWTO-Collection.pdf
#
# Many working examples of smb.conf files can be found in the
# Samba-Guide which is generated daily and can be downloaded from:
#  http://www.samba.org/samba/docs/Samba-Guide.pdf
#
# Any line which starts with a ; (semi-colon) or a # (hash)
# is a comment and is ignored. In this example we will use a #
# for commentry and a ; for parts of the config file that you
# may wish to enable
#
# NOTE: Whenever you modify this file you should run the command "testparm"
# to check that you have not made any basic syntactic errors.
#
#======================= Global Settings =====================================
[global]

# workgroup = NT-Domain-Name or Workgroup-Name, eg: MIDEARTH
   workgroup = WORKGROUP

# server string is the equivalent of the NT Description field
   server string = ramscan

# From: https://wiki.archlinux.org/index.php/samba#Creating_a_share
#   > Note: To allow the usage of guests on public shares, one will need to append map to guest = Bad User in the [global] section of /etc/samba/smb.conf. A different guest account may be used instead of the default provided nobody.
   map to guest = Bad User

# Server role. Defines in which mode Samba will operate. Possible
# values are "standalone server", "member server", "classic primary
# domain controller", "classic backup domain controller", "active
# directory domain controller".
#
# Most people will want "standalone server" or "member server".
# Running as "active directory domain controller" will require first
# running "samba-tool domain provision" to wipe databases and create a
# new domain.
   server role = standalone server

# This option is important for security. It allows you to restrict
# connections to machines which are on your local network. The
# following example restricts access to two C class networks and
# the "loopback" interface. For more examples of the syntax see
# the smb.conf man page
;   hosts allow = 192.168.1. 192.168.2. 127.

# Uncomment this if you want a guest account, you must add this to /etc/passwd
# otherwise the user "nobody" is used
  guest account = alarm

# this tells Samba to use a separate log file for each machine
# that connects
   logging = syslog

# Put a capping on the size of the log files (in Kb).
   max log size = 50

# Specifies the Kerberos or Active Directory realm the host is part of
;   realm = MY_REALM

# Backend to store user information in. New installations should
# use either tdbsam or ldapsam. smbpasswd is available for backwards
# compatibility. tdbsam requires no further configuration.
;   passdb backend = tdbsam

# Using the following line enables you to customise your configuration
# on a per machine basis. The %m gets replaced with the netbios name
# of the machine that is connecting.
# Note: Consider carefully the location in the configuration file of
#       this line.  The included file is read at that point.
;   include = /usr/local/samba/lib/smb.conf.%m

# Configure Samba to use multiple interfaces
# If you have multiple network interfaces then you must list them
# here. See the man page for details.
;   interfaces = 192.168.12.2/24 192.168.13.2/24

# Where to store roving profiles (only for Win95 and WinNT)
#        %L substitutes for this servers netbios name, %U is username
#        You must uncomment the [Profiles] share below
;   logon path = \\%L\Profiles\%U

# Windows Internet Name Serving Support Section:
# WINS Support - Tells the NMBD component of Samba to enable it's WINS Server
;   wins support = yes

# WINS Server - Tells the NMBD components of Samba to be a WINS Client
#	Note: Samba can be either a WINS Server, or a WINS Client, but NOT both
;   wins server = w.x.y.z

# WINS Proxy - Tells Samba to answer name resolution queries on
# behalf of a non WINS capable client, for this to work there must be
# at least one	WINS Server on the network. The default is NO.
;   wins proxy = yes

# DNS Proxy - tells Samba whether or not to try to resolve NetBIOS names
# via DNS nslookups. The default is NO.
   dns proxy = no

# These scripts are used on a domain controller or stand-alone
# machine to add or delete corresponding unix accounts
;  add user script = /usr/sbin/useradd %u
;  add group script = /usr/sbin/groupadd %g
;  add machine script = /usr/sbin/adduser -n -g machines -c Machine -d /dev/null -s /bin/false %u
;  delete user script = /usr/sbin/userdel %u
;  delete user from group script = /usr/sbin/deluser %u %g
;  delete group script = /usr/sbin/groupdel %g


#============================ Share Definitions ==============================
[homes]
   comment = Home Directories
   browseable = no
   writable = no

# A publicly accessible directory, read/write to all users. Note that all files
# created in the directory by users will be owned by the default user, so
# any user with access can delete any other user's files. Obviously this
# directory must be writable by the default user. Another user could of course
# be specified, in which case all files would be owned by that user instead.
[ramscan]
   comment = Ramscan uploads
   path = /ramscan/uploads
   public = yes
   only guest = yes
   writable = yes
   printable = no
EOF
    sudo systemctl enable --now smb.service
    sudo systemctl enable --now nmb.service

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
After=docker.service
Requires=docker.service

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
