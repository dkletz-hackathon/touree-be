const datastax = require("./database/datastax");

// testing
datastax
	.initClient()
	.then(() => {
		const cli = datastax.getClient();
		return cli.execute("SELECT * FROM system.local");
	})
	.then((rs) => {
		console.log(`Your cluster returned ${rs.rowLength} row(s)`);

		return datastax.shutdown();
	});
