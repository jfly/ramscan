.PHONY: run
run:
	npx concurrently --kill-others-on-fail scripts/nginx.sh 'meteor run --port 3001'

.PHONY: check
check:
	npx tsc
	npx prettier --loglevel warn --check .
	@echo
	@echo "Check passed"

.PHONY: fix
fix:
	npx prettier --loglevel warn --write .
	@echo
	@echo "Done fixing"

.PHONY: deploy
deploy:
	meteor bundle ~/tmp/ramscan-bundled.tar.gz  # TODO use meteor build instead?
	scp ~/tmp/ramscan-bundled.tar.gz alarm@ramscan:
	ssh alarm@ramscan "tar xf ramscan-bundled.tar.gz; cd bundle; (cd programs/server && npm install)"
	# Copy over some useful scripts.
	rsync -avP scripts/ alarm@ramscan:/ramscan/scripts/
	# Ensure a books upload folder exists.
	ssh alarm@ramscan "mkdir -p /ramscan/uploadsbooks"
