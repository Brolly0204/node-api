const Router = require('koa-router')
// const jwt = require('jsonwebtoken')
const jwt = require('koa-jwt')
const { secret } = require('../config')
const { find, findById, create, update, remove, login, checkOwner } = require('../controllers/users')

// 用户认证
const auth = jwt({ secret })
// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace(/^Bearer\s+/, '')
//   try {
//     const user = jwt.verify(token, secret)
//     ctx.state.user = user
//   } catch(err) {
//     ctx.throw(401, err.message)
//   }
//   await next()
// }

const router = new Router({ prefix: '/users' })

router.get('/', find)

router.get('/:id', findById)

router.post('/', create)

router.patch('/:id', auth, checkOwner, update)

router.delete('/:id', auth, checkOwner, remove)

router.post('/login', login)

module.exports = router