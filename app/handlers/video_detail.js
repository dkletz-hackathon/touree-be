const cassandra = require("cassandra-driver");
const Uuid = cassandra.types.Uuid;

const videoDetailModel = require("../models/video_detail");

const createVideoDetail = async (ctx) => {
	const { body } = ctx.request;
	body.video_id = Uuid.fromString(body.video_id);

	const res = await videoDetailModel.create(body);
	console.log(res);

	const { data } = res;

	ctx.body = data;
};

const updateVideoDetail = async (ctx) => {
	const { id } = ctx.params;
	const { body } = ctx.request;

	body.video_id = null;
	const vidDetail = await videoDetailModel.getById(id);
	const updateData = { ...vidDetail, ...body };

	console.log(updateData);

	const res = await videoDetailModel.updateById(id, updateData);
	console.log(res);

	const { data } = res;
	data.id = id;

	ctx.body = data;
};

const deleteVideoDetail = async (ctx) => {
	const { id } = ctx.params;

	const res = await videoDetailModel.deleteById(id);
	console.log(res);

	ctx.body = "OK";
};

module.exports = {
	createVideoDetail,
	updateVideoDetail,
	deleteVideoDetail,
};
