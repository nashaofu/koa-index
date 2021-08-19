// export default function readFile () {
//   // stream
//   ctx.set('Content-Length', stats.size)
//   if (!ctx.response.get('Last-Modified')) ctx.set('Last-Modified', stats.mtime.toUTCString())
//   if (!ctx.response.get('Cache-Control')) {
//     const directives = [`max-age=${(maxage / 1000 | 0)}`]
//     if (immutable) {
//       directives.push('immutable')
//     }
//     ctx.set('Cache-Control', directives.join(','))
//   }
//   if (!ctx.type) ctx.type = type(path)
//   ctx.body = fs.createReadStream(path)
// }
