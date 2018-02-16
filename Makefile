PKG:=yarn

help:
	@echo
	@echo "✍🏽  Please use 'make <target>' where <target> is one of the commands below:"
	@echo
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e "s/\\$$//" | sed -e "s/##//"
	@echo

browser: build

build: ## builds mainly browser js files
	$(PKG) build

clean:
	rm -rf dist/

check: lint test

lint: ## lints javascript lines
	$(PKG) lint

start: ## clear dist and install dependencies
	make clean
	$(PKG) --dev

test: ## runs unit tests
	$(PKG) test

watch: ## watch for ./src/app/ files
	$(PKG) watch
