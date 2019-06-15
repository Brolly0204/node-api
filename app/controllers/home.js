const path = require('path')

class HomeController {
  index(ctx) {
    ctx.body = '<h1>Home Nodejs首页</h1>'
  }
  upload(ctx) {
    let { file } = ctx.request.files
    if (!Array.isArray(file)) {
      file = [file]
    }
    const files = file.map(item => {
      const basename = path.basename(item.path)
      return `${ctx.origin}/uploads/${basename}`
    })
    ctx.body = { files: files}
  }
}

module.exports = new HomeController()