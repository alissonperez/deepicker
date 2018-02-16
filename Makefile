PKG:=yarn

help:
	@echo
	@echo "✍🏽  Please use 'make <target>' where <target> is one of the commands below:"
	@echo
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e "s/\\$$//" | sed -e "s/##//"
	@echo

# TODO: Makes a `postpublish` (like) for building a
#       correct deepicker.js external plugin
browser: ## builds what it needs to be built for the browser version
	make build

build: ## builds mainly browser js files
	$(PKG) build

check: lint test

lint: ## lints javascript lines
	$(PKG) lint

serve: ## server our dist for demo file
	cd dist && http-server -p 3000

test: ## runs unit tests
	$(PKG) test

watch: ## watch for ./src/app/ files
	$(PKG) watch
