const setting = require('../../config/setting');
const meeting_model = require('../model/meeting');
const core_func = require('../utils/core_func');
//group
let getInfo = async (req, res) => {
  try {
    let info={
      upcoming:0,
      invited:[],
      history:0,
    }
    const {id} = req.user;
    const hosted = await meeting_model.getInstantMeetingAsHost(id);
    const invited = await meeting_model.getInstantMeetingAsParticipant(id);
    const history = await meeting_model.getMeetingHistory(id);
    info.upcoming = hosted.length+invited.length;
    info.invited = invited;
    info.history = history.length;
    return res.status(200).json({result:info})
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  getInfo,
}
