# Green Earth — Plant a Tree

A responsive, production-ready web app to explore plants, browse categories, view details, and donate to plant trees.

## ES6 Q&A

1) What is the difference between var, let, and const?
- var: Function-scoped or globally scoped, hoisted with initial value undefined, allows re-declaration, can leak outside blocks.
- let: Block-scoped, hoisted without initialization (TDZ), cannot be re-declared in the same scope, can be reassigned.
- const: Block-scoped, hoisted without initialization (TDZ), cannot be re-declared or reassigned; object contents can still mutate.

2) What is the difference between map(), forEach(), and filter()?
- forEach(): Iterates over items for side effects; always returns undefined.
- map(): Transforms each element and returns a new array of the same length with mapped values.
- filter(): Selects elements that pass a predicate and returns a new, possibly shorter array.

3) What are arrow functions in ES6?
- Concise function syntax: const add = (a, b) => a + b;
- Lexically bind this, arguments, super, and new.target; not constructible (no new) and no own this/arguments.
- Enable implicit returns and shorter callbacks.

4) How does destructuring assignment work in ES6?
- Extracts values from arrays/objects into variables using patterns:
  const [x, y = 0] = arr; const { id, name: title, ...rest } = obj;
- Supports defaults, renaming, nested patterns, and rest elements for remaining data.

5) Explain template literals in ES6. How are they different from string concatenation?
- Backtick strings allowing interpolation and multi-line text: `Hello ${name}!`.
- Support tagged templates for custom processing and automatic escaping/sanitization patterns.
- Safer and more readable than "+" concatenation, especially for multi-line and embedded expressions.
