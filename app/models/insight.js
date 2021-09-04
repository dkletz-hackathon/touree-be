const {getClient} = require("../database/datastax")
const videoDetailModel = require("../models/video_detail");

async function getInsight(videoId) {
  let query = `SELECT * from touree.video_event_tab where video_id = '${videoId}'`
  let rs = await getClient().execute(query)

  const vidDetails = await videoDetailModel.getByVideoId(videoId)

  if (rs === undefined || rs === null) {
    return vidDetails
  }

  let countMap = {}

  // Get first video (prev video id is 0)
  rs.rows.forEach(row => {
    if (!(row['current_video_id'] in countMap)) {
      countMap[row['current_video_id']] = {
        play_count: 0,
        resume_count: 0,
        pause_count: 0,
        like_count: 0,
        comment_count: 0
      }
    }
    if (row['play_ts'] !== null) {
      countMap[row['current_video_id']]['play_count']++
    } else if (row['resume_ts'] !== null) {
      countMap[row['current_video_id']]['resume_count']++
    } else if (row['pause_ts'] !== null) {
      countMap[row['current_video_id']]['pause_count']++
    } else if (row['like_ts'] !== null) {
      countMap[row['current_video_id']]['like_ts']++
    } else if (row['comment_ts'] !== null) {
      countMap[row['current_video_id']]['comment_ts']++
    }
  })


  for (let i = 0; i < vidDetails.length; i++) {
    if (vidDetails[i]['video_id'].toString() in countMap) {
      vidDetails[i].count = countMap[vidDetails[i]['video_id'].toString()]
    }
  }

  return vidDetails
}

module.exports = {
  getInsight
}
