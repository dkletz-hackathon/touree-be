const {getClient} = require("../database/datastax")

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

  return rs
}

module.exports = {
  getInsight
}
