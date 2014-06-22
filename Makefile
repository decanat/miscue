build:
	@./node_modules/.bin/component build

test: build-dev
	@./node_modules/.bin/mocha-phantomjs ./test/index.html

build-dev:
	@./node_modules/.bin/component build \
		--dev \
		--out ./test/ \
		--name main


clean:
	rm -fr build components node_modules

serve: ./test/server.js
	node $^

.PHONY: clean, test
