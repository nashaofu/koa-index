const Koa = require('koa')
const path = require('path')
const koaIndex = require('./dist').default
const koaStatic = require('koa-static')

const app = new Koa()

app.use(
  koaStatic(__dirname, {
    hidden: true
  })
)

app.use(
  koaIndex(__dirname, {
    hidden: true,
    icons: true
  })
)

app.listen(8080, () => {
  console.log('Server running on: http://127.0.0.1:8080/')
})
