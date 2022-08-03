const setting = require('../../config/setting');
const meetingC = require('./meeting');
//group
let exe = async (req, res) => {
  meetingC.existRecurrence();
}
module.exports = {
  exe,
}
