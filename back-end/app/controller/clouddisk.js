const setting = require('../../config/setting');
const core_func = require('../utils/core_func');
const fileController = require("./file");
const model = require('../model/clouddisk');
const modelshare = require('../model/cloudShare')
const user_model = require('../model/user');
const address_model = require('../model/address');
let get = async (req, res) => {
  try {
    const {id} = req.user;
    const {from,to} = req.body;
    const item = await model.getMine(id,from,to);
    const users = await user_model.getOthers(id);
    const contact = await address_model.getUsersInaddressBook(id);
    for(let i = 0 ; i < item.length; i ++){
      // const users = await model.getUser(item[i].id);
      const file_path = String(item[i].path);
      item[i].size = core_func.formatBytes(item[i].size);
      item[i].created_at = core_func.strftime(item[i].created_at);
      item[i].file_realname = file_path.substring(file_path.lastIndexOf('/')+1);
    }
    return res.json({ result: item, users:users,contact:contact});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let getOne = async (req, res) => {
  try {
    const {id} = req.body;
    const item = await model.getOne(id);
    if(item===false) return res.status(401).json({message:'This file not exist'})
    return res.json({ result: item});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let upload = async (req, res) => {
  try{
    await fileController._uploadCloud(req, res);
  }
  catch(err)
  {
    console.log(err)
    return res.status(400).json({
      message: err,
    });
  }
  try {
    const {id} = req.user;
    const data = req.body;
    const fileSize = fileController.getFileSize(data.path);
    const exist = await model.exist(id,data.title);
    if (exist) return res.status(401).json({ message: 'This title already exist.' });
    const dataitem={
      path:data.path,
      coordinatorId:id,
      keyword:data.key,
      title:data.title,
      size:fileSize,
      created_at:core_func.strftime(Date.now())
    }
    await model.create(dataitem);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let edit = async (req, res) => {
  try{
    await fileController._uploadCloud(req, res);
  }
  catch(err)
  {
    console.log(err)
    return res.status(400).json({
      message: err,
    });
  }
  try {
    const {id} = req.user;
    const data = req.body;
    const fileSize = fileController.getFileSize(data.path);
    const exist = await model.existNotMe(data.id,id,data.title);
    if (exist) return res.status(401).json({ message: 'This title already exist.' });
    const dataitem={
      path:data.path,
      coordinatorId:id,
      keyword:data.key,
      title:data.title,
      size:fileSize,
      created_at:core_func.strftime(Date.now())
    }
    await model.update(data.id,dataitem);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let share = async (req, res) => {
  try {
    const {id} = req.user;
    const {users,cloudId} = req.body;
    for(let i=0; i<users.length;i++){
      const dataitem={
        cloudId:cloudId,
        memberId:users[i].memberId,
        isRead:0,
        created_at:core_func.strftime(Date.now()),
      }
      await modelshare.create(dataitem);
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
    for(let i=0; i< data.length; i++){
      await model.del(data[i].id);
    }
    return res.json({message: 'Success' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  get,
  getOne,
  upload,
  edit,
  share,
  del,
}
