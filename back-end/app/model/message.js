const query = require('../utils/sqlQuery');
const table = 'table_msg';
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
let getR = async (from,to,user_id) => {
    try {
       const item = await query.get(table,'*',`WHERE coordinatorId = ${user_id} AND created_at > '${from}' AND created_at < '${to}'`);
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getS = async (from,to,user_id) => {
    try {
       const item = await query.get(table,'*',`WHERE senderId = ${user_id} AND created_at > '${from}' AND created_at < '${to}'`);
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let create = async (data) => {
    try {
       await query.create(table,data);  
       return true
    }
    catch (err) {
       return false
    }
}
let update = async (id,data) => {
    try {
       await query.update(table,data,`WHERE ${index}=${id}`);
       return true
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let del = async (id) => {
    try {
       await query.del(table,`WHERE ${index} = ${id}`);  
       return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let exist = async (val) => {
    try {
       const item = await query.get(table,'*',`WHERE ${unique_field}='${val}'`);
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
        console.log(err)
        return false;
    }
}
module.exports = {
    getter,
    getR,
    getS,
    getOne,
    create,
    update,
    del,
    existNotMe,
    exist,
}