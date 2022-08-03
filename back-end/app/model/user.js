const query = require('../utils/sqlQuery');
const table = 'member';
const table_ecard = 'table_ecard';
const table_role = 'user_role';
const table_dept = 'table_dept';
let getter = async () => {
    try {
       const item = await query.lawQuery(
           `
           SELECT
           ${table}.*,
           ${table_role}.role_name as role_name,
           ${table_dept}.dept_name as dept_name,
           ${table_ecard}.qr_code
           FROM ${table}
           LEFT JOIN ${table_role}
           ON ${table}.role = ${table_role}.id
           LEFT JOIN ${table_dept}
           ON ${table}.dept_id = ${table_dept}.id
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${table}.memberId
           WHERE NOT role_name = 'super'
           ORDER BY createdDate ASC
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
       return true
    }
    catch (err) {
       return false
    }
}
let update = async (data) => {
    try {
       const {memberId}=data;
       delete data.memberId;
       const update = await query.update(table,data,`WHERE memberId=${memberId}`);
       return true
    }
    catch (err) {
        return false;
    }
}
let resetPasswordByPhone = async (phone,password) => {
    try {
       const update = await query.update(table,{password:password},`WHERE phone='${phone}'`);
       return true
    }
    catch (err) {
        return false;
    }
}
let del = async (id,email) => {
    try {
       await query.del(table,`WHERE memberId = ${id}`); 
    //    await query.del(membergrouptable,`WHERE email = "${email}"`); 
       return true
    }
    catch (err) {
        return false
    }
}
let redept = async (id,moveTo) => {
    try {
       const item = await query.update(table,{dept_id:moveTo},`WHERE memberId = ${id}`);  
       return true
    }
    catch (err) {
        return false
    }
}
let getUserByMail = async (val) => {
    try {
       const item = await query.get(table,'*',`WHERE email='${val}'`);
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getUserByPhone = async (val) => {
    try {
       const item = await query.get(table,'*',`WHERE phone='${val}'`);
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let exist = async (phone,email) => {
    try {
       const item = await query.get(table,'*',`WHERE email='${email}' OR phone='${phone}'`);
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
       return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let existNotMe = async (id,phone,email) => {
    try {
       const item = await query.get(table,'*',`WHERE (email='${email}' OR phone='${phone}') AND NOT memberId = ${id}`);
       if(item.length==0) return false;
       return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let getProfile = async (id) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT
           ${table}.*,
           ${table_role}.role_name as role_name,
           ${table_dept}.dept_name as dept_name
           FROM ${table}
           LEFT JOIN ${table_role}
           ON ${table}.role = ${table_role}.id
           LEFT JOIN ${table_dept}
           ON ${table}.dept_id = ${table_dept}.id
           WHERE memberId = ${id}
           `
       );
       if(item.length==0) return false;
       else return item[0]
    }
    catch (err) {
        return false;
    }
}
let getRoleName = async (id) => {
    try {
        const item = await query.get(table_role,'*',`WHERE id = ${id}`);
        if(item.length==0) return ''
        else item[0].role_name;
    }
    catch (err) {
        console.log(err)
        return '';
    }
}
let getEcard = async (id) => {
    try {
       const item = await query.get(table_ecard,"*",`WHERE user_id=${id}`)
       if(item.length==0) return false;
       else return item[0]
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let editEcard = async (id,data) => {
    try {
        data.user_id = id;
        const exist = await query.get(table_ecard,"*",`WHERE user_id=${id}`);
        if(exist.length==0) await query.create(table_ecard,data);
        else await query.update(table_ecard,data,`WHERE user_id=${id}`)
        return true;
    }
    catch (err) {
        return false;
    }
}
let getOthers = async (id) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT
           ${table}.*,
           ${table_role}.role_name as role_name,
           ${table_dept}.dept_name as dept_name
           FROM ${table}
           LEFT JOIN ${table_role}
           ON ${table}.role = ${table_role}.id
           LEFT JOIN ${table_dept}
           ON ${table}.dept_id = ${table_dept}.id
           WHERE NOT role_name = 'super' AND NOT memberId = ${id}
           ORDER BY createdDate ASC
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
module.exports = {
    getter,
    create,
    update,
    del,
    redept,
    existNotMe,
    exist,
    existEmail,
    getUserByMail,
    getUserByPhone,
    resetPasswordByPhone,
    getProfile,
    getRoleName,
    getEcard,
    editEcard,
    getOthers,
}