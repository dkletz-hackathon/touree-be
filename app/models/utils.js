
async function getFirst(query, vars) {
	const cli = datastax.getClient();

	const rs = await cli.execute(query, vars);
	if (rs === null) {
		return null;
	}
	if (rs.rows.length === 0) {
		return null;
	}

	return rs.rows[0];
}

module.exports = {
	getFirst
}