const xid = require("xid");
const {getClient} = require("./database/datastax");

const PLAY = 1;
const RESUME = 2;
const PAUSE = 3;
const QUIT = 4;
const LIKE = 5;
const COMMENT = 6

const columns = [
  'trace_id',
  'event_id',
  'video_id',
  'user_id',
  'previous_video_id',
  'play_ts',
  'resume_ts',
  'pause_ts',
  'quit_ts',
  'like_ts',
  'comment_ts'
]

let query = 'INSERT INTO video_event_tab VALUES ('

for (let i = 0; i < columns.length; i++) {
  query += columns[i]
  if (i !== columns.length - 1) {
    query += ','
  }
}

query += ')'

function parseEvent(eventType, rawEvent) {
  let eventBody = {
    trace_id: rawEvent.trace_id,
    event_id: xid.generateId(),
    video_id: rawEvent.video_id,
    user_id: rawEvent.user_id,
    previous_video_id: rawEvent.previous_video_id,
  }

  switch (eventType) {
    case PLAY:
      eventBody.play_ts = rawEvent.timestamp
      break
    case RESUME:
      eventBody.resume_ts = rawEvent.timestamp
      break
    case PAUSE:
      eventBody.pause_ts = rawEvent.timestamp
      break
    case QUIT:
      eventBody.quit_ts = rawEvent.timestamp
      break
    case LIKE:
      eventBody.like_ts = rawEvent.timestamp
      break
    case COMMENT:
      eventBody.comment_ts = rawEvent.timestamp
      break
  }

  return eventBody
}

async function pushEvent(eventType, rawEvent) {
  let event = parseEvent(eventType, rawEvent)

  let params = []
  for (let i = 0; i < columns.length; i++) {
    params.push(event[columns[i]])
  }

  const rs = await getClient().execute(query, params, { prepare: true });
  console.log(`Your cluster returned ${rs.rowLength} row(s)`);
}

module.exports = {
  PLAY,
  RESUME,
  PAUSE,
  QUIT,
  LIKE,
  COMMENT,
  pushEvent
}
