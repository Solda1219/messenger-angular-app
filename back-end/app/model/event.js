const query = require('../utils/sqlQuery');
const table = 'table_event';
const index = 'id';
const unique_field = 'title';
let getter = async (user_id) => {
    try {
       const item = await query.get(table,'*',`WHERE coordinatorId = '${user_id}'`);
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getAlarm = async (user_id,till) => {
    try {
       const item = await query.get(table,'*',`WHERE coordinatorId = '${user_id}' AND alarm = '1' AND alarm_read = '0' AND start_time>'${till}'`);
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getOne = async (id) => {
    try {
       const item = await query.get(table,'*',`WHERE ${index} = ${id}`);
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
        console.log(err)
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
       await query.del(table,`WHERE id = ${id}`);  
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
    getOne,
    create,
    update,
    del,
    existNotMe,
    exist,
    getAlarm,
}