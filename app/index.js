const datastax = require("./database/datastax");
const Koa = require("koa");
const {router} = require("./router");
const bodyParser = require('koa-bodyparser');

const app = new Koa();

// testing
datastax
	.initClient()
	.then(() => {
		const cli = datastax.getClient();
		return cli.execute("SELECT * FROM system.local");
	})
	.then((rs) => {
		console.log(`Your cluster returned ${rs.rowLength} row(s)`);
	});

app
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(3000);
