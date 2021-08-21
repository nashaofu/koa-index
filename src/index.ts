import path from 'path'
import fs from 'fs-extra'
import type { Context, Next, Middleware } from 'koa'
import sendFile from './sendFile'
import sendDirectory from './sendDirectory'

export interface IOpts {
  index?: string | boolean
  maxage?: number
  lastModified?: boolean
  etag?: boolean
  hidden?: boolean
}

export default function (iRoot: string, iOpts?: IOpts): Middleware {
  const root = path.resolve(iRoot)

  const opts = {
    index: iOpts?.index ?? 'index.html',
    maxage: iOpts?.maxage ?? 0,
    lastModified: iOpts?.lastModified ?? true,
    etag: iOpts?.etag ?? true,
    hidden: iOpts?.hidden ?? true
  }

  return async function (ctx: Context, next: Next): Promise<void> {
    // only accept GET and HEAD
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
      return next()
    }
    if (ctx.body != null || ctx.status !== 404) {
      return next()
    }

    const pathname = decodeURIComponent(ctx.path)
    const filename = path.join(root, pathname)

    if (!filename.startsWith(root)) {
      return next()
    }

    // 判断是否为隐藏文件
    if (opts.hidden && path.basename(filename)[0] === '.') {
      return next()
    }

    const stat = await fs.stat(filename)

    if (stat.isFile()) {
      await sendFile(filename, ctx, {
        stat,
        maxage: opts.maxage,
        lastModified: opts.lastModified,
        etag: opts.etag,
        hidden: opts.hidden
      })
    } else {
      if (opts.index && typeof opts.index === 'string') {
        const indexFileName = path.join(filename, opts.index)
        let indexFileStat
        try {
          indexFileStat = await fs.stat(indexFileName)
        } catch (err) {}

        // 只处理文件的情况，如果是文件夹则还是显示filename文件夹的内容
        if (indexFileStat && indexFileStat.isFile()) {
          await sendFile(filename, ctx, {
            stat: indexFileStat,
            maxage: opts.maxage,
            lastModified: opts.lastModified,
            etag: opts.etag,
            hidden: opts.hidden
          })
        } else {
          await sendDirectory(filename, ctx, {
            pathname,
            hidden: opts.hidden
          })
        }
      } else {
        await sendDirectory(filename, ctx, {
          pathname,
          hidden: opts.hidden
        })
      }
    }

    return next()
  }
}
