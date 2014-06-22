build: test
	@./node_modules/.bin/component build

test:
	@./node_modules/.bin/mocha

clean:
	rm -fr build components node_modules

.PHONY: clean test
