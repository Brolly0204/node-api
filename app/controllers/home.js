class HomeController {
  index(ctx) {
    ctx.body = '<h1>Home Nodejs首页</h1>'
  }
}

module.exports = new HomeController()