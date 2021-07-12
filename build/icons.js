const fs = require('fs/promises')
const path = require('path')
const cheerio = require('cheerio')

const sourceDir = path.join(__dirname, '../template/icons')
const targetDir = path.join(__dirname, '../template/dist/icons')

module.exports = async () => {
  console.log('正在编译 icons ...')
  // 清空文件夹
  await fs.rmdir(targetDir, { recursive: true })
  await fs.mkdir(targetDir, { recursive: true })

  const icons = await fs.readdir(sourceDir)

  await Promise.all(
    icons.map(async icon => {
      const data = await fs.readFile(path.join(sourceDir, icon))
      const $ = cheerio.load(data)
      const $svg = $('body > svg')
      const $symbol = $('<symbol></symbol>')

      $symbol.attr('id', icon.slice(0, -4))
      $symbol.attr('viewBox', $svg.attr('viewBox'))
      $symbol.append($svg.contents())

      await fs.writeFile(path.join(targetDir, icon), $symbol.toString())
    })
  )
  console.log('编译 icons 成功')
}
