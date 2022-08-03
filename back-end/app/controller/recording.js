const setting = require('../../config/setting');
const core_func = require('../utils/core_func');
const fileController = require("./file");
const model = require('../model/meeting');
const user_model = require('../model/user');
const msg_model = require('../model/message');
const mcu_api = require('../controller/mcu');
const file_c = require('../controller/file');
const path = require('path');
let get = async (req, res) => {
  try {
    const {id} = req.user;
    const {from,to,filter,type,title} = req.body;
    const item = await model.getMeetingForRecording(id,from,to);
    const received = await msg_model.getR(from,to,id);
    const sent = await msg_model.getS(from,to,id);
    let result = [];
    for(let i = 0 ; i < item.length; i ++){
      const jnrFile = await mcu_api.getJnrfile(item[i].coordinatorId,item[i].meetingId);
      if(jnrFile===false) continue; 
      if(filter!=-1&&filter==0&&item[i].is_read!=0) continue;
      if(filter!=-1&&filter==1&&item[i].is_read==0) continue;
      if(type!=-1&&type!=item[i].meetingType) continue;
      item[i].fileName = jnrFile.name;
      item[i].fileSize = jnrFile.size;
      item[i].readStatus = item[i].is_read==0?'UnRead':'Read';
      item[i].started_at = core_func.strftime(item[i].started_at);
      if(item[i].meetingType==0) item[i].typeName = 'Instant meeting';
      if(item[i].meetingType==1) item[i].typeName = 'Schedule meeting';
      const meetingStatus = await mcu_api.meetingStatus(item[i].coordinatorId,item[i].meetingId);
      item[i].meetingStatus = meetingStatus;
      item[i].duration = meetingStatus.duration;
      item[i].cloudCopy = item[i].is_cloud==0?'no':'yes';
      result.push(item[i]);
    }
    for(let i = 0 ; i < received.length; i ++){
      const jnrFile = await mcu_api.getJnrfile(received[i].coordinatorId,received[i].meetingId);
      if(jnrFile===false) continue; 
      if(filter!=-1&&filter==0&&received[i].is_read!=0) continue;
      if(filter!=-1&&filter==1&&received[i].is_read==0) continue;
      if(type!=-1&&type!=received[i].meetingType) continue;
      const senderdata = await user_model.getProfile(received[i].senderId);
      received[i].fileName = jnrFile.name;
      received[i].is_mine = 0;
      received[i].fileSize = jnrFile.size;
      received[i].title = received[i].title_r;
      received[i].readStatus = received[i].is_read==0?'UnRead':'Read';
      received[i].started_at = core_func.strftime(received[i].created_at);
      received[i].email = received[i].senderId==-1?'OutSideUser':senderdata.email;
      received[i].typeName = 'Received message';
      const meetingStatus = await mcu_api.meetingStatus(received[i].coordinatorId,received[i].meetingId);
      received[i].meetingStatus = meetingStatus;
      received[i].duration = meetingStatus.duration;
      received[i].cloudCopy = received[i].is_cloud==0?'no':'yes';
      result.push(received[i]);
    }
    for(let i = 0 ; i < sent.length; i ++){
      const jnrFile = await mcu_api.getJnrfile(sent[i].coordinatorId,sent[i].meetingId);
      if(jnrFile===false) continue; 
      if(filter!=-1&&filter==0&&sent[i].is_read!=0) continue;
      if(filter!=-1&&filter==1&&sent[i].is_read==0) continue;
      if(type!=-1&&type!=sent[i].meetingType) continue;
      sent[i].fileName = jnrFile.name;
      sent[i].fileSize = jnrFile.size;
      sent[i].title = sent[i].title_s;
      sent[i].is_mine = 1;
      sent[i].readStatus = sent[i].is_read==0?'UnRead':'Read';
      sent[i].started_at = core_func.strftime(sent[i].created_at);
      sent[i].email = "Me";
      sent[i].typeName = 'Sent message';
      const meetingStatus = await mcu_api.meetingStatus(sent[i].coordinatorId,sent[i].meetingId);
      sent[i].meetingStatus = meetingStatus;
      sent[i].duration = meetingStatus.duration;
      sent[i].cloudCopy = sent[i].is_cloud==0?'no':'yes';
      result.push(sent[i]);
    }
    return res.json({ result: result });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let create = async (req, res) => {
  try{
    await fileController._uploadJNJ(req, res);
  }
  catch(err)
  {
    return res.status(400).json({
      message: err,
    });
  }
  try {
    const {id} = req.user;
    const data = req.body;
    const fileSize = fileController.getFileSize(data.recordingFile);
    const exist = await model.exist(id,data.title);
    if (exist) return res.status(401).json({ message: 'This title already exist.' });
    const dataitem={
      recordingFile:data.recordingFile,
      coordinatorId:id,
      title:data.title,
      recordingSize:fileSize,
      isRead:0,
      created_at:core_func.strftime(Date.now())
    }
    await model.create(dataitem);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let read = async (req, res) => {
  try {
    const {data,status} = req.body;
    for(let i  = 0 ; i < data.length; i++){
      if(data[i].meetingType==0||data[i].meetingType==1)await model.update(data[i].meetingId,{is_read:status});
      if(data[i].meetingType==2&&data[i].is_mine==0){
        await msg_model.update(data[i].meetingId,{is_read:status});
      }
    }
    return res.json({ message: 'Success!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let del = async (req, res) => {
  try {
    const data = req.body;
    for(let i=0; i< data.length; i++){
      await model.del(data[i].recordingId);
    }
    return res.json({message: 'Success' });
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
  read,
  del,
}
