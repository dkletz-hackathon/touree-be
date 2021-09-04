const Router = require("koa-router");

const {
	videoUploader,
	imageUploader,
	postHandleUpload,
} = require("./handlers/uploader");
const videoHandler = require("./handlers/video");
const videoDetailHandler = require("./handlers/video_detail");

const { AppError, ERROR_CODE } = require("./error");
const { pushEvent } = require("./models/event");
const { getInsight } = require("./models/insight");

const router = new Router();

router.get("/", (ctx) => {
	ctx.body = "welcome";
});

router.use(async (ctx, next) => {
	try {
		await next();

		ctx.body = {
			status: ERROR_CODE.SUCCESS,
			data: ctx.body,
		};
	} catch (e) {
		console.log(e.stack);

		if (e instanceof AppError) {
			ctx.body = {
				status: e.errCode,
				err_message: e.message,
			};
		} else {
			ctx.body = {
				status: ERROR_CODE.ERROR_INTERNAL_SERVER,
				err_message: e.message,
			};
		}
	}
});

router.post("/upload-video", videoUploader.single("video"), postHandleUpload);
router.post("/upload-image", imageUploader.single("image"), postHandleUpload);

router.post("/video", videoHandler.createVideo);
router.get("/video/:id", videoHandler.getVideo);
router.post("/video/:id", videoHandler.updateVideo);

router.post("/video_detail", videoDetailHandler.createVideoDetail);
router.post("/video_detail/:id", videoDetailHandler.updateVideoDetail);
router.delete("/video_detail/:id", videoDetailHandler.deleteVideoDetail);

router.post("/event/:type", async (ctx, next) => {
	await pushEvent(parseInt(ctx.params.type), ctx.request.body);
	ctx.status = 200;
});
router.get("/video/:id/insight", async (ctx, next) => {
	await getInsight(ctx.params.id);
	ctx.status = 200;
});

module.exports = {
	router,
};
