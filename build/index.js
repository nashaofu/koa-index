const chokidar = require('chokidar')
const path = require('path')
const icons = require('./icons')

;(async () => {
  await icons()
  if (process.argv.includes('--watch')) {
    chokidar.watch(path.join(__dirname, '../template/icons')).on('change', () => icons())
  }
})()
