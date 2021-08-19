import type { Context } from 'koa'
import joinUrlPath from './joinUrlPath'
import readDirectory from './readDirectory'

export interface SDOpts {
  pathname: string
  hidden?: boolean
}

export default async function sendDirectory (dirname: string, ctx: Context, opts: SDOpts): Promise<void> {
  const base = decodeURIComponent(ctx.mountPath || '/')
  const originalPathname = joinUrlPath(base, opts.pathname)

  ctx.type = 'text/html'
  ctx.body = await readDirectory(dirname, originalPathname, {
    base,
    hidden: opts.hidden
  })
}
