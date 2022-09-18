BOOTSTRAP_FILES=.bootstrapped-npm
.PHONY: bootstrap
bootstrap: $(BOOTSTRAP_FILES)

.bootstrapped-npm:
	meteor npm install
	touch .bootstrapped-npm

clean:
	rm -f $(BOOTSTRAP_FILES)

.PHONY: run
run: bootstrap
	RAMSCAN_FAKE_SCANNER=true npx concurrently --kill-others-on-fail scripts/nginx.sh 'meteor run --port 3001'

.PHONY: check
check: bootstrap
	npx tsc
	npx prettier --loglevel warn --check .
	@echo
	@echo "Check passed"

.PHONY: fix
fix: bootstrap
	npx prettier --loglevel warn --write .
	@echo
	@echo "Done fixing"

.PHONY: deploy
deploy: bootstrap
	meteor bundle ~/tmp/ramscan-bundled.tar.gz  # TODO use meteor build instead?
	scp ~/tmp/ramscan-bundled.tar.gz alarm@ramscan:
	ssh alarm@ramscan "tar xf ramscan-bundled.tar.gz"
	# HACK ALERT: When running `npm install`, it warns:
	#  > The npm-shrinkwrap.json file was created with an old version of npm,
	# It successfully installs everything, but then it goes on to try to update
	# the npm-shrinkwrap.json file, which is read-only, so it crashes.
	# Hopefully with a newer version of meteor, the generated file would be new
	# enough that npm wouldn't feel the need to try to write to the file?
	ssh alarm@ramscan "chmod +w /home/alarm/bundle/programs/server/npm-shrinkwrap.json"
	ssh alarm@ramscan "cd bundle; (cd programs/server && npm install)"
	# Copy over some useful scripts.
	rsync -avP scripts/ alarm@ramscan:/ramscan/scripts/
	# Ensure a books upload folder exists.
	ssh alarm@ramscan "mkdir -p /ramscan/uploads/books"
