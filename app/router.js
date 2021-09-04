const Router = require("koa-router");

const {
	videoUploader,
	imageUploader,
	postHandleUpload,
} = require("./handlers/uploader");
const { pushEvent } = require("./models/event");
const {getInsight} = require("./models/insight");

const router = new Router();

router.get("/", (ctx) => {
	ctx.body = "welcome";
});

router.post("/upload-video", videoUploader.single("video"), postHandleUpload);
router.post("/upload-image", imageUploader.single("image"), postHandleUpload);

router.get('/video/:id/insight', async (ctx, next) => {
  await getInsight(ctx.params.id)
  ctx.status = 200
})

router.post('/event/:type', async (ctx, next) => {
  await pushEvent(parseInt(ctx.params.type), ctx.request.body)
  ctx.status = 200;
})

module.exports = {
	router,
};
