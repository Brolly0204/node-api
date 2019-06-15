const Koa = require('koa')
const path = require('path')
const mongoose = require('mongoose')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const koaStatic = require('koa-static')
const routerMap = require('./routes')
const { dbURL } = require('./config')

const app = new Koa()

mongoose.connect(dbURL, { useNewUrlParser: true, useFindAndModify: false }, () => console.log('MongoDB连接成功！'))

mongoose.connection.on('error', console.error)

// app.use(async (ctx, next) => {
//   try {
//     await next()
//   } catch(err) {
//     ctx.status = err.status || err.statusCode || 500
//     ctx.body = {
//       message: err.message
//     }
//   }
// })

app.use(error({
  postFormat: (e, { stack, ...rest }) => {
    return process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
  }
}))

app.use(koaStatic(path.join(__dirname, '/public')))

// app.use(bodyparser())
app.use(koaBody({
  multipart: true, // multipart/form-data
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'), // 上传目录路径
    keepExtensions: true // 保留扩展名
  }
}))

app.use(parameter(app))

routerMap(app)

app.listen(3000, () => {
  console.log('服务监听3000端口')
})