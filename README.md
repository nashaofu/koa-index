# koa-index

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Serve directory listings for Koa

## Install

[![NPM](https://nodei.co/npm/koa-index.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koa-index/)

## Screenshot

![screenshot](./screenshot.png)

## Usage

```ts
import Koa from 'koa'
import path from 'path'
import koaIndex from 'koa-index'

const app = new Koa()

app.use(
  koaIndex(__dirname, {
    hidden: true
  })
)

app.listen(8080)
```

## API

```ts
interface IOpts {
  index?: string | boolean
  directory?: boolean
  maxAge?: number
  lastModified?: boolean
  etag?: boolean
  hidden?: boolean
}

koaIndex(root: string, opts?: IOpts)
```

### Options

- **index**: Default file name, defaults to `index.html`
- **directory**: Support directory send, defaults to `true`
- **maxAge**: cache control max age (in milliseconds) for the files, default to `0`
- **lastModified**: Enable or disable Last-Modified header, defaults to `true`
- **etag**: Enable or disable etag generation, defaults to `true`
- **hidden**: Display hidden (dot) files. Defaults to `false`

## License

MIT
