const path = require("path");

const Koa = require("koa");
const logger = require("koa-logger");
const mount = require("koa-mount");
const serve = require("koa-static");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

const { router } = require("./router");
const datastax = require("./database/datastax");

const app = new Koa();

// testing
datastax.initClient().then(() => {
	app.use(cors());
	app.use(logger());

	app.use(mount("/public", serve(path.join(__dirname + "/../public"))));
	app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

	app.listen(3000);
});
