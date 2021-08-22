import type { Context } from 'koa'
import fs, { Stats } from 'fs-extra'
import path from 'path'
import etag from 'etag'
import rangeParser from 'range-parser'

export interface SFOpts {
  stat: Stats
  maxAge: number
  lastModified: boolean
  etag: boolean
  hidden: boolean
}

export default async function sendFile (filename: string, ctx: Context, opts: SFOpts): Promise<void> {
  const stat = opts.stat
  const maxAge = (opts.maxAge ?? 0 / 1000) | 0

  ctx.type = path.extname(filename)

  if (!ctx.response.get('Cache-Control')) {
    ctx.set('Cache-Control', `public, max-age=${maxAge}`)
  }
  if (opts.lastModified && !ctx.response.get('Last-Modified')) {
    ctx.set('Last-Modified', stat.mtime.toUTCString())
  }
  if (opts.etag && !ctx.response.get('ETag')) {
    ctx.set('ETag', etag(stat, { weak: true }))
  }

  // range header支持
  const range = ctx.get('range')

  if (typeof range === 'string' && range) {
    const ranges = rangeParser(stat.size, range, {
      combine: true
    })

    // unsatisfiable
    if (ranges === -1) {
      // Content-Range
      ctx.set('Content-Range', `bytes */${stat.size}`)

      // 416 Requested Range Not Satisfiable
      ctx.throw(416)
      return
    }

    // valid (syntactically invalid/multiple ranges are treated as a regular response)
    if (ranges !== -2 && ranges.length === 1) {
      // Content-Range
      ctx.status = 206
      const start = ranges[0].start
      const end = ranges[0].end
      ctx.set('Content-Range', `${ranges.type} ${start}-${end}/${stat.size}`)
      ctx.body = fs.createReadStream(filename, {
        start,
        end
      })
    }
  } else if (
    (opts.lastModified || opts.etag) &&
    (ctx.get('If-Modified-Since') || ctx.get('If-None-Match')) &&
    ctx.stale
  ) {
    ctx.status = 304
  } else {
    ctx.body = fs.createReadStream(filename)
  }
}
