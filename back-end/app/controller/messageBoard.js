const setting = require('../../config/setting');
const model = require('../model/message');
const user_model = require('../model/user');
const meeting_model = require('../model/meeting');
const address_model = require('../model/address');
const cloud_model = require('../model/clouddisk');
const core_func = require('../utils/core_func');
const mcu_api = require('../controller/mcu');
const file_c = require('../controller/file');
const path = require('path');
let getUsers = async (req, res) => {
  try {
    const {id,phone} = req.user;
    const result = [];
    const users = await user_model.getter();
    for(let i = 0; i < users.length; i++){
      if(users[i].memberId==id) continue;
      if(users[i].leaveMessagePrivacy==2) continue;
      if(users[i].leaveMessagePrivacy==1){
         const existinAddress = await address_model.exist(users[i].memberId,phone);
         if(existinAddress===false) continue;
      };
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
let leavemessage = async (req, res) => {
  try {
    const {id} = req.user;
    //preparedata
    const {title,content,sender,receiver} = req.body;
    const userdata = await user_model.getProfile(receiver);
    const mydata = await user_model.getProfile(sender);
    const dataNow = new Date().getTime();
    //get server info and create jnj
    const serverInfo= await mcu_api.getServerInfo();
    const jnjData = {
      meetingId:dataNow,
      coordinatorId:userdata.memberId,
      ownerName:userdata.nativeName,
      guestId:mydata.memberId,
      guestName:mydata.nativeName,
      invited:1,
      title:title,
      domain:serverInfo.domain,
      primaryIp:serverInfo.primaryIp,
      backupIp:serverInfo.backupIp,
      portm:serverInfo.portm,
      port2:serverInfo.port2,
      joinnetWebApp:serverInfo.joinnetWebApp,
    }
    const url = await mcu_api.createJNJForLeaveMessage(jnjData);
    if(url===false) return res.status(401).json({message:'Failed'});
    const insertData = { meetingId:dataNow, coordinatorId:userdata.memberId, senderId:mydata.memberId,
      title_s:title,content_s:content,title_r:title,content_r:content,meetingType:2,meetingURL:url.meetingURL,created_at:core_func.strftime(dataNow)
    }
    const created = await model.create(insertData);
    if (created==false) return res.status(401).json({ message: 'Failed' });
    return res.json({ result:url.meetingURL});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let leavemessageForOutSide = async (req, res) => {
  try {
    //preparedata
    const {title,content,receiver} = req.body;
    const userdata = await user_model.getProfile(receiver);
    const dataNow = new Date().getTime();
    //get server info and create jnj
    const serverInfo= await mcu_api.getServerInfo();
    const jnjData = {
      meetingId:dataNow,
      coordinatorId:userdata.memberId,
      ownerName:userdata.nativeName,
      guestId:dataNow,
      guestName:'OutSideUser',
      invited:1,
      title:title,
      domain:serverInfo.domain,
      primaryIp:serverInfo.primaryIp,
      backupIp:serverInfo.backupIp,
      portm:serverInfo.portm,
      port2:serverInfo.port2,
      joinnetWebApp:serverInfo.joinnetWebApp,
    }
    const url = await mcu_api.createJNJForLeaveMessage(jnjData);
    if(url===false) return res.status(401).json({message:'Failed'});
    const insertData = { meetingId:dataNow, coordinatorId:userdata.memberId, senderId:-1,
      title_s:title,content_s:content,title_r:title,content_r:content,meetingType:2,meetingURL:url.meetingURL,created_at:core_func.strftime(dataNow)
    }
    const created = await model.create(insertData);
    if (created==false) return res.status(401).json({ message: 'Failed' });
    return res.json({ result:url.meetingURL});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let editmessage = async (req, res) => {
  try {
    const {id} = req.user;
    //preparedata
    const {meetingId,title,content,is_mine} = req.body;
    if(is_mine==1){
      const insertData = { title_s:title,content_s:content}
      const created = await model.update(meetingId,insertData);
      if (created==false) return res.status(401).json({ message: 'Failed' });
      return res.json({ message:'success'});
    }else{
      const insertData = { title_r:title,content_r:content}
      const created = await model.update(meetingId,insertData);
      if (created==false) return res.status(401).json({ message: 'Failed' });
      return res.json({ message:'success'});
    }
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let checkMessage = async (req, res) => {
  try {
    const {id} = req.user;
    const {from, to , type , read} = req.body;//0-all,1-received,2-sent
    const received = await model.getR(from,to,id);
    const sent = await model.getS(from,to,id);
    const result = [];
    if(type==0||type==1){
      for(let i = 0 ; i < received.length; i ++){
        const user_id = received[i].coordinatorId;
        const userdata = await user_model.getProfile(user_id);
        const senderdata = await user_model.getProfile(received[i].senderId);
        const jnrFile = await mcu_api.getJnrfile(user_id,received[i].meetingId);
        if(jnrFile === false) continue; 
        if(read!=-1&&read==0&&received[i].is_read!=0) continue;
        if(read!=-1&&read==1&&received[i].is_read==0) continue;
        received[i].created_at =  received[i].created_at?core_func.strftime(received[i].created_at):"";
        received[i].is_mine = 0;
        received[i].fileName = jnrFile.name;
        received[i].fileSize = jnrFile.size;
        received[i].received = 'Received';
        received[i].content = received[i].content_r;
        received[i].title = received[i].title_r;
        received[i].sender = received[i].senderId==-1?'OutSideUser':senderdata.email;
        received[i].receiver = userdata.email;
        received[i].readStatus = received[i].is_read==0?'UnRead':'Read';
        received[i].cloudCopy = received[i].is_cloud==0?'no':'yes';
        result.push(received[i]);
      }
    }
    if(type==0||type==2){
      for(let i = 0 ; i < sent.length; i ++){
        const user_id = sent[i].coordinatorId;
        const userdata = await user_model.getProfile(user_id);
        const senderdata = await user_model.getProfile(sent[i].senderId);
        const jnrFile = await mcu_api.getJnrfile(user_id,sent[i].meetingId);
        if(jnrFile===false) continue; 
        if(read!=-1&&read==0&&sent[i].is_read!=0) continue;
        if(read!=-1&&read==1&&sent[i].is_read==0) continue;      
        sent[i].created_at =  sent[i].created_at?core_func.strftime(sent[i].created_at):"";
        sent[i].is_mine = 1;
        sent[i].fileName = jnrFile.name;
        sent[i].fileSize = jnrFile.size;
        sent[i].received = 'Sent';
        sent[i].content = sent[i].content_s;
        sent[i].title = sent[i].title_s;
        sent[i].sender = senderdata.email;
        sent[i].receiver = userdata.email;
        sent[i].readStatus = sent[i].is_read==0?'UnRead':'Read';
        sent[i].cloudCopy = sent[i].is_cloud==0?'no':'yes';
        result.push(sent[i]);
      }
    }
    return res.json({ result: result});
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
      await model.update(data[i].meetingId,{is_read:status});
    }
    return res.json({ message: 'Success!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let saveToCloud = async (req, res) => {
  try {
    const {id} = req.user;
    const {title, key , meetingId , ownerId, filename} = req.body;//0-all,1-received,2-sent
    const exist = await cloud_model.exist(id,title);
    if (exist) return res.status(401).json({ message: 'This title already exist.' });
    const file_path = mcu_api.get_path(`data/recording/_user/${ownerId}/${meetingId}/${filename}`);
    const fileTosave = ''+ownerId+'_'+meetingId+'.jnr';
    const to_path = path.join(`${__dirname}/../../_public/cloud/${fileTosave}`);
    const copied = await file_c.copyFile(file_path,to_path);
    if(copied==false) res.status(401).json({message:'Failed'});
    const fileSize = file_c.getFileSize('_public/cloud/'+fileTosave);
    const dataitem={
      path:'_public/cloud/'+fileTosave,
      coordinatorId:id,
      keyword:key,
      title:title,
      size:fileSize,
      created_at:core_func.strftime(Date.now())
    }
    const existR = await cloud_model.existRecording(id,'_public/cloud/'+fileTosave);
    if(existR===false) await cloud_model.create(dataitem);
    else await cloud_model.update(existR,dataitem);
    await model.update(meetingId,{is_cloud:1});
    await meeting_model.update(meetingId,{is_cloud:1});
    return res.json({message:'Success'});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
//function
module.exports = {
  leavemessage,
  leavemessageForOutSide,
  getUsers,
  checkMessage,
  editmessage,
  saveToCloud,
  read,
}
