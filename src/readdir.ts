import path from 'path'
import fs from 'fs-extra'
import joinUrlPath from './joinUrlPath'
import type { TFile } from './template'

export interface ROpts {
  base?: string
  hidden?: boolean
}

const regExp = /^\/+|\/+$/g

export default async function readdir (dirname: string, pathname: string, opts: ROpts = {}): Promise<TFile[] | null> {
  const base = opts.base ?? '/'

  try {
    const stat = await fs.stat(dirname)
    if (!stat.isDirectory()) {
      return null
    }
  } catch (err) {
    return null
  }

  let files = await fs.readdir(dirname)

  if (opts.hidden !== true) {
    files = files.filter(file => !file.startsWith('.'))
  }

  const tfiles = await Promise.all(
    files.map(async file => {
      const stat = await fs.stat(path.join(dirname, file))
      const isDirectory = stat.isDirectory()
      return {
        name: file,
        folder: isDirectory,
        icon: isDirectory ? 'folder' : 'file',
        url: joinUrlPath(pathname, file, isDirectory ? '/' : '')
      }
    })
  )

  tfiles.sort((prev, next) => {
    if (prev.folder && next.folder) {
      return prev.name.localeCompare(next.name)
    } else if (prev.folder && !next.folder) {
      return -1
    } else if (!prev.folder && next.folder) {
      return 1
    } else {
      return prev.name.localeCompare(next.name)
    }
  })

  // 不是根目录就显示 ..
  if (pathname.replace(regExp, '') !== base.replace(regExp, '')) {
    tfiles.unshift({
      name: '..',
      folder: true,
      icon: 'folder',
      url: joinUrlPath(pathname, '../')
    })
  }

  return tfiles
}
