const setting = require('../../config/setting');
const model = require('../model/meeting');
const event_model = require('../model/event');
const user_model = require('../model/user');
const core_func = require('../utils/core_func');
const mcu_api = require('../controller/mcu');
const msg_model = require('../model/message');
let getInstantMeeting = async (req, res) => {
  try {
    const {id} = req.user;
    await overmeeting(id);
    const hosted = await model.getInstantMeetingAsHost(id);
    const invited = await model.getInstantMeetingAsParticipant(id);
    const result = [];
    for(let i = 0 ; i < hosted.length; i ++){
      const users = await model.getParticipant(hosted[i].meetingId);
      const meetingStatus = await mcu_api.meetingStatus(hosted[i].coordinatorId,hosted[i].meetingId);
      hosted[i].invitedusers = users.length;
      hosted[i].status = meetingStatus.status;
      hosted[i].participant = meetingStatus.participant;
      hosted[i].participant_data = meetingStatus.participant_data;
      hosted[i].is_host = true;
      hosted[i].started_at =  hosted[i].started_at?core_func.strftime(hosted[i].started_at):"";
      result.push(hosted[i]);
    }
    for(let i = 0 ; i < invited.length; i ++){
      const users = await model.getParticipant(invited[i].meetingId);
      const meetingStatus = await mcu_api.meetingStatus(invited[i].coordinatorId,invited[i].meetingId);
      invited[i].meetingURL = invited[i].joinURL;
      invited[i].invitedusers = users.length;
      invited[i].status = meetingStatus.status;
      invited[i].participant = meetingStatus.participant;
      invited[i].participant_data = meetingStatus.participant_data;
      invited[i].is_host = false;
      invited[i].started_at =  invited[i].started_at?core_func.strftime(invited[i].started_at):"";
      invited[i].ended_at =  invited[i].ended_at?core_func.strftime(invited[i].ended_at):"";
      result.push(invited[i]);
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
let getAllMeeting = async (req, res) => {
  try {
    const {id} = req.user;
    await overmeeting(id);
    const item = await model.getAllMeeting(id);
    const result = [];
    for(let i = 0 ; i < item.length; i ++){
      const users = await model.getParticipant(item[i].meetingId);
      const meetingStatus = await mcu_api.meetingStatus(item[i].coordinatorId,item[i].meetingId);
      item[i].invitedusers = users.length;
      item[i].status = meetingStatus.status;
      item[i].participant = meetingStatus.participant;
      item[i].participant_data = meetingStatus.participant_data;
      item[i].is_host = true;
      item[i].event_type = "meeting";
      item[i].started_at =  item[i].started_at?core_func.strftime(item[i].started_at):"";
      result.push(item[i]);
    }
    const event = await event_model.getter(id);
    for(let i = 0 ; i < event.length; i ++){
      event[i].start_time = core_func.strftime(event[i].start_time);
      event[i].end_time = core_func.strftime(event[i].end_time);
      event[i].event_type = "event";
      result.push(event[i]);
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
let getHistoryMeeting = async (req, res) => {
  try {
    const {id} = req.user;
    const {from, to , type} = req.body;
    await overmeeting(id);
    const hosted = await model.getHistoryAsHost(id,from,to);
    const invited = await model.getHistoryParticipant(id,from,to);
    const result = [];
    for(let i = 0 ; i < hosted.length; i ++){
      if(hosted[i].ended==0) continue;
      if(type!=0 && type!=1) continue;
      const users = await model.getParticipant(hosted[i].meetingId);
      const meetingStatus = await mcu_api.meetingStatus(hosted[i].coordinatorId,hosted[i].meetingId);
      hosted[i].invitedusers = users.length;
      hosted[i].users = users;
      hosted[i].status = meetingStatus.status;
      hosted[i].participant = meetingStatus.participant;
      hosted[i].participant_data = meetingStatus.participant_data;
      hosted[i].is_host = true;
      hosted[i].started_at =  hosted[i].started_at?core_func.strftime(hosted[i].started_at):"";
      if(hosted[i].meetingType==1){
        const recur = await model.getRecurrenceOne(hosted[i].meetingId);
        if(recur===false){
          hosted[i].repeat = 0;
        }else{
          hosted[i].repeat = 1;
          hosted[i].recur = recur;
        }
      }
      result.push(hosted[i]);
    }
    for(let i = 0 ; i < invited.length; i ++){
      if(invited[i].ended==0) continue;
      if(type!=0 && type!=1) continue;
      const users = await model.getParticipant(invited[i].meetingId);
      const meetingStatus = await mcu_api.meetingStatus(invited[i].coordinatorId,invited[i].meetingId);
      invited[i].meetingURL = invited[i].joinURL;
      invited[i].invitedusers = users.length;
      invited[i].status = meetingStatus.status;
      invited[i].users = users;
      invited[i].participant = meetingStatus.participant;
      invited[i].participant_data = meetingStatus.participant_data;
      invited[i].is_host = false;
      invited[i].started_at =  invited[i].started_at?core_func.strftime(invited[i].started_at):"";
      invited[i].ended_at =  invited[i].ended_at?core_func.strftime(invited[i].ended_at):"";
      if(invited[i].meetingType==1){
        const recur = await model.getRecurrenceOne(invited[i].meetingId);
        if(recur===false){
          invited[i].repeat = 0;
        }else{
          invited[i].repeat = 1;
          invited[i].recur = recur;
        }
      }
      result.push(invited[i]);
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
let getRecordingMeeting = async (req, res) => {
  try {
    const {id} = req.user;
    await overmeeting(id);
    const history = await model.getMeetingHistory(id);
    const result = [];
    for(let i = 0 ; i < history.length; i ++){
      const jnrFile = await mcu_api.getJnrfile(id,history[i].meetingId);
      if(jnrFile===false) continue; 
      history[i].started_at =  history[i].started_at?core_func.strftime(history[i].started_at):"";
      history[i].ended_at =  history[i].ended_at?core_func.strftime(history[i].ended_at):"";
      history[i].fileName = jnrFile.name;
      history[i].fileSize = jnrFile.size;
      result.push(history[i]);
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
let createInstantMeeting = async (req, res) => {
  try {
    //preparedata
    const {id} = req.user;
    const userdata = await user_model.getProfile(id);
    const data = req.body;
    const {title,auto_recording,start_time,end_time,duration,users,auto_extension,password,
      all_questioner,default_joint_browsing_page,
      resume,previousOwner,previousMeetingId,previousFile,
      meetingType,agenda,repeat,
    } = data;
    const durForJNJ = meetingType==0?0:duration;
    if(data.meetingId) await model.del(data.meetingId);
    const meetingId = data.meetingId?data.meetingId:String(new Date().getTime());
    // check validation
    // const existMeeting = await model.getInstantMeetingAsHost(id);
    // if (existMeeting.length>0) return res.status(401).json({ message: 'You are already hosted instant meeting' });
    const exist = await model.exist(meetingId,title);
    if (exist) return res.status(401).json({ message: 'This subject already exist.' });
    //get server info and create jnj
    const serverInfo= await mcu_api.getServerInfo();
    if(serverInfo==false) return res.status(401).json({ message: 'ServerInfo ini file is not exist.' });
    const JNJcreated = await createJNJ(meetingId,id,userdata.nativeName,title,auto_extension,auto_recording,durForJNJ,password,
      all_questioner,default_joint_browsing_page,serverInfo,previousOwner,previousMeetingId,previousFile);
    if(JNJcreated==false) return res.status(401).json({ message: 'JNJ create failed' });
    // const shareCreated = await createShare(id,userdata.nativeName,meetingId,durForJNJ,serverInfo);
    //createTodatabase
    const insertData = { meetingId:meetingId, coordinatorId:id,
      title:title,meetingType:meetingType,
      auto_recording:auto_recording,start_time:start_time,
      end_time:end_time,duration:duration,agenda:agenda?agenda:'',jointBrowsingURL:default_joint_browsing_page?default_joint_browsing_page:'',
      auto_extension:auto_extension,meetingURL:JNJcreated.meetingURL,resume:resume,
      created_at:core_func.strftime(Date.now()),
    }
    const created = await model.create(insertData);
    if (created==false) return res.status(401).json({ message: 'Create meeting failed' });
    //createparticipant
    await makeparticipant(id,userdata.nativeName,meetingId,users,durForJNJ,serverInfo);
    //createrecurrence
    if (repeat==1) await createRecurrence(meetingId,data);
    return res.json({ message: 'Success'});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let startMeeting = async (req, res) => {
  try {
    const {meetingId} = req.body;
    const insertData = {
      started_at:core_func.strftime(Date.now()),
    }
    await model.update(meetingId,insertData);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let cancelMeeting = async (req, res) => {
  try {
    const {meetingId,reason} = req.body;
    const insertData = {
      ended:1,
      ended_at:core_func.strftime(Date.now()),
      end_reason:reason,
    }
    await model.update(meetingId,insertData);
    // await model.delParticipantByMeetingId(meetingId);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let editInstantParticipant = async (req, res) => {
  try {
    const {id} = req.user;
    const userdata = await user_model.getProfile(id);
    //get server info and create jnj
    const serverInfo= await mcu_api.getServerInfo();
    if(serverInfo==false) return res.status(401).json({ message: 'ServerInfo ini file is not exist.' });
    const data = req.body;
    const {users,meetingId} = data;
    const meeting = await model.getOne(meetingId);
    if (meeting==false) return res.status(401).json({ message: 'This meeting is not exist' });
    await makeparticipant(id,meetingId,userdata.nativeName,users,serverInfo);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let cancelParticipant = async (req, res) => {
  try {
    const {data} = req.body;
    for(let i = 0 ; i < data.length; i++)
    await model.delParticipant(data[i].participantId);
    return res.json({message: 'Success' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let del = async (req, res) => {
  try {
    const {meetingId} = req.body;
    await model.del(meetingId);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let getplayback = async (req, res) => {
  try {
    //preparedata
    const {coordinatorId,meetingId,password,meetingType,is_mine} = req.body;
    const userdata = await user_model.getProfile(coordinatorId);
    //get server info and create jnj
    const serverInfo= await mcu_api.getServerInfo();
    const jnjData = {
      meetingId:meetingId,
      coordinatorId:coordinatorId,
      ownerName:userdata?userdata.nativeName:'',
      recordingFile:'',
      password:password?password:'',
      domain:serverInfo.domain,
      primaryIp:serverInfo.primaryIp,
      backupIp:serverInfo.backupIp,
      portm:serverInfo.portm,
      port2:serverInfo.port2,
      joinnetWebApp:serverInfo.joinnetWebApp,
    }
    const url = await mcu_api.createJNJForPlayback(jnjData);
    if(url===false) return res.status(401).json({message:'This meeting can\'t playback.'});
    if(meetingType==0||meetingType==1){
      const old = await model.getOne(meetingId);
      await model.update(meetingId,{is_read:old.is_read+1});
    }
    if(meetingType==2){
      const old = await msg_model.getOne(meetingId);
      await msg_model.update(meetingId,{is_read:old.is_read+1});
    }
    return res.json({ result:url.meetingURL});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let getShare = async (req, res) => {
  try {
    //preparedata
    const {id} = req.user;
    const {data,user} = req.body;
    const {coordinatorId,meetingId,duration,meetingType,password} = data;
    const userdata = await user_model.getProfile(coordinatorId);
    const serverInfo= await mcu_api.getServerInfo();
    //get server info and create jnj
    const durForJNJ = meetingType==0?0:duration;
    const shareCreated = await createShare(userdata.memberId,userdata.nativeName,meetingId,durForJNJ,user,serverInfo);
    if(shareCreated===false) return res.status(401).json({message:'Failed.'})
    return res.json({ result:shareCreated});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let restart = async (req, res) => {
  try {
    //preparedata
    const {id} = req.user;
    const userdata = await user_model.getProfile(id);
    const data = req.body;
    const {title,auto_recording,duration,auto_extension,password,
      all_questioner,default_joint_browsing_page,meetingType} = data;
    const durForJNJ = meetingType==0?false:duration;
    if(data.meetingId) await model.del(data.meetingId);
    const meetingId = String(new Date().getTime());
    // check validation
    // const existMeeting = await model.getInstantMeetingAsHost(id);
    // if (existMeeting.length>0) return res.status(401).json({ message: 'You are already hosted instant meeting' });
    const exist = await model.exist(title);
    if (exist) return res.status(401).json({ message: 'This subject already exist.' });
    //get server info and create jnj
    const serverInfo= await mcu_api.getServerInfo();
    const jnrFile = await mcu_api.getJnrfile(id,data.meetingId);
    if(serverInfo==false) return res.status(401).json({ message: 'We can\'t this resume meeting.' });
    const previousFile = jnrFile?String(jnrFile.name).replace('.jnr',''):'';
    if(serverInfo==false) return res.status(401).json({ message: 'ServerInfo ini file is not exist.' });
    const JNJcreated = await createJNJ(meetingId,id,userdata.nativeName,title,auto_extension,auto_recording,durForJNJ,password,
      all_questioner,default_joint_browsing_page,serverInfo,id,data.meetingId,previousFile);
    if(JNJcreated==false) return res.status(401).json({ message: 'JNJ create failed' });
    //createTodatabase
    const startTime = core_func.strftime(Date.now());
    const endTime = core_func.strftime(new Date(startTime).getTime()+data.duration*1000*60);
    const insertData = { meetingId:meetingId, coordinatorId:data.coordinatorId,
      title:data.title,meetingType:data.meetingType,
      auto_recording:data.auto_recording,start_time:startTime,
      end_time:endTime,duration:data.duration,agenda:data.agenda?data.agenda:'',
      auto_extension:data.auto_extension,meetingURL:JNJcreated.meetingURL,
      ended:0,
      created_at:core_func.strftime(Date.now()),
    }
    const created = await model.create(insertData);
    if (created==false) return res.status(401).json({ message: 'Resume meeting failed' });
    return res.json({ message: 'Success'});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
//##fro leanr
let recordingLearnNew = async (req, res) => {
  try {
    //preparedata
    const { id } = req.user;
    const userdata = await user_model.getProfile(id);
    const data = {
      title: 'Learn new',
      duration: false,
    }
    const { title, auto_recording, start_time, end_time, duration, users, auto_extension, password,
      all_questioner, default_joint_browsing_page,
      resume, previousOwner, previousMeetingId, previousFile,
      meetingType, agenda, repeat } = data;
    const durForJNJ = duration;
    const meetingId = String(new Date().getTime());
    // check validation
    // const existMeeting = await model.getInstantMeetingAsHost(id);
    // if (existMeeting.length>0) return res.status(401).json({ message: 'You are already hosted instant meeting' });
    const exist = await model.exist(meetingId, title);
    if (exist) return res.status(401).json({ message: 'This subject already exist.' });
    //get server info and create jnj
    const serverInfo = await mcu_api.getServerInfo();
    if (serverInfo == false) return res.status(401).json({ message: 'ServerInfo ini file is not exist.' });
    const JNJcreated = await createJNJ(meetingId, id, userdata.nativeName, title, auto_extension, auto_recording, durForJNJ, password,
      all_questioner, default_joint_browsing_page, serverInfo, previousOwner, previousMeetingId, previousFile);
    if (JNJcreated == false) return res.status(401).json({ message: 'JNJ create failed' });
    // const shareCreated = await createShare(id,userdata.nativeName,meetingId,durForJNJ,serverInfo);
    
    return res.json({ message: 'Success', result: JNJcreated.meetingURL});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
//function
let existRecurrence = async ()=>{
  try{
   const recurs = await model.getRecurrence();
   for(let i = 0; i < recurs.length; i++){
    const {meetingId,recure_mode,day_mode,day_dur,week_dur,month_method,m_date,m_month,m_week,m_day,m_week_month,start_recur,end_method,end_recur,end_round,week_dates} = recurs[i];
    const meeting = await model.getOne(meetingId);
    if(meeting==false) continue;
    if(recure_mode==0){
      const start_day = core_func.strftime();
      return {start:start_day};
    }
    // else if(recure_mode==1){
    //   const daysSel = String(week_dates).split(',');
    //   for(let i = 0; i < daysSel.length; i ++){
    //     const startofweek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) + Number(daysSel[i])-1;
    //     const start_day = this.cf.getDateStringYYYYMMDD(new Date().setDate(startofweek));
    //     if(new Date(start_day).getTime()>=today.getTime()){
    //       return {start:start_day};
    //     }
    //   }
    //   const startofweek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) + Number(daysSel[0])-1+7;
    //   const start_day = this.cf.getDateStringYYYYMMDD(new Date().setDate(startofweek));
    //   return {start:start_day};
    // }
    // else if(recure_mode==2){
    //   if(month_method==0){
    //     const start_day = new Date(today.getFullYear(), today.getMonth(), m_date);
    //     if(new Date(start_day).getTime()>=today.getTime()){
    //       return {start:this.cf.getDateStringYYYYMMDD(start_day)};
    //     }else{
    //       return {start:this.cf.getDateStringYYYYMMDD(new Date(start_day).setMonth(today.getMonth()+1))};
    //     }
    //   }
    //   else if(month_method==1){
    //     const startWeek = new Date(today.getFullYear(), today.getMonth(), 1);
    //     const lastWeek = new Date(today.getFullYear(), today.getMonth()+1, 0);
    //     const startofweek = m_week!=4?startWeek.getDate() - startWeek.getDay() + (startWeek.getDay() === 0 ? -6 : 1) + (0 + m_day -1) + m_week * 7:lastWeek.getDate() - lastWeek.getDay() + (lastWeek.getDay() === 0 ? -6 : 1) + (0+m_day -1);
    //     const start_day = this.cf.getDateStringYYYYMMDD(new Date().setDate(startofweek));
    //     if(new Date(start_day).getTime()>=today.getTime()){
    //       return {start:this.cf.getDateStringYYYYMMDD(start_day)};
    //     }else{
    //       const startWeeknext = new Date(today.getFullYear(), today.getMonth()+1, 1);
    //       const lastWeeknext = new Date(today.getFullYear(), today.getMonth()+2, 0);
    //       const startofweeknext = m_week!=4?startWeeknext.getDate() - startWeeknext.getDay() + (startWeeknext.getDay() === 0 ? -6 : 1) + (0 + m_day -1) + m_week * 7:lastWeeknext.getDate() - lastWeeknext.getDay() + (lastWeeknext.getDay() === 0 ? -6 : 1) + (0+m_day -1);
    //       const start_daynext = this.cf.getDateStringYYYYMMDD(new Date(new Date().setMonth(new Date().getMonth()+1)).setDate(startofweeknext));
    //       return {start:this.cf.getDateStringYYYYMMDD(start_daynext)};
    //     }
    //   }
    // }
   }
  }catch(err){
   console.log(err);
   return false;
  }
}
let createRecurrence = async (meetingId,data)=>{
  try{
    const createData = {
      recure_mode:data.recure_mode,//0-day, //1-week, // 2- month
      day_mode:data.day_mode,//0-every day, 1- select day
      day_dur:data.day_dur,
      week_dur:data.week_dur,
      week_dates:data.week_dates,
      month_method:data.month_method,//0-special  day of month, 1-method two
      m_date:data.m_date,
      m_month:data.m_month,
      m_week:data.m_week,//first - last 0 - 4
      m_day:data.m_day,//sun-saturday
      m_week_month:data.m_week_month,
      start_recur:core_func.strftime(data.start_recur),
      end_method:data.end_method,//0-special time, 1-after rounds of meeting, 2-unlimited
      end_recur:core_func.strftime(data.end_recur),
      end_round:data.end_round,
    }
    await model.createRecurrence(meetingId,createData);
    return true;
  }catch(err){
   console.log(err);
   return false;
  }
}
let overmeeting = async (userId)=>{
  try{
    const id = userId;
    const hosted = await model.getInstantMeetingAsHost(id);
    const invited = await model.getInstantMeetingAsParticipant(id);
    for(let i = 0 ; i < hosted.length; i ++){
      if(hosted[i].ended==1) continue;
      const meetingStatus = await mcu_api.meetingStatus(hosted[i].coordinatorId,hosted[i].meetingId);
      if(meetingStatus.status==2){
        const insertData = {
          ended:1,
          ended_at:core_func.strftime(Date.now()),
          end_reason:meetingStatus.how,
        }
        await model.update(hosted[i].meetingId,insertData);
      }
    
      else if(meetingStatus.status == 1  && !hosted[i].started_at){
        const insertData = {
          started_at:meetingStatus.time!==false?core_func.strftime(meetingStatus.time):core_func.strftime(Date.now()),
        }
        await model.update(hosted[i].meetingId,insertData);
      }
    }
    for(let i = 0 ; i < invited.length; i ++){
      if(invited[i].ended==1) continue;
      const meetingStatus = await mcu_api.meetingStatus(invited[i].coordinatorId,invited[i].meetingId);
      if(meetingStatus.status==2){
        const insertData = {
          ended:1,
          ended_at:core_func.strftime(Date.now()),
          end_reason:meetingStatus.how,
        }
        await model.update(invited[i].meetingId,insertData);
      }
      else if(meetingStatus.status == 1 && !invited[i].started_at){
        const insertData = {
          started_at:meetingStatus.time!==false?core_func.strftime(meetingStatus.time):core_func.strftime(Date.now()),
        }
        await model.update(invited[i].meetingId,insertData);
      }
    }
    return true;
  }catch(err){
   console.log(err);
   return false;
  }
}
let makeparticipant = async (userid,ownerName,meetingId,users,duration,serverInfo)=>{
  try{
    for(let i =0; i < users.length; i++){
      const participantdata = await user_model.getProfile(users[i].memberId);
      const joinData = {
        domain:serverInfo.domain,
        primaryIp:serverInfo.primaryIp,
        backupIp:serverInfo.backupIp,
        portm:serverInfo.portm,
        port2:serverInfo.port2,
        joinnetWebApp:serverInfo.joinnetWebApp,
        meetingId:meetingId,
        coordinatorId:userid,
        duration:duration,
        ownerName:ownerName,
        guestId:users[i].memberId,
        guestName:participantdata?participantdata.nativeName:String(new Date().getTime()),
        invited:1,
      };
      const joinJNJCreated = await mcu_api.createJNJForJoin(joinData);
      if(joinJNJCreated==false) continue;
      await model.createParticipant({memberId:users[i].memberId,meetingId:meetingId,joinURL:joinJNJCreated.meetingURL})
    }
    return true;
  }catch(err){
   console.log(err);
   return false;
  }
}
let createShare = async (userid,ownerName,meetingId,duration,inviteUser,serverInfo)=>{
  try{
      const joinData = {
        domain:serverInfo.domain,
        primaryIp:serverInfo.primaryIp,
        backupIp:serverInfo.backupIp,
        portm:serverInfo.portm,
        port2:serverInfo.port2,
        joinnetWebApp:serverInfo.joinnetWebApp,
        meetingId:meetingId,
        coordinatorId:userid,
        duration:duration,
        ownerName:ownerName,
        invited:1,
        guestName:inviteUser.name,
      };
      const joinJNJCreated = await mcu_api.createJNJForJoin(joinData);
      if(joinJNJCreated==false) return false;
      return joinJNJCreated.meetingURL;
  }catch(err){
   console.log(err);
   return false;
  }
}
let createJNJ = async (meetingId,coordinatorId,ownerName,title,auto_extension,auto_recording,duration,
  password,all_questioner,default_joint_browsing_page,serverInfo,
  previousOwner,previousMeetingId,previousFile)=>{
  try{
    //get server info and create jnj
    const jnjData = {
      domain:serverInfo.domain,
      primaryIp:serverInfo.primaryIp,
      backupIp:serverInfo.backupIp,
      portm:serverInfo.portm,
      port2:serverInfo.port2,
      joinnetWebApp:serverInfo.joinnetWebApp,
      meetingId:meetingId,
      coordinatorId:coordinatorId,
      ownerName:ownerName?ownerName:String(new Date().getTime()),
      title:title,
      auto_extension:auto_extension,
      auto_recording:auto_recording,
      duration:duration,
      password:password,
      all_questioner:all_questioner,
      default_joint_browsing_page:default_joint_browsing_page,
      previousOwner:previousOwner,
      previousMeetingId:previousMeetingId,
      previousFile:previousFile
    };
    const JNJcreated = await mcu_api.createJNJ(jnjData);
    return JNJcreated;
  }catch(err){
   console.log(err);
   return false;
  }
}
let createWebOffice = async (host,participant)=>{
  const meetingId = new Date().getTime();
  const title = ""+host.email+"-"+participant.email;
  const auto_extension = '';
  const auto_recording = 0;
  const durForJNJ = false;
  const password = false;
  const all_questioner = false;
  const default_joint_browsing_page = '';
  const previousOwner = false;
  const previousMeetingId = false;
  const previousFile = false;
  const serverInfo= await mcu_api.getServerInfo();
  try{
    const hostJNJ = await createJNJ(meetingId,host.memberId,host.nativeName,title,auto_extension,auto_recording,durForJNJ,password,
      all_questioner,default_joint_browsing_page,serverInfo,previousOwner,previousMeetingId,previousFile);
    if(hostJNJ==false) return false;
    const joinData = {
      domain:serverInfo.domain,
      primaryIp:serverInfo.primaryIp,
      backupIp:serverInfo.backupIp,
      portm:serverInfo.portm,
      port2:serverInfo.port2,
      joinnetWebApp:serverInfo.joinnetWebApp,
      meetingId:meetingId,
      coordinatorId:host.memberId,
      duration:durForJNJ,
      ownerName:host.nativeName,
      guestId:participant.memberId,
      guestName:participant.nativeName,
      invited:1,
    };
    const joinJNJ = await mcu_api.createJNJForJoin(joinData);
    return {host:hostJNJ.meetingURL,join:joinJNJ.meetingURL};
  }catch(err){
   console.log(err);
   return false;
  }
}
module.exports = {
  getInstantMeeting,
  getAllMeeting,
  getHistoryMeeting,
  createInstantMeeting,
  editInstantParticipant,
  startMeeting,
  cancelMeeting,
  cancelParticipant,
  getRecordingMeeting,
  del,
  getplayback,
  restart,
  existRecurrence,
  getShare,
  createWebOffice,
  recordingLearnNew,
}
