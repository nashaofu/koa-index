import path from 'path'
import type { Context, Next, Middleware } from 'koa'
import readdir from './readdir'
import joinUrlPath from './joinUrlPath'
import template, { TPath } from './template'

export interface IOpts {
  hidden?: boolean
}

export default function (root: string, opts: IOpts = {}): Middleware {
  return async function (ctx: Context, next: Next): Promise<void> {
    if (ctx.body != null || ctx.status !== 404) {
      return next()
    }

    const pathname = decodeURIComponent(ctx.path)
    const base = decodeURIComponent(ctx.mountPath || '/')
    const originalPathname = joinUrlPath(base, pathname)
    const dirname = path.join(root, pathname)

    const files = await readdir(dirname, originalPathname, {
      base,
      hidden: opts.hidden
    })

    // 读取文件夹失败
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

    const icons = files.reduce<string[]>((icons, file) => {
      if (!icons.includes(file.icon)) {
        icons.push(file.icon)
      }
      return icons
    }, [])

    ctx.type = 'text/html; charset=utf-8'
    console.log('sdasdasdasdas')
    ctx.body = await template({
      files,
      paths,
      icons,
      dirname: joinUrlPath(pathname, '/')
    })

    return next()
  }
}
