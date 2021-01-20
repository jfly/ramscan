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
