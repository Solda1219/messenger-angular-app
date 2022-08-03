const query = require('../utils/sqlQuery');
const table = 'table_dept';
const userTable = 'member';
const table_ecard = 'table_ecard';
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
let getCompany = async (dept_id) => {
    try{
        const dept = await getter();
        const deptinfo = await getOne(dept_id);
        let company;
        if(!deptinfo) return '';
        const {dept_level,super_dept} = deptinfo;
        if(dept_level == 1){
         for(let i = 0; i < dept.length; i++){
             if(dept[i].id==super_dept){
                 company = dept[i].dept_name;
             } 
         }
        }
        else{
         let superd = '';
         for(let i = 0; i < dept.length; i++){
             if(dept[i].id==super_dept){
                 superd = dept[i].super_dept;
             }
         }   
         for(let i = 0; i < dept.length; i++){
             if(dept[i].id==superd){
                 company = dept[i].dept_name;
             }
         }   
        }
        return company;
    }catch(err){
       console.log()
        return ''
    }

}
let getOne = async (id) => {
    try {
       const item = await query.get(table,'*',`WHERE id = ${id}`);
       if(item.length==0) return false;
       return item[0];
    }
    catch (err) {
        console.log(err)
        return false;
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
       const {dept_id}=data;
       delete data.id;
       const update = await query.update(table,data,`WHERE dept_id=${dept_id}`);
       return true
    }
    catch (err) {
        return false;
    }
}
let del = async (id,level=1) => {
    try {
       await query.del(table,`WHERE dept_id = ${id}`);
       if(level==0) await query.del(table,`WHERE super_dept = ${id}`)
       await query.del(userTable,`WHERE dept_id = ${id}`);
       return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let getUser = async (id) => {
    try {
       const item = await query.lawQuery(
           `
           SELECT
           ${userTable}.*,
           ${table_ecard}.qr_code
           FROM ${userTable}
           LEFT JOIN ${table_ecard}
           ON ${table_ecard}.user_id = ${userTable}.memberId
           WHERE ${userTable}.dept_id = ${id}
           `
       );
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let exist = async (val) => {
    try {
       const item = await query.get(table,'*',`WHERE dept_name='${val}'`);
       if(item.length==0) return false;
       return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let existID = async (val) => {
    try {
       const item = await query.get(table,'*',`WHERE dept_id='${val}'`);
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
       const item = await query.get(table,'*',`WHERE dept_name='${val}' AND NOT dept_id = ${id}`);
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
    existID,
    getUser,
    getCompany,
}