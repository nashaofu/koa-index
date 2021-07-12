import path from 'path'
import type { Context, Next, Middleware } from 'koa'
import readdir from './readdir'
import joinUrlPath from './joinUrlPath'
import template, { TPath } from './template'

export interface IOpts {
  hidden?: boolean
  icons?: boolean
}

export default function (root: string, opts: IOpts = {}): Middleware {
  return async function (ctx: Context, next: Next): Promise<void> {
    const pathname = decodeURIComponent(ctx.path)
    const base = decodeURIComponent(ctx.mountPath || '/')
    const originalPathname = joinUrlPath(base, pathname)
    const dirname = path.join(root, pathname)

    const files = await readdir(dirname, originalPathname, {
      base,
      hidden: opts.hidden
    })

    if (!files) {
      return next()
    }

    const paths = originalPathname.split('/').reduce<TPath[]>((paths, path) => {
      if (path) {
        const url = paths.slice(-1)[0]?.url ?? '/'
        paths.push({
          url: joinUrlPath(url, path, '/'),
          name: path
        })
      }
      return paths
    }, [])

    ctx.type = 'text/html; charset=utf-8'
    ctx.body = await template({
      files,
      paths,
      icons: opts.icons,
      dirname: joinUrlPath(pathname, '/')
    })

    return next()
  }
}
