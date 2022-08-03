const query = require('../utils/sqlQuery');
const table = 'table_cloud_share';
const userTable = 'member';
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
       const {id}=data;
       delete data.id;
       const update = await query.update(table,data,`WHERE id=${id}`);
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
module.exports = {
    getter,
    create,
    update,
    del,
}