SHELL := /bin/bash
PATH  := node_modules/.bin:${PATH}

default: lint test phantom browser

name    = "hub-namespace"
tests   = ./test/test-*
html    = test/all.html
main    = $(shell node -p "require('./package.json').main")
version = $(shell node -p "require('./package.json').version")
folder  = ${name}-${version}


lint:
	@autolint --once

.PHONY: test
test:
	@node -e "require('urun')('test');"

phantom:
	@echo "Browserify tests | phantomic"
	@browserify ${tests} | phantomic

browser:
	@echo "Consolify tests > file://`pwd`/${html}"
	@consolify -o ${html} ${tests} browser-reload

package: default
	@browserify ${main} -s ${name} -o ${name}.js
	@uglifyjs ${name}.js > ${name}.min.js

release:
ifeq (v${version},$(shell git tag -l v${version}))
	@echo "Version ${version} already released!"
	@exit 1
endif
	@make
	@echo "Creating tag v${version}"
	@git tag -a -m "Release ${version}" v${version}
	@git push --tags
	@echo "Publishing to npm"
	@npm publish
