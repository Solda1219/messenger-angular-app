const setting = require('../../config/setting');
const model = require('../model/dept');
const user_model = require('../model/user');
const core_func = require('../utils/core_func');
const mcu_api = require('../controller/mcu'); 
let getDept = async (req, res) => {
  try {
    const item = await model.getter();
    return res.json({ result: item });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let getUsers = async (req, res) => {
  try {
    const result = [];
    const users = await user_model.getter();
    for(let i = 0; i < users.length; i++){
      if(users[i].leaveMessageOutside==0) continue;
      users[i].status = await mcu_api.userStatus(users[i].memberId);
      result.push(users[i])
    } ;
    return res.json({ result: result });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  getDept,
  getUsers,
}
