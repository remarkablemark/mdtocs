# mdtocs

[![NPM](https://nodei.co/npm/mdtocs.png)](https://nodei.co/npm/mdtocs/)

[![NPM version](https://img.shields.io/npm/v/mdtocs.svg)](https://www.npmjs.com/package/mdtocs)
[![Build Status](https://github.com/remarkablemark/mdtocs/workflows/build/badge.svg?branch=master)](https://github.com/remarkablemark/mdtocs/actions?query=workflow%3Abuild)
[![Coverage Status](https://coveralls.io/repos/github/remarkablemark/mdtocs/badge.svg?branch=master)](https://coveralls.io/github/remarkablemark/mdtocs?branch=master)

[Markdown](https://wikipedia.org/wiki/Markdown) table of contents generator:

```
mdtocs(string)
```

This library uses [regex](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions) to parse [Markdown headings](https://www.markdownguide.org/basic-syntax/#headings). As a result, edge cases like headings with links and images won't be generated correctly. Inspired by the [blog post](http://b.remarkabl.org/3rgdgCk).

#### Example

```js
const { mdtocs } = require('mdtocs');
mdtocs('# Hello, World!'); // '- [Hello, World!](#hello-world)'
```

[Site](https://b.remarkabl.org/mdtocs) | [Replit](https://replit.com/@remarkablemark/mdtocs) | [JSFiddle](https://jsfiddle.net/remarkablemark/dr03pLxn/)

## Install

[NPM](https://www.npmjs.com/package/mdtocs):

```sh
npm install mdtocs --save
```

[Yarn](https://yarnpkg.com/package/mdtocs):

```sh
yarn add mdtocs
```

[CDN](https://unpkg.com/mdtocs/):

```html
<script src="https://unpkg.com/mdtocs@latest/umd/mdtocs.min.js"></script>
<script>
  window.mdtocs.mdtocs(/* string */);
</script>
```

## Usage

Import module:

```js
// ES Modules
import { mdtocs } from 'mdtocs';

// CommonJS
const { mdtocs } = require('mdtocs');
```

Generate table of contents from Markdown:

```js
mdtocs(`
# Heading 1
## Heading 2
### Heading 3
`);
```

Output:

```md
- [Heading 1](#heading-1)
  - [Heading 2](#heading-2)
    - [Heading 3](#heading-3)
```

If the first argument is not a string, then an error will be thrown:

```js
mdtocs(); // TypeError: First argument must be a string
```

## Testing

Run tests with coverage:

```sh
npm test
```

Run tests in watch mode:

```sh
npm run test:watch
```

Lint files:

```sh
npm run lint
```

Fix lint errors:

```sh
npm run lint:fix
```

## Release

Release is automated with [Release Please](https://github.com/googleapis/release-please).

## License

[MIT](https://github.com/remarkablemark/mdtocs/blob/master/LICENSE)
