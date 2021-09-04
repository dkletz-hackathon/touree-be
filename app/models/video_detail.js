const cassandra = require("cassandra-driver");
const Uuid = cassandra.types.Uuid;
const datastax = require("../database/datastax");
const { getFirst, getMultiple } = require("./utils");

const partitionColumns = ["id"];
const columns = [
	"video_id",
	"prev_detail_id",
	"default_next_detail_id",
	"next_video_details",
	"time_to_show_next",
	"video_url",
	"created_at",
	"updated_at",
];
const createHints = [
	"uuid",
	"uuid",
	"uuid",
	"uuid",
	null,
	"bigint",
	"text",
	"bigint",
	"bigint",
];
const updateHints = ["uuid", "uuid", null, "bigint", "text", "bigint", null];

function _insertQuery() {
	let query = "INSERT INTO touree.video_detail (";
	let query2 = "VALUES (";

	for (let i = 0; i < partitionColumns.length; i++) {
		query += partitionColumns[i] + ",";
		query2 += "?,";
	}
	for (let i = 0; i < columns.length; i++) {
		query += columns[i];
		query2 += "?";
		if (i !== columns.length - 1) {
			query += ",";
			query2 += ",";
		}
	}

	query += ") ";
	query2 += ")";

	return query + query2;
}

function _prefixUpdateQuery() {
	let setColumns = [];

	for (let i = 0; i < columns.length; i++) {
		if (columns[i] === "created_at" || columns[i] === "video_id") {
			continue;
		}

		setColumns.push(`${columns[i]}=?`);
	}

	return "UPDATE touree.video_detail set " + setColumns.join();
}

const insQuery = _insertQuery();
const prefixUpQuery = _prefixUpdateQuery();

async function create(data) {
	data.id = Uuid.random();
	data.created_at = Math.floor(Date.now() / 1000);
	data.updated_at = Math.floor(Date.now() / 1000);

	let params = [data.id];
	for (let i = 0; i < columns.length; i++) {
		params.push(data[columns[i]]);
	}

	console.log(insQuery, params, createHints);

	const rs = await datastax
		.getClient()
		.execute(insQuery, params, { prepare: true, hints: createHints });

	return { rs, data };
}

async function updateById(id, data) {
	data.updated_at = Math.floor(Date.now() / 1000);
	let params = [];
	for (let i = 0; i < columns.length; i++) {
		if (columns[i] === "created_at" || columns[i] === "video_id") {
			continue;
		}

		params.push(data[columns[i]]);
	}
	params.push(Uuid.fromString(id));

	const updateQuery = prefixUpQuery + " where id = ?";

	console.log(updateQuery, params);

	const rs = await datastax.getClient().execute(updateQuery, params, {
		hints: updateHints,
		prepare: true,
	});

	return { rs, data };
}

async function getById(id) {
	return await getFirst(
		"SELECT * from touree.video_detail where id = ? ALLOW FILTERING",
		[Uuid.fromString(id)]
	);
}

async function getByVideoId(videoId) {
	return await getMultiple(
		"SELECT * from touree.video_detail where video_id = ? ALLOW FILTERING",
		[Uuid.fromString(videoId)]
	);
}

async function deleteById(id) {
	return await datastax
		.getClient()
		.execute("DELETE from touree.video where id = ?", [Uuid.fromString(id)]);
}

module.exports = {
	getById,
	getByVideoId,
	updateById,
	create,
	deleteById,
};
