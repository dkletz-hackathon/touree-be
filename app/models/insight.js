const {getClient} = require("../database/datastax")
const videoDetailModel = require("../models/video_detail");

async function getInsight(videoId) {
  let query = `SELECT * from touree.video_event_tab where video_id = '${videoId}'`
  let rs = await getClient().execute(query)

  if (rs === undefined || rs === null) {
    return null
  }

  let countMap = {}

  // Get first video (prev video id is 0)
  rs.rows.forEach(row => {
    if (row['current_video_id'] in countMap) {
      countMap[row['current_video_id']]++
      return
    }
    countMap[row['current_video_id']] = 1
  })

  const vidDetails = await videoDetailModel.getByVideoId(videoId)

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
