const query = require('../utils/sqlQuery');
const table = 'recording';
const share_table = 'share';
const userTable = 'member';
let getter = async () => {
    try {
       const item = await query.get(table);
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getMine = async (coordinatorId) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT
           ${table}.*,
           ${userTable}.nativeName
           FROM ${table}
           LEFT JOIN ${userTable}
           ON ${userTable}.memberId = ${table}.coordinatorId
           WHERE coordinatorId=${coordinatorId}
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getOne = async (id) => {
    try {
       const item = await query.get(table,'*',`WHERE id = ${id}`);
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
       return true
    }
    catch (err) {
        console.log(err)
       return false
    }
}
let update = async (data) => {
    try {
       const {id}=data;
       delete data.id;
       const update = await query.update(table,data,`WHERE recordingId=${id}`);
       return true
    }
    catch (err) {
        return false;
    }
}
let del = async (id) => {
    try {
       await query.del(table,`WHERE recordingId = ${id}`);  
       await query.del(share_table,`WHERE recordingId = ${id}`);  
       return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let exist = async (user_id,title) => {
    try {
       const item = await query.get(table,'*',`WHERE coordinatorId='${user_id}' AND title="${title}"`);
       if(item.length==0) return false;
       return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let existNotMe = async (recordingId,user_id,title) => {
    try {
       const item = await query.get(table,'*',`WHERE recordingId=${recordingId} AND coordinatorId='${user_id}' AND title="${title}"`);
       if(item.length==0) return false;
       return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
module.exports = {
    getter,
    getMine,
    create,
    update,
    del,
    existNotMe,
    exist,
}