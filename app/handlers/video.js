const cassandra = require("cassandra-driver");
const Uuid = cassandra.types.Uuid;

const videoModel = require("../models/video");
const videoDetailModel = require("../models/video_detail");

const getVideo = async (ctx) => {
	const { id } = ctx.params;
	const { detail } = ctx.query;
	const vid = await videoModel.getById(id);

	if (detail === "true") {
		const vidDetails = await videoDetailModel.getByVideoId(vid.id.toString());
		vid.details = vidDetails;
	}

	ctx.body = vid;
};

const getVideos = async (ctx) => {
	const vids = await videoModel.getAll();

	ctx.body = vids;
};

const createVideo = async (ctx) => {
	const { body } = ctx.request;

	const res = await videoModel.create(body);
	console.log(res);

	const { data } = res;
	ctx.body = data;
};

const updateVideo = async (ctx) => {
	const { id } = ctx.params;
	const { body } = ctx.request;

	const vid = await videoModel.getById(id);

	if (body.start_detail_id) {
		body.start_detail_id = Uuid.fromString(body.start_detail_id);
	}

	const updateData = { ...vid, ...body };

	console.log(updateData);

	const res = await videoModel.updateById(id, updateData);
	console.log(res);

	const { data } = res;
	data.id = id;

	ctx.body = data;
};

module.exports = {
	getVideo,
	createVideo,
	getVideos,
	updateVideo,
};
