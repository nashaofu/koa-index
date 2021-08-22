const Koa = require('koa')
const path = require('path')
const koaIndex = require('./dist').default

const app = new Koa()

app.use(koaIndex(__dirname))

app.listen(8080, () => {
  console.log('Server running on: http://127.0.0.1:8080/')
})
