//**tablehint
// id,
// usertype,//0 outside, 1 inside
// group_name,
// memberId,
// status,
// is_del,//1 deleted
// nativeName,
// email,
// phone,
// company,
// dept_name,
// role_name,
// created_at,
// updated_at
const query = require('../utils/sqlQuery');
const userTable = 'member';
const table = 'table_addressbook';
const table_role = 'user_role';
const table_dept = 'table_dept';
let getOne = async (user_id) => {
    try {
       const item = await query.get(table,'*',`WHERE memberId = ${user_id}`)
       return item
    }
    catch (err) {
       console.log(err)
       return []
    }
}
let getUsersInaddressBook = async (id) => {
    try{
        const item = await query.lawQuery(
            `
            SELECT
            ${userTable}.*
            FROM ${table}
            LEFT JOIN ${userTable}
            ON ${userTable}.phone = ${table}.phone
            WHERE NOT ${userTable}.phone is NULL AND ${table}.memberId = ${id}
            `
        );
        return item;
    }catch(err){
        console.log(err);
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
       await query.update(table,data,`WHERE id=${id}`);
       return true
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let updateByPhone = async (phone,data) => {
    try {
       await query.update(table,data,`WHERE phone='${phone}'`);
       return true
    }
    catch (err) {
        console.log(err)
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
let exist = async (memberId,phone) => {
    try {
        const item = await query.get(table,'*',`WHERE memberId='${memberId}' AND phone ='${phone}'`);
        if(item.length==0) return false;
        return item[0].id;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let existEmail = async (email) => {
    try {
        const item = await query.get(table,'*',`WHERE email='${email}'`);
        if(item.length==0) return false;
        return item[0].id;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let existPhone = async (phone) => {
    try {
        const item = await query.get(table,'*',`WHERE phone='${phone}'`);
        if(item.length==0) return false;
        return item[0].id;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let existNotMe = async (id,memberId,phone) => {
    try {
        const item = await query.get(table,'*',`WHERE NOT id = ${id} AND memberId='${memberId}' AND  phone ='${phone}'`);
        if(item.length==0) return false;
        return item[0].id;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
module.exports = {
    getOne,
    getUsersInaddressBook,
    create,
    update,
    updateByPhone,
    del,
    existNotMe,
    existEmail,
    existPhone,
    exist,
}