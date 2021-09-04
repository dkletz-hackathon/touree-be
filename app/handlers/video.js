const videoModel = require("../models/video");

const getVideoById = async (ctx) => {
	const { id } = ctx.params;
	const vid = await videoModel.getById(id);

	ctx.body = vid;
};

const createVideo = async (ctx) => {
	const { body } = ctx.request;
	const res = await videoModel.create(body);

	console.log(res);

	const { data } = res;
	data.id = data.id.toString();

	ctx.body = data;
};

module.exports = {
	getVideoById,
	createVideo,
};
