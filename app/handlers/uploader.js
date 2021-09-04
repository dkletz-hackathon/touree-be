const multer = require("@koa/multer");
const uuid = require("uuid");

function filenameHandler(req, file, cb) {
	const fileFormat = file.originalname.split(".");
	cb(
		null,
		uuid.v4() + "-" + Date.now() + "." + fileFormat[fileFormat.length - 1]
	);
}

const videoStorage = multer.diskStorage({
	filename: filenameHandler,
	destination: function (req, file, cb) {
		cb(null, "./static/video");
	},
});

const imageStorage = multer.diskStorage({
	filename: filenameHandler,
	destination: function (req, file, cb) {
		cb(null, "./static/image");
	},
});

const videoUploader = multer({
	fileFilter(ctx, file, callback) {
		if (!file.originalname.match(/\.(mp4)$/)) {
			return callback(new Error("wrong format"), false);
		}
		callback(undefined, true);
	},
	storage: videoStorage,
});

const imageUploader = multer({
	fileFilter(ctx, file, callback) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return callback(new Error("wrong format"), false);
		}
		callback(undefined, true);
	},
	storage: imageStorage,
});

async function postHandleUpload(ctx) {
	const file = ctx.request.file;

	console.log(file);

	ctx.body = {
		status: "OK",
		path: file.path,
	};
}

module.exports = {
	videoUploader,
	imageUploader,
	postHandleUpload,
};
