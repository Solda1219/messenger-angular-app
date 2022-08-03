const query = require('../utils/sqlQuery');
const table = 'table_meeting';
const table_participant = 'table_participant';
const table_user = 'member';
const table_ecard = 'table_ecard';
const table_recurrence = 'table_recurrence';
const index = 'meetingId';
const unique_field = 'title';
let getter = async () => {
    try {
       const item = await query.get(table,'*');
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getOne = async (meetingId) => {
    try {
       const item = await query.get(table,'*',`WHERE meetingid = ${meetingId}`);
       if(item.length==0) return false;
       return item[0];
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let getAllMeeting = async (coordinatorId) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT 
           ${table}.*,
           ${table_user}.email,
           ${table_ecard}.qr_code
           FROM ${table}
           LEFT JOIN ${table_user}
           ON ${table}.coordinatorId = ${table_user}.memberId
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${table_user}.memberId
           WHERE ${table}.coordinatorId = ${coordinatorId}
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getMeetingForRecording = async (coordinatorId,from,to) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT 
           ${table}.*,
           ${table_user}.email,
           ${table_ecard}.qr_code
           FROM ${table}
           LEFT JOIN ${table_user}
           ON ${table}.coordinatorId = ${table_user}.memberId
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${table_user}.memberId
           WHERE ${table}.coordinatorId = ${coordinatorId} AND ended_at > '${from}' AND ended_at < '${to}'  ORDER BY ${table}.ended_at DESC
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getInstantMeetingAsHost = async (coordinatorId) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT 
           ${table}.*,
           ${table_user}.email,
           ${table_ecard}.qr_code
           FROM ${table}
           LEFT JOIN ${table_user}
           ON ${table}.coordinatorId = ${table_user}.memberId
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${table_user}.memberId
           WHERE ${table}.coordinatorId = ${coordinatorId} AND ended = 0 ORDER BY ${table}.start_time DESC
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getInstantMeetingAsParticipant = async (memberId) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT 
           ${table}.*,
           ${table_user}.email,
           ${table_ecard}.qr_code,
           ${table_participant}.joinURL,
           ${table_participant}.participantId
           FROM ${table_participant}
           LEFT JOIN ${table}
           ON ${table}.meetingId = ${table_participant}.meetingId
           LEFT JOIN ${table_user}
           ON ${table}.coordinatorId = ${table_user}.memberId
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${table_user}.memberId
           WHERE ${table_participant}.memberId = ${memberId} ORDER BY ${table}.start_time DESC
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getHistoryAsHost = async (coordinatorId,from,to) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT 
           ${table}.*,
           ${table_user}.email,
           ${table_ecard}.qr_code
           FROM ${table}
           LEFT JOIN ${table_user}
           ON ${table}.coordinatorId = ${table_user}.memberId
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${table_user}.memberId
           WHERE ${table}.coordinatorId = ${coordinatorId} AND ended = 1 AND ended_at > '${from}' AND ended_at < '${to}'  ORDER BY ${table}.ended_at DESC
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getHistoryParticipant = async (memberId,from,to) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT 
           ${table}.*,
           ${table_user}.email,
           ${table_ecard}.qr_code,
           ${table_participant}.joinURL,
           ${table_participant}.participantId
           FROM ${table_participant}
           LEFT JOIN ${table}
           ON ${table}.meetingId = ${table_participant}.meetingId
           LEFT JOIN ${table_user}
           ON ${table}.coordinatorId = ${table_user}.memberId
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${table_user}.memberId
           WHERE ${table_participant}.memberId = ${memberId} AND ${table}.ended = 1 AND ${table}.ended_at > '${from}' AND ${table}.ended_at < '${to}'  ORDER BY ${table}.ended_at DESC
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getMeetingHistory = async (coordinatorId) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT 
           ${table}.*,
           ${table_user}.email,
           ${table_ecard}.qr_code
           FROM ${table}
           LEFT JOIN ${table_user}
           ON ${table}.coordinatorId = ${table_user}.memberId
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${table_user}.memberId
           WHERE ${table}.coordinatorId = ${coordinatorId} AND  ${table}.ended= 1 ORDER BY ${table}.start_time DESC
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let create = async (data) => {
    try {
       const item = await query.create(table,data);  
       return item
    }
    catch (err) {
       console.log(err);
       return false
    }
}
let update = async (id,data) => {
    try {
       await query.update(table,data,`WHERE ${index}=${id}`);
       return true
    }
    catch (err) {
        return false;
    }
}
let del = async (id) => {
    try {
       await query.del(table,`WHERE ${index} = ${id}`);  
       await query.del(table_participant,`WHERE ${index} = ${id}`);  
       await query.del(table_recurrence,`WHERE ${index} = ${id}`);  
       return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let exist = async (meetingId,val) => {
    try {
       const item = await query.get(table,'*',`WHERE ${unique_field}='${val}' AND not ${index}='${meetingId}'`);
       if(item.length==0) return false;
       return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let existNotMe = async (id,val) => {
    try {
       const item = await query.get(table,'*',`WHERE ${unique_field}='${val}' AND NOT ${index} = ${id}`);
       if(item.length==0) return false;
       return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
let getParticipant = async (meetingId) => {
    try {
       const item = await query.lawQuery(`
       SELECT
       ${table_participant}.*,
       ${table_user}.nativeName
       FROM ${table_participant}
       LEFT JOIN ${table_user}
       ON ${table_user}.memberId=${table_participant}.memberId
       WHERE meetingId = ${meetingId}
       `);
       return item;
    }
    catch (err) {
       console.log(err);
       return [];
    }
}
let createParticipant = async (data) => {
    try {
       await query.create(table_participant,data);  
       return true
    }
    catch (err) {
       console.log(err);
       return false
    }
}
let delParticipantByMeetingId = async (meetingId) => {
    try {
       await query.del(table_participant,`WHERE meetingId = ${meetingId}`);  
       return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let delParticipant = async (id) => {
    try {
       await query.del(table_participant,`WHERE participantId = ${id}`);  
       return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let createRecurrence = async (meetingId,data) => {
    try {
       const exist = await query.get(table_recurrence,'*',`WHERE meetingId="${meetingId}"`);
       if(exist.length==0){
        data.meetingId = meetingId;
        await query.create(table_recurrence,data);
       }   
       else await query.update(table_recurrence,data,`WHERE meetingId="${meetingId}"`);
       return true
    }
    catch (err) {
       console.log(err);
       return false
    }
}
let getRecurrence = async () => {
    try {
       const item = await query.get(table_recurrence,'*');
       return item
    }
    catch (err) {
       console.log(err);
       return []
    }
}
let getRecurrenceOne = async (meetingId) => {
    try {
       const item = await query.get(table_recurrence,'*',`WHERE ${index}='${meetingId}'`);
       if(item.length==0) return false;
       return item[0]
    }
    catch (err) {
       console.log(err);
       return false
    }
}
let editRecurrence = async (meetingId,data) => {
    try {
       const item = await query.update(table_recurrence,data,`WHERE ${index}='${meetingId}'`);
       return true
    }
    catch (err) {
       console.log(err);
       return false
    }
}
let delRecurrence = async (meetingId) => {
    try {
       const item = await query.del(table_recurrence,'*',`WHERE ${index}='${meetingId}'`);
       return true
    }
    catch (err) {
       console.log(err);
       return false
    }
}
module.exports = {
    getter,
    create,
    update,
    del,
    existNotMe,
    exist,
    getAllMeeting,
    getInstantMeetingAsHost,
    getInstantMeetingAsParticipant,
    getHistoryAsHost,
    getHistoryParticipant,
    createParticipant,
    getParticipant,
    delParticipant,
    delParticipantByMeetingId,
    getOne,
    getMeetingHistory,
    createRecurrence,
    getRecurrence,
    getRecurrenceOne,
    editRecurrence,
    delRecurrence,
    getMeetingForRecording,
}