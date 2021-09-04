const cassandra = require("cassandra-driver");
const Uuid = cassandra.types.Uuid;

const datastax = require("../database/datastax");
const { getFirst } = require("./utils");

const partitionColumns = ["id"];
const columns = [
	"title",
	"description",
	"start_detail_id",
	"thumbnail_image",
	"thumbnail_video",
	"user_id",
	"created_at",
	"updated_at",
];
const allColumnsType = [
	"uuid",
	"text",
	"text",
	"uuid",
	"text",
	"text",
	"uuid",
	"bigint",
	"bigint",
];

function _insertQuery() {
	let query = "INSERT INTO touree.video (";
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

	return "UPDATE touree.video set " + setColumns.join();
}

const insQuery = _insertQuery();
const prefixUpQuery = _prefixUpdateQuery();

async function getById(id) {
	return await getFirst("SELECT * from touree.video where id = ?", [
		Uuid.fromString(id),
	]);
}

async function create(data) {
	data.id = Uuid.random();
	data.created_at = Math.floor(Date.now() / 1000);
	data.updated_at = Math.floor(Date.now() / 1000);

	let params = [data.id];
	for (let i = 0; i < columns.length; i++) {
		params.push(data[columns[i]]);
	}

	console.log(insQuery, params);
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

async function deleteById(id) {
	return await datastax
		.getClient()
		.execute("DELETE from touree.video where id = ?", [Uuid.fromString(id)]);
}

module.exports = {
	getById,
	create,
	updateById,
	deleteById,
};
