const { AppError, ERROR_CODE } = require("../error");
const datastax = require("../database/datastax");

async function getFirst(query, vars) {
	const cli = datastax.getClient();

	const rs = await cli.execute(query, vars);
	if (rs === null) {
		throw new AppError();
	}
	if (rs.rows.length === 0) {
		throw new AppError(ERROR_CODE.ERROR_NOT_FOUND);
	}

	console.log(rs);

	return rs.rows[0];
}

async function getMultiple(query, vars) {
	const cli = datastax.getClient();

	const rs = await cli.execute(query, vars);
	if (rs === null) {
		throw new AppError();
	}

	return rs.rows;
}

module.exports = {
	getFirst,
	getMultiple,
};
