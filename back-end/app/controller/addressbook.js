const setting = require('../../config/setting');
const model = require('../model/address');
const user_model = require('../model/user');
const dept_model = require('../model/dept');
const fileController = require("./file");
const core_func = require('../utils/core_func');
let get = async (req, res) => {
  try {
    const item = await model.getOne(req.user.id);
    return res.json({ result: item });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let getInsideUser = async (req, res) => {
  try {
    const result = [];
    const item = await user_model.getter();
    const existuser = await model.getOne(req.user.id);
    for(let i=0; i<item.length; i++){
      if(item[i].memberId == req.user.id) continue;
      if(existarr(existuser,item[i].phone)) continue;
      if(item[i].allow_share == 0) continue;
      result.push(item[i])
    }
    console.log(result.length)
    return res.json({ result: result });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let createOut = async (req, res) => {
  try {
    const {id} = req.user;
    const data = req.body;
    const existphone = await user_model.getUserByPhone(data.phone)
    if(existphone.length>0) return res.status(401).json({message:'This phone exist in inside user.'})
    const exist = await model.exist(id,data.phone)
    if(exist!==false) return res.status(401).json({message:'This user already exist'})
    const dataitem = {
      memberId:id,
      usertype:1,
      nativeName:data.nativeName,
      email:data.email,
      phone:data.phone,
      group_name:data.group_name,
      company:data.company,
      dept_name:data.dept_name,
      role_name:data.role_name,
      created_at:core_func.strftime(Date.now()),
    }
    const create = await model.create(dataitem);
    if(create ==false) return res.status(401).json({message:'Failed'})
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let createIn = async (req, res) => {
  try {
    const {data,group_name} = req.body;
    const {id} = req.user;
    for(let i = 0; i < data.length; i++){
      const company = await dept_model.getCompany(data[i].dept_id);
      const exist = await model.exist(id,data[i].phone)
      if(exist!==false){
        const dataitem = {
          usertype:0,
          nativeName:data[i].nativeName,
          email:data[i].email,
          phone:data[i].phone,
          group_name:group_name,
          company:company,
          dept_name:data[i].dept_name,
          role_name:data[i].role_name,
          updated_at:core_func.strftime(Date.now()),
        }
        const updated = await model.update(exist,dataitem);
      }else{
        const dataitem = {
          usertype:0,
          memberId:id,
          nativeName:data[i].nativeName,
          email:data[i].email,
          phone:data[i].phone,
          company:company,
          group_name:group_name,
          dept_name:data[i].dept_name,
          role_name:data[i].role_name,
          created_at:core_func.strftime(Date.now()),
        }
        const create = await model.create(dataitem);
      }
     }
    return res.json({message:'success'}) 
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let edit = async (req, res) => {
  try {
    const {id} = req.user;
    const data = req.body;
    const existphone = await user_model.getUserByPhone(data.phone)
    if(existphone.length>0) return res.status(401).json({message:'This phone exist in inside user.'})
    const exist = await model.existNotMe(data.id,id,data.phone)
    if(exist!==false) return res.status(401).json({message:'This user already exist'})
    const dataitem = {
      is_del:0,
      nativeName:data.nativeName,
      email:data.email,
      phone:data.phone,
      group_name:data.group_name,
      company:data.company,
      dept_name:data.dept_name,
      role_name:data.role_name,
      updated_at:core_func.strftime(Date.now()),
    }
    const updated = await model.update(data.id,dataitem);
    if(updated) return res.json({ message: 'Success' });
    else return res.status(401).json({ message: 'Failed' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let regroup = async (req, res) => {
  try {
    const {id} = req.user;
    const {data,moveTo} = req.body;
    for(let i = 0 ; i < data.length; i++){
      const dataitem = {
        group_name:moveTo,
        updated_at:core_func.strftime(Date.now()),
      }
     await model.update(data[i].id,dataitem);
    }
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let del = async (req, res) => {
  try {
    const data = req.body;
    for(let i = 0 ; i < data.length; i++){
      await model.del(data[i].id);
    }
    return res.json({message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
const existarr = (arr,key)=>{
  for(let i =0 ; i < arr.length; i++){
    if(key==arr[i].phone) return true;
  }
  return false;
}
module.exports = {
  get,
  getInsideUser,
  createOut,
  createIn,
  edit,
  del,
  regroup,
}
