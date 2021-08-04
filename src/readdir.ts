import fs from 'fs/promises'
import joinUrlPath from './joinUrlPath'
import type { TFile } from './template'
import getFileIcon from './getFileIcon'

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

  let files = await fs.readdir(dirname, { withFileTypes: true })

  if (opts.hidden !== true) {
    files = files.filter(file => !file.name.startsWith('.'))
  }

  const tfiles = files
    .map(file => {
      const isDirectory = file.isDirectory()
      return {
        name: file.name,
        folder: isDirectory,
        icon: isDirectory ? 'folder' : getFileIcon(file.name),
        url: joinUrlPath(pathname, file.name, isDirectory ? '/' : '')
      }
    })
    .sort((prev, next) => {
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
