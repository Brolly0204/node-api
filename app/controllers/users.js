const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')

class UsersController {
  async find(ctx) {
    ctx.body = await User.find()
  }
  async findById(ctx) {
    const { fields = '' } = ctx.query
    let selectFields
    if (fields) {
      selectFields = fields.split(';').filter(f => f).map(f => '+' + f).join(' ')
    }
    // selectFields => " +educations +business"
    const user = await User.findById(ctx.params.id).select(selectFields)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { name } = ctx.request.body
    const repeatUser = await User.findOne({ name })
    if (repeatUser) ctx.throw(409, '用户已存在')
    const user = await new User(ctx.request.body).save()
    ctx.body = { name: user.name, _id: user._id }
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true // 返回修改的数据 默认：false
    })
    if (!user) ctx.throw(404, '用户不存在 更新失败')
    ctx.body = user
  }
  async remove(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) ctx.throw(404, '删除失败 用户不存在')
    ctx.status = 204
    ctx.body = user
  }
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名或密码不正确')
    const { name, _id } = user
    const token = jwt.sign({ name, _id }, secret, {
      expiresIn: '1d'
    })
    ctx.body = { token }
  }
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user['_id']) ctx.throw(403, '没有权限')
    await next()
  }
}

module.exports = new UsersController()