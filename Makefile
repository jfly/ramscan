.PHONY: run
run:
	meteor

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
