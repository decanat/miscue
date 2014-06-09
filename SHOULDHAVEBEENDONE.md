Now, after making instantiated `Miscue` object to act like `Error` instance with `Miscue#turnError()`, it stops being valid instance of Miscue.

```js
var miscue = new Miscue(201);

miscue instanceof Miscue; // true
miscue instanceof Error; // false

miscue.set(400);

miscue instanceof Error; // true
miscue instanceof Miscue; // false
```

It'd be better if on the second part both statements will return `true`.
