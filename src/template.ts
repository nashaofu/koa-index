import path from 'path'
import ejs from 'ejs'

export interface TFile {
  name: string
  folder: boolean
  icon: string
  url: string
}

export interface TPath {
  name: string
  url: string
}

export interface TOpts {
  dirname: string
  paths: TPath[]
  files: TFile[]
  icons: string[]
}

const root = path.join(__dirname, '../template/')

export default function template (data: TOpts): Promise<string> {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(root, 'index.ejs'),
      data,
      {
        root,
        cache: false
      },
      (err, str) => {
        if (err) {
          return reject(err)
        }
        resolve(str)
      }
    )
  })
}
