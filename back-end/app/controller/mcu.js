const setting = require('../../config/setting');
const core_func = require('../utils/core_func');
const file_c = require('../controller/file');
const path = require('path');
const { base64shaEncode} = require('../utils/authentication');
const execPhp = require('exec-php');
let getServerInfo = async () => {
  try{
    let serverInfo={
      domain:'HomeMeeting',
      primaryIp:'www.aiflybird.com',
      backupIp:'59.125.26.22',
      portm:2333,
      port2:2345,
      joinnetWebApp:'https://www.flybirdim.com/webjoinnet/'
    }
    const mcuinipath = get_path('webapp/config/mmc.ini');
    const mcuiniFile = await file_c.readFileSync(mcuinipath);
    // split the contents by new line
    const lines = mcuiniFile.split(/\r?\n/);

    // print all lines
    lines.forEach((line) => {
        const LineSt = String(line);
        if(LineSt.indexOf('mcuIp=')!=-1){
          const multiaddress=LineSt.substring(LineSt.lastIndexOf('mcuIp=')+6);
          serverInfo.primaryIp = multiaddress.split(',')[0];
        }
        else if(LineSt.indexOf('mcuPort=')!=-1) serverInfo.portm=LineSt.substring(LineSt.lastIndexOf('mcuPort=')+8)
        else if(LineSt.indexOf('mcuPort2=')!=-1) serverInfo.port2=LineSt.substring(LineSt.lastIndexOf('mcuPort2')+9)
        else if(LineSt.indexOf('joinnetWebApp=')!=-1) serverInfo.joinnetWebApp=LineSt.substring(LineSt.lastIndexOf('joinnetWebApp=')+14)
    });
    return serverInfo;
  }catch(err){
    console.log(err);
    return false;
  }
}
let userStatus = async (memberId) => {
  try {
    const file_path = get_path('data/recording/_status_ip_117.21.178.36.xml');
    const data = await file_c.readXML(file_path);
    if(!data.thirdparty.msgr_directory[0].user) return "Offline";
    const userInfo= data.thirdparty.msgr_directory[0].user;
    for(let i = 0; i< userInfo.length; i++){
        const {messenger_status,office_status,userid} = userInfo[i]['$'];
        if(userid == memberId){
            if(messenger_status == 5)
            return "Offline";
            else if(messenger_status == 2)
            return "Busy";
            else if(messenger_status == 3)
            return "Be Right Back";
            else if(messenger_status == 4)
            return "Away";
            else if(office_status == 2)
            return "In Meeting";
            else if(office_status)
            return "Office Open";
            else if(messenger_status == 0)
            return "Offline";
            else if(messenger_status == 6)
            return "Mobile";
            else
            return "Online";
        }
    }
    return "Offline"; 
  }
  catch (error) {
    console.log(error)
    return "Offline";
  }
}
let meetingStatus = async (ownerId,meetingId) => {
  let statusData = {
    status:0,//0-not started,1-started, 2-over
    participant:0,
    how:"",
    duration:"",
    startTime:"",
    title:"",
    time:false,
    elapsed_time:0,
  };
  try {
    const file_path = get_path(`data/recording/_user/${ownerId}/${meetingId}`);
    const data = await file_c.readfolder(file_path);
    if(data===false) return statusData;
    const recordingXMLexist = getRecordingXMLfileName(data);
    if(recordingXMLexist===false) {
      statusData.status = 1;
      const file_path_participant = get_path(`data/recording/_user/${ownerId}/${meetingId}/participant`);
      if(file_path_participant===false) return statusData;
      const part_files = await file_c.readfolder(file_path_participant);
      if(part_files===false) return statusData;
      const partXMLFileName = getXMLfileName(part_files);
      const xmldata = await file_c.readXML(file_path_participant+'/'+partXMLFileName);
      if(xmldata===false) return statusData;
      if(xmldata.participant.user) {
        statusData.participant=xmldata.participant.user.length;
        statusData.participant_data=xmldata.participant.user;
      }else{
        statusData.participant=0;
        statusData.participant_data=[];
      }
      const _xml = getXMLfileName(data);
      if(_xml!=false){
        statusData.time = String(_xml).substring(String(_xml).lastIndexOf('@')+1,String(_xml).lastIndexOf('.xml'))*1000;
      }
      return statusData;
    }else{
       const xmldata = await file_c.readXML(file_path+'/'+recordingXMLexist);
       statusData.status = 2;
       // <!-- how the meeting is terminated. 0: empty room; 1: owner's request; 2: timer is over; 3: server shutdown; 4: other reason; 5: out of memory; 6: by admin -->
       const how = xmldata.status.how[0];
       if(how==0) statusData.how="Meeting terminated because of empty room."
       else if(how==1) statusData.how="Meeting terminated by owenr's request."
       else if(how==2) statusData.how="Meeting terminated because timer is over."
       else if(how==3) statusData.how="Meeting terminated because server shutdown."
       else if(how==4) statusData.how="Meeting terminated because of other reason."
       else if(how==5) statusData.how="Meeting terminated because of out of memory."
       else if(how==6) statusData.how="Meeting terminated by admin."
       else statusData.how="Meeting terminated because of other reason."
       //starttime
       if(xmldata.status.starttime) statusData.startTime = core_func.strftime(xmldata.status.starttime[0]['$']['utc']*1000)
       if(xmldata.status.duration) statusData.duration = core_func.timeDeltaToDate(xmldata.status.duration*1000);
       if(xmldata.status.elapsed_time) statusData.elapsed_time = xmldata.status.elapsed_time
       if(xmldata.status.title) statusData.title = xmldata.status.title
       if(xmldata.status.participant){
         statusData.participant = xmldata.status.participant.length;
         statusData.participant_data = xmldata.status.participant;
        }
       return statusData;
    }
  }
  catch (error) {
    console.log(error)
    return statusData;
  }
}
let createJNJ = async (data)=>{
  try{
    //prepare data
    const owerId = data.coordinatorId;
    const meetingId = data.meetingId;
    const meetingTitle = data.title;
    const email = data.email;
    const max_guest = data.max_guest;
    const duration =  data.duration;//max 600
    const auto_extension = data.auto_extension;//yes no
    const recording = data.auto_recording;//yes no
    const preparation_mode = data.preparation_mode;//yes no
    const recovery_mode = data.recovery_mode;//2-full 1-static 0-none
    const password = data.password?base64shaEncode(data.password):'';
    const all_questioner = data.all_questioner;// yes no
    const ownerName = data.ownerName?data.ownerName:'';
    const diskQuota = data.diskQuota;
    //for resum meeting
    const previousOwner = data.previousOwner;
    const previousMeetingId = data.previousMeetingId;
    const previousFile = data.previousFile;//without extention
    //server info
    const domain = data.domain?data.domain:'HomeMeeting';
    const primaryIp = data.primaryIp?data.primaryIp:'117.21.178.36';
    const backupIp = data.backupIp?data.backupIp:'117.21.178.36';
    const portm = data.portm?data.portm:2333;
    const port2 = data.port2?data.port2:443;
    const default_joint_browsing_page = data.default_joint_browsing_page?data.default_joint_browsing_page:'';
    const dataNow = new Date().getTime();
    // const dataNowS = Math.floor((dataNow+1000*60*60*24)/1000);
    const dataNowS = Math.floor((dataNow)/1000);
    //prepare dir
    // const file_path1 = get_path('data');
    // const file_path2 = get_path('data/recording');
    // const file_path3 = get_path('data/recording/_user');
    // const file_path4 = get_path(`data/recording/_user/${owerId}`);
    // const file_path5 = get_path(`data/recording/_user/${owerId}/${meetingId}`);
    const xml_file_name = `_recording_${primaryIp}_${dataNow}.xml`;
    const jnj_file_name = `_recording_${primaryIp}_${dataNow}.jnj`;
    // await file_c.createDir(file_path1);
    // await file_c.createDir(file_path2);
    // await file_c.createDir(file_path3);
    // await file_c.createDir(file_path4);
    // await file_c.createDir(file_path5);

    await file_c.createDir(path.join(`${__dirname}/../../_public/temp`));
    const path_files = path.join(`${__dirname}/../../_public/temp`);
    let xmlOBJ = {
      'jnj': {
        'owner': {
          $: {
            'id': owerId,'email': email,
          },
          _: ownerName
        },
        'meetingid':{
          _: meetingId
        },
        'timestamp':{
          _:dataNowS 
        },
        'meetingtitle':{
          _:meetingTitle 
        },
      }
    }
    if(diskQuota) xmlOBJ.jnj['owner']['$']['diskquota']=diskQuota;
    if(max_guest) xmlOBJ.jnj['owner']['$']['maxoutconnection']=max_guest;
    if(password) xmlOBJ.jnj['password']={_:password};
    xmlOBJ.jnj['command']={
      $: {
        'recording': recording,
      },
      _:'meeting'
    };
    if(recording) xmlOBJ.jnj['command']['$']['recording']=recording;
    if(preparation_mode) xmlOBJ.jnj['command']['$']['init_recording_off']=preparation_mode;
    if(duration) xmlOBJ.jnj['command']['$']['duration']=duration;
    if(auto_extension) xmlOBJ.jnj['command']['$']['autoextension']=auto_extension;
    if(all_questioner) xmlOBJ.jnj['command']['$']['all_questioner']=all_questioner;
    if(recovery_mode) xmlOBJ.jnj['command']['$']['recoverymode']=recovery_mode;
    if(default_joint_browsing_page) xmlOBJ.jnj['command']['$']['default_joint_browsing_page']=default_joint_browsing_page;
    if(previousOwner) xmlOBJ.jnj['command']['continuemeeting']={
        $:{
          'userid':previousOwner,
        },
        _:previousMeetingId
    }
    if(previousFile) xmlOBJ.jnj['command']['continuemeeting']['$']['file'] = previousFile;
    const xmlSaved = await file_c.createXML(path_files+'/'+xml_file_name,xmlOBJ);
    if(xmlSaved==false) return false;
    const xmlSavedString = await file_c.StringFromXML(xmlSaved);
    await file_c.delFile(path_files+'/'+xml_file_name);
    if(xmlSavedString==false) return false;
    const processXML = String(xmlSavedString).replace('standalone="yes"','');
    const pkeResult = await pkeEncryption(processXML);
    if(pkeResult==false) return false;
    // const jnjContent = 
    // `# if you see this file, please download and reinstall JoinNet software from http://www.homemeeting.com
    // [general]
    // codetype=13
    // ip=${primaryIp}
    // backupip=${backupIp}
    // domain=${domain}
    // portm=${portm}
    // portm2=${port2}
    // gui_rec_ver=
    // gui_min_ver=
    // userinfo=${pkeResult}`;
    const jnjContent = 
    "# if you see this file, please download and reinstall JoinNet software from http://www.homemeeting.com\n"+
    "[general]\n"+
    "codetype=13\n"+
    "ip="+primaryIp+"\n"+
    "domain="+domain+"\n"+
    "portm="+portm+"\n"+
    "gui_rec_ver=\n"+
    "gui_min_ver=\n"+
    "userinfo="+pkeResult+"\n";
    // const jnjWrited = await file_c.writeFile(jnjContent,path_files+'/'+jnj_file_name);
    // if(!jnjWrited) return false;
    const convertedJNJBASE64 = ""+data.joinnetWebApp+"?jnj="+Buffer.from(jnjContent).toString('base64');
    return {meetingURL:convertedJNJBASE64};
  }catch(err){
    console.log(err);
    return false;
  }
}
let createJNJForJoin = async (data)=>{
  try{
    //prepare data
    const owerId = data.coordinatorId;
    const ownerName = data.ownerName?data.ownerName:'';
    const meetingId = data.meetingId;
    const duration =  data.duration;//max 600
    const password = data.password?base64shaEncode(data.password):'';
    const guestId = data.guestId;
    const guestName = data.guestName?data.guestName:'unknownuser';
    const invited = data.invited;
    const domain = data.domain?data.domain:'HomeMeeting';
    const primaryIp = data.primaryIp?data.primaryIp:'117.21.178.36';
    const backupIp = data.backupIp?data.backupIp:'117.21.178.36';
    const portm = data.portm?data.portm:2333;
    const port2 = data.port2?data.port2:443;
    const dataNow = new Date().getTime();
    // const dataNowS = Math.floor((dataNow+1000*60*60*24)/1000);
    const dataNowS = Math.floor((dataNow)/1000);
    const xml_file_name = `_recording_${primaryIp}_${dataNow}.xml`;
    const jnj_file_name = `_recording_${primaryIp}_${dataNow}.jnj`;
    await file_c.createDir(path.join(`${__dirname}/../../_public/temp`));
    const path_files = path.join(`${__dirname}/../../_public/temp`);
    let xmlOBJ = {
      'jnj': {
        'owner': {
          $: {
            'id': owerId
          },
          _: ownerName
        },
        'meetingid':{
          _: meetingId
        },
        'timestamp':{
          _:dataNowS 
        },
        'guest':{
          '$':{
            invited:invited
          }
        }
      }
    }
    if(password) xmlOBJ.jnj['password']={_:password};
    xmlOBJ.jnj['command']={
      _:'meeting'
    };
    if(guestId) xmlOBJ.jnj['guest']['$']['id']=guestId;
    if(guestName) xmlOBJ.jnj['guest']['_']=guestName;
    if(duration!=0&&duration) xmlOBJ.jnj['command']['$']={duration:duration};
    const xmlSaved = await file_c.createXML(path_files+'/'+xml_file_name,xmlOBJ);
    if(xmlSaved==false) return false;
    const xmlSavedString = await file_c.StringFromXML(xmlSaved);
    await file_c.delFile(path_files+'/'+xml_file_name);
    if(xmlSavedString==false) return false;
    const processXML = String(xmlSavedString).replace('standalone="yes"','');
    const pkeResult = await pkeEncryption(processXML);
    if(pkeResult==false) return false;
    // const jnjContent = 
    // `# if you see this file, please download and reinstall JoinNet software from http://www.homemeeting.com
    // [general]
    // codetype=13
    // ip=${primaryIp}
    // backupip=${backupIp}
    // domain=${domain}
    // portm=${portm}
    // portm2=${port2}
    // gui_rec_ver=
    // gui_min_ver=
    // userinfo=${pkeResult}`;
    const jnjContent = 
    "# if you see this file, please download and reinstall JoinNet software from http://www.homemeeting.com\n"+
    "[general]\n"+
    "codetype=13\n"+
    "ip="+primaryIp+"\n"+
    "domain="+domain+"\n"+
    "portm="+portm+"\n"+
    "gui_rec_ver=\n"+
    "gui_min_ver=\n"+
    "userinfo="+pkeResult+"\n";
    // const jnjWrited = await file_c.writeFile(jnjContent,path_files+'/'+jnj_file_name);
    // if(!jnjWrited) return false;
    const convertedJNJBASE64 =  ""+data.joinnetWebApp+"?jnj="+Buffer.from(jnjContent).toString('base64');
    return {meetingURL:convertedJNJBASE64};
  }catch(err){
    console.log(err);
    return false;
  }
}
let createJNJForPlayback = async (data)=>{
  try{
    //prepare data
    const owerId = data.coordinatorId;
    const ownerName =data.ownerName;
    const meetingId = data.meetingId;
    const password = data.password?base64shaEncode(data.password):'';
    const recordingFile = data.recordingFile;
    const domain = data.domain?data.domain:'HomeMeeting';
    const primaryIp = data.primaryIp?data.primaryIp:'117.21.178.36';
    const backupIp = data.backupIp?data.backupIp:'117.21.178.36';
    const portm = data.portm?data.portm:2333;
    const port2 = data.port2?data.port2:443;
    const dataNow = new Date().getTime();
    // const dataNowS = Math.floor((dataNow+1000*60*60*24)/1000);
    const dataNowS = Math.floor((dataNow)/1000);
    const xml_file_name = `_recording_${primaryIp}_${dataNow}.xml`;
    const jnj_file_name = `_recording_${primaryIp}_${dataNow}.jnj`;
    await file_c.createDir(path.join(`${__dirname}/../../_public/temp`));
    const path_files = path.join(`${__dirname}/../../_public/temp`);
    let xmlOBJ = {
      'jnj': {
        'owner': {
          $: {
            'id': owerId
          },
          _: ownerName
        },
        'meetingid':{
          _: meetingId
        },
        'timestamp':{
          _:dataNowS 
        },
      }
    }
    if(password) xmlOBJ.jnj['password']={_:password};
    xmlOBJ.jnj['command']={
      _:'playback'
    };
    if(recordingFile) xmlOBJ.jnj['command']['$']={file:recordingFile};
    const xmlSaved = await file_c.createXML(path_files+'/'+xml_file_name,xmlOBJ);
    if(xmlSaved==false) return false;
    const xmlSavedString = await file_c.StringFromXML(xmlSaved);
    await file_c.delFile(path_files+'/'+xml_file_name);
    if(xmlSavedString==false) return false;
    const processXML = String(xmlSavedString).replace('standalone="yes"','');
    const pkeResult = await pkeEncryption(processXML);
    if(pkeResult==false) return false;
    const jnjContent = 
    "# if you see this file, please download and reinstall JoinNet software from http://www.homemeeting.com\n"+
    "[general]\n"+
    "codetype=13\n"+
    "ip="+primaryIp+"\n"+
    "domain="+domain+"\n"+
    "portm="+portm+"\n"+
    "gui_rec_ver=\n"+
    "gui_min_ver=\n"+
    "userinfo="+pkeResult+"\n";
    // const jnjWrited = await file_c.writeFile(jnjContent,path_files+'/'+jnj_file_name);
    // if(!jnjWrited) return false;
    const convertedJNJBASE64 =  ""+data.joinnetWebApp+"?jnj="+Buffer.from(jnjContent).toString('base64');
    return {meetingURL:convertedJNJBASE64};
  }catch(err){
    console.log(err);
    return false;
  }
}
let createJNJForLeaveMessage = async (data)=>{
  try{
    //prepare data
    const owerId = data.coordinatorId;
    const ownerName =data.ownerName;
    const meetingTitle = data.title?data.title:'unknown meeting';
    const domain = data.domain?data.domain:'HomeMeeting';
    const primaryIp = data.primaryIp?data.primaryIp:'117.21.178.36';
    const backupIp = data.backupIp?data.backupIp:'117.21.178.36';
    const portm = data.portm?data.portm:2333;
    const port2 = data.port2?data.port2:443;
    const guestId = data.guestId;
    const guestName = data.guestName;
    const invited = data.invited;
    const meetingId = data.meetingId;
    const dataNow = new Date().getTime();
    // const dataNowS = Math.floor((dataNow+1000*60*60*24)/1000);
    const dataNowS = Math.floor((dataNow)/1000);
    const xml_file_name = `_recording_${primaryIp}_${dataNow}.xml`;
    const jnj_file_name = `_recording_${primaryIp}_${dataNow}.jnj`;
    await file_c.createDir(path.join(`${__dirname}/../../_public/temp`));
    const path_files = path.join(`${__dirname}/../../_public/temp`);
    let xmlOBJ = {
      'jnj': {
        'owner': {
          $: {
            'id': owerId
          },
          _: ownerName
        },
        'meetingid':{
          _: meetingId
        },
        'timestamp':{
          _:dataNowS 
        },
        'meetingtitle':{
          _:meetingTitle 
        },
        'guest':{
          '$':{
            invited:invited
          }
        }
      }
    }
    xmlOBJ.jnj['command']={
      '$':{
         recording:1,
      },
      _:'leavemessage'
    };
    if(guestId) xmlOBJ.jnj['guest']['$']['id']=guestId;
    if(guestName) xmlOBJ.jnj['guest']['_']=guestName;
    //create xml
    const xmlSaved = await file_c.createXML(path_files+'/'+xml_file_name,xmlOBJ);
    if(xmlSaved==false) return false;
    //get string from xml
    const xmlSavedString = await file_c.StringFromXML(xmlSaved);
    // await file_c.delFile(path_files+'/'+xml_file_name);
    if(xmlSavedString==false) return false;
    const processXML = String(xmlSavedString).replace('standalone="yes"','');
    //converting pke
    const pkeResult = await pkeEncryption(processXML);
    if(pkeResult==false) return false;
    //make jnj and convert to base64
    const jnjContent = 
    "# if you see this file, please download and reinstall JoinNet software from http://www.homemeeting.com\n"+
    "[general]\n"+
    "codetype=13\n"+
    "ip="+primaryIp+"\n"+
    "domain="+domain+"\n"+
    "portm="+portm+"\n"+
    "gui_rec_ver=\n"+
    "gui_min_ver=\n"+
    "userinfo="+pkeResult+"\n";
    // const jnjWrited = await file_c.writeFile(jnjContent,path_files+'/'+jnj_file_name);
    // if(!jnjWrited) return false;
    const convertedJNJBASE64 =  ""+data.joinnetWebApp+"?jnj="+Buffer.from(jnjContent).toString('base64');
    return {meetingURL:convertedJNJBASE64};
  }catch(err){
    console.log(err);
    return false;
  }
}
let createJNJForCheckMessage = async (data)=>{
  try{
    //prepare data
    const owerId = data.coordinatorId;
    const ownerName =data.ownerName;
    const meetingTitle = data.title?data.title:'Check message';
    const domain = data.domain?data.domain:'HomeMeeting';
    const primaryIp = data.primaryIp?data.primaryIp:'117.21.178.36';
    const backupIp = data.backupIp?data.backupIp:'117.21.178.36';
    const portm = data.portm?data.portm:2333;
    const port2 = data.port2?data.port2:443;
    const invited = data.invited;
    // const dataNowS = Math.floor((dataNow+1000*60*60*24)/1000);
    const dataNowS = Math.floor((dataNow)/1000);
    const xml_file_name = `_recording_${primaryIp}_${dataNow}.xml`;
    const jnj_file_name = `_recording_${primaryIp}_${dataNow}.jnj`;
    await file_c.createDir(path.join(`${__dirname}/../../_public/temp`));
    const path_files = path.join(`${__dirname}/../../_public/temp`);
    let xmlOBJ = {
      'jnj': {
        'owner': {
          $: {
            'id': owerId
          },
          _: ownerName
        },
        'meetingid':{
          _: data.meetingId
        },
        'timestamp':{
          _:dataNowS 
        },
        'meetingtitle':{
          _:meetingTitle 
        },
        // 'guest':{
        //   '$':{
        //     invited:invited
        //   }
        // }
      }
    }
    xmlOBJ.jnj['command']={
      '$':{
         recording:1,
      },
      _:'checkmessage'
    };
    // if(guestId) xmlOBJ.jnj['guest']['$']['id']=guestId;
    // if(guestName) xmlOBJ.jnj['guest']['_']=guestName;
    //create xml
    const xmlSaved = await file_c.createXML(path_files+'/'+xml_file_name,xmlOBJ);
    if(xmlSaved==false) return false;
    //get string from xml
    const xmlSavedString = await file_c.StringFromXML(xmlSaved);
    // await file_c.delFile(path_files+'/'+xml_file_name);
    if(xmlSavedString==false) return false;
    const processXML = String(xmlSavedString).replace('standalone="yes"','');
    //converting pke
    const pkeResult = await pkeEncryption(processXML);
    if(pkeResult==false) return false;
    //make jnj and convert to base64
    const jnjContent = 
    "# if you see this file, please download and reinstall JoinNet software from http://www.homemeeting.com\n"+
    "[general]\n"+
    "codetype=13\n"+
    "ip="+primaryIp+"\n"+
    "domain="+domain+"\n"+
    "portm="+portm+"\n"+
    "gui_rec_ver=\n"+
    "gui_min_ver=\n"+
    "userinfo="+pkeResult+"\n";
    // const jnjWrited = await file_c.writeFile(jnjContent,path_files+'/'+jnj_file_name);
    // if(!jnjWrited) return false;
    const convertedJNJBASE64 =  ""+data.joinnetWebApp+"?jnj="+Buffer.from(jnjContent).toString('base64');
    return {meetingURL:convertedJNJBASE64};
  }catch(err){
    console.log(err);
    return false;
  }
}

let pkeEncryption = async (plainText)=>{
  try{
    const privateKeyPath=get_path('webapp/key/key_web_localhost');
    const publicKeyPath=get_path('webapp/key/key_mcu_localhost.x509');
    const pkeEncryptionExepath=get_path('webapp/bin/jnjencryptor/jnjencryptor.exe')
    const siteId="key_web_localhost";
    const passPhrase="autogenerate";
    const nowDate = String(new Date().getTime());
    const res = await new Promise((resolve, reject) => {
      execPhp('./pke.php', function(error, php, outprint){
        php.pkeencrypt(plainText, privateKeyPath,publicKeyPath,pkeEncryptionExepath,siteId,passPhrase,nowDate, function(err, result, output, printed){
          // console.log(err)
          // console.log(output)
          // console.log(printed);
          // console.log(result)
          if(!result||result.length==0) return resolve(false);
          return resolve(result[0]);
          // result is now `3'
          // output is now `One'.
          // printed is now `Two'.
        });
      });
    });
    return res;
  }catch(err){
    return false;
  }
}
//function
let get_path = (path_name)=>{
   const mcu_path = path.join(`${__dirname}/../../../../`+setting.mmcPath+path_name);
   return mcu_path;
}
let getRecordingXMLfileName = (files)=>{
  try{
    for(let i =0 ; i < files.length; i++){
      const ext = files[i].substring(files[i].lastIndexOf('.'));
      if(ext=='.xml' && String(files[i]).indexOf('_recording')!=-1)  return files[i];
    }
    return false;
  }catch(err){
    console.log(err);
    return false;
  }
}
let getXMLfileName = (files)=>{
  try{
    for(let i =0 ; i < files.length; i++){
      const ext = files[i].substring(files[i].lastIndexOf('.'));
      if(ext=='.xml')  return files[i];
    }
    return false;
  }catch(err){
    console.log(err);
    return false;
  }
}
let getJnrfile = async (ownerId,meetingId) => {
  try{
    const file_path = get_path(`data/recording/_user/${ownerId}/${meetingId}`);
    const data = await file_c.readfolder(file_path);
    if(data===false) return false;
    for(let i =0 ; i < data.length; i++){
      const ext = data[i].substring(data[i].lastIndexOf('.'));
      if(ext=='.jnr'){
        const file_size = file_c.sizeOfFile(file_path+'/'+data[i]);
        return {size:file_size,name:data[i]};
      }
    }
    return false;
  }catch(err){
    console.log(err);
    return false;
  }
}
let getTerminateStatus = (status)=>{
  if(status==0) return 'empty room'
  else if(status==1) return 'owner\'s request'
  else if(status==2) return 'timer is over'
  else if(status==3) return 'server shutdown'
  else if(status==4) return 'other reason'
  else if(status==5) return 'out of memory'
  else if(status==6) return 'by admin'
  else return 'something went wrong'
}
const test = async()=>{
   const result =  await userStatus(3);
   console.log(result)
}
// createJNJ()
// pkeEncryption();
getServerInfo();
// meetingStatus(115,1625556866758)
module.exports = {
  userStatus,
  meetingStatus,
  getServerInfo,
  get_path,
  createJNJ,
  createJNJForJoin,
  createJNJForPlayback,
  getJnrfile,
  createJNJForLeaveMessage,
  createJNJForCheckMessage,
}
