import path from 'path'
import fs from 'fs-extra'
import type { Context, Next, Middleware } from 'koa'
import sendFile from './sendFile'
import sendDirectory from './sendDirectory'

export interface IOpts {
  index?: string
  maxage?: number
  hidden?: boolean
}

export default function (root: string, opts: IOpts = {}): Middleware {
  return async function (ctx: Context, next: Next): Promise<void> {
    if (ctx.body != null || ctx.status !== 404) {
      return next()
    }

    const pathname = decodeURIComponent(ctx.path)
    const filename = path.join(root, pathname)

    // 判断是否为隐藏文件
    if (!opts.hidden && path.basename(filename)[0] === '.') {
      return next()
    }

    const stat = await fs.stat(filename)

    if (stat.isFile()) {
      await sendFile(filename, ctx, {
        stat,
        maxage: opts.maxage,
        hidden: opts.hidden
      })
    } else {
      if (opts.index) {
        const indexFileName = path.join(filename, opts.index)
        const indexFileStat = await fs.stat(indexFileName)
        // 只处理文件的情况，如果是文件夹则还是显示filename文件夹的内容
        if (indexFileStat.isFile()) {
          await sendFile(filename, ctx, {
            stat: indexFileStat,
            maxage: opts.maxage,
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
