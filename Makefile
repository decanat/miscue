build: components index.js
	@./node_modules/.bin/component build

components: component.json
	@./node_modules/.bin/component install

clean:
	rm -fr build components

test:
	@./node_modules/.bin/mocha-phantomjs ./test/index.html

serve: ./test/server.js
	node $^

.PHONY: clean, test
