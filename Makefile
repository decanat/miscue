build: components index.js
	@./node_modules/.bin/component build

components: component.json
	@./node_modules/.bin/component install

clean:
	rm -fr build components template.js

test:
	@./node_modules/.bin/mocha-phantomjs ./test/index.html

.PHONY: clean, test
