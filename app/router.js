const Koa = require('koa');
const Router = require('koa-router');
const {pushEvent} = require("./event");

const router = new Router();

router.get('/', (ctx, next) => {
  // ctx.router available
});

router.post('/event/:type', async (ctx, next) => {
  await pushEvent(parseInt(ctx.params.type), ctx.request.body)
  ctx.status = 200;
})

module.exports = {
  router
}
