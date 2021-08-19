import fs from 'fs-extra'
import joinUrlPath from './joinUrlPath'
import getFileIcon from './getFileIcon'
import template, { TPath } from './template'

export interface RDOpts {
  base?: string
  hidden?: boolean
}

const regExp = /^\/+|\/+$/g

export default async function readDirectory (dirname: string, pathname: string, opts: RDOpts): Promise<string> {
  const base = opts.base ?? '/'

  let filenames = await fs.readdir(dirname, { withFileTypes: true })

  if (opts.hidden !== true) {
    filenames = filenames.filter(file => !file.name.startsWith('.'))
  }

  const files = filenames
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
    files.unshift({
      name: '..',
      folder: true,
      icon: 'folder',
      url: joinUrlPath(pathname, '../')
    })
  }

  const paths = pathname.split('/').reduce<TPath[]>((paths, path) => {
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

  return template({
    files,
    paths,
    icons,
    dirname: joinUrlPath(pathname, '/')
  })
}