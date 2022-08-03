const query = require('../utils/sqlQuery');
const table = 'table_cloud';
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
let getOne = async (id) => {
    try {
       const item = await query.get(table,'*',`WHERE id=${id}`);
       if(item.length==0) return false;
       return item[0];
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let getMine = async (coordinatorId,from,to) => {
    try {
       const item = await query.get(table,'*',`WHERE coordinatorId=${coordinatorId} AND created_at > '${from}' AND created_at < '${to}'`);
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
let update = async (id,data) => {
    try {
       const update = await query.update(table,data,`WHERE id=${id}`);
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
let existRecording = async (coordinatorId,path) => {
    try {
       const item = await query.get(table,'*',`WHERE coordinatorId='${coordinatorId}' AND path="${path}"`);
       if(item.length>0) return item[0].id;
       return false;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let exist = async (coordinatorId,title) => {
    try {
       const item = await query.get(table,'*',`WHERE coordinatorId='${coordinatorId}' AND title="${title}"`);
       if(item.length>0) return item[0].id;
       return false;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let existNotMe = async (id,coordinatorId,title) => {
    try {
       const item = await query.get(table,'*',`WHERE coordinatorId='${coordinatorId}' AND title="${title}" AND NOT id=${id}`);
       if(item.length>0) return item[0].id;
       return false;
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
    getMine,
    update,
    del,
    exist,
    existNotMe,
    existRecording,
}