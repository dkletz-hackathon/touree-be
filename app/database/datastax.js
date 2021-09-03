const { Client } = require("cassandra-driver");
const config = require("config");

var client;

async function initClient() {
	const cliConfig = config.get("datastax");
	client = new Client(cliConfig);

	await client.connect();
}

function getClient() {
	return client;
}

async function shutdown() {
	await client.shutdown();
}

module.exports = { initClient, getClient, shutdown };
