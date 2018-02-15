PKG:=yarn

help:
	@echo
	@echo "✍🏽  Please use 'make <target>' where <target> is one of the commands below:"
	@echo
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e "s/\\$$//" | sed -e "s/##//"
	@echo

lint: ## lints javascript lines
	$(PKG) lint

prepare: lint test ## checks if a commit can be created

test: ## runs unit tests
	$(PKG) test
