var Koa = require('koa');
var Router = require('koa-router');
const {pushEvent} = require("./event");

var app = new Koa();
var router = new Router();

router.get('/', (ctx, next) => {
  // ctx.router available
});

router.post('/event/:type', (ctx, next) => {
  pushEvent(ctx.params.type, ctx.body)
  ctx.status = 200;
})

app
  .use(router.routes())
  .use(router.allowedMethods());
