const setting = require('../../config/setting');
const model = require('../model/event');
const core_func = require('../utils/core_func');
let get = async (req, res) => {
  try {
    const {id} = req.user;
    const item = await model.getter(id);
    for(let i = 0 ; i < item.length; i ++){
      item[i].start_time = core_func.strftime(item[i].start_time);
      item[i].end_time = core_func.strftime(item[i].end_time);
      item[i].event_type = "event";
    }
    return res.json({ result: item });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let create = async (req, res) => {
  try {
    const {id} = req.user;
    const data = req.body;
    data.coordinatorId = id;
    // const exist = await model.exist(data.title);
    // if (exist) return res.status(401).json({ message: 'This title aready exist.' });
    data.created_at = core_func.strftime(Date.now());
    await model.create(data);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let edit = async (req, res) => {
  try {
    const data = req.body;
    // const exist = await model.existNotMe(data.id, data.title);
    // if (exist) return res.status(401).json({ message: 'This title already exist.' });
    const {id} = data;
    delete data.id;
    await model.update(id,data);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let del = async (req, res) => {
  try {
    const {id} = req.body;
    await model.del(id);
    return res.json({message: 'Success' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let getEventAlarm = async (req,res) => {
  try {
    const {id} = req.user;
    const item = await model.getAlarm(id,core_func.strftime(new Date()));
    let result = [];
    for(let i = 0 ; i < item.length; i ++){
       const {alarm_time,start_time} = item[i];
       const alarmWillStart = new Date(start_time).getTime() - alarm_time?alarm_time*60*1000:100 - new Date().getTime();
       if(alarmWillStart<0)  result.push(item[i]);
    }
    return res.json({ result: item });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let alarmRead = async (req,res) => {
  try {
    const data =req.body;
    for(let i = 0 ; i < data.length; i ++){
     const {id} = data[i];
     await model.update(id,{alarm_read:1});
    }
    return res.json({ result: 'success' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  get,
  create,
  edit,
  del,
  getEventAlarm,
  alarmRead,
}
