const cassandra = require("cassandra-driver");
const Uuid = cassandra.types.Uuid;
const datastax = require("../database/datastax");
const { getFirst, getMultiple } = require("./utils");

const partitionColumns = ["id"];
const columns = [
	"video_id",
	"prev_detail_id",
	"next_video_details",
	"video_url",
	"created_at",
	"updated_at",
];
const allColumnsType = [
	"uuid",
	"uuid",
	"uuid",
	null,
	"text",
	"bigint",
	"bigint",
];

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
		if (columns[i] === "created_at") {
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

	const rs = await datastax
		.getClient()
		.execute(insQuery, params, { hints: allColumnsType });

	return { rs, data };
}

async function updateById(id, data) {
	data.updated_at = Math.floor(Date.now() / 1000);
	let params = [];
	for (let i = 0; i < columns.length; i++) {
		if (columns[i] === "created_at") {
			continue;
		}

		params.push(data[columns[i]]);
	}
	params.push(Uuid.fromString(id));

	const rs = await datastax
		.getClient()
		.execute(prefixUpQuery + "where id = ?", params, {
			hints: allColumnsType,
		});

	return { rs, data };
}

async function getById(id) {
	return await getFirst("SELECT * from touree.video_detail where id = ?", [
		Uuid.fromString(id),
	]);
}

async function getByVideoId(videoId) {
	return await getMultiple(
		"SELECT * from touree.video_detail where video_id = ?",
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
