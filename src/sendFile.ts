import type { Context } from 'koa'
import fs, { Stats } from 'fs-extra'
// import readFile from './readFile'
import path from 'path'

export interface SFOpts {
  stat: Stats
  maxage?: number
  hidden?: boolean
}

export default async function sendFile (filename: string, ctx: Context, opts: SFOpts): Promise<void> {
  const stat = opts.stat
  const maxage = (opts.maxage / 1000) | 0

  ctx.set('Content-Length', stat.size)
  ctx.set('Last-Modified', stat.mtime.toUTCString())
  ctx.set('Cache-Control', `max-age=${maxage}`)

  ctx.type = path.extname(filename)
  ctx.body = fs.createReadStream(filename)
}
