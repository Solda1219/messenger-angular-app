const { hashSSHA } = require('../utils/authentication');
const setting = require('../../config/setting');
const user_model = require('../model/user');
const dept_model = require('../model/dept');
const address_model = require('../model/address');
const fileController = require("./file");
const core_func = require('../utils/core_func');
//user
let get = async (req, res) => {
  try {
    const item = await user_model.getter();
    return res.json({ result: item });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let create = async (req, res) => {
  try {
    await fileController._uploadAccountImages(req, res);
    const data = req.body;
    const {phone,email,nativeName,password} = data;
    data.createdDate = core_func.strftime(Date.now());
    const exist = await user_model.exist(phone,email);
    if (exist) return res.status(401).json({ message: 'Email or phone or username already exist.' });
    const newpassword = await hashSSHA(password);
    data.password = newpassword;
    await user_model.create(data);
    const existInaddress = await address_model.existPhone(phone);
    if(existInaddress!==false){
      const company = await dept_model.getCompany(data.dept_id);
      const deptinfo = await dept_model.getOne(data.dept_id);
      const role_name = await user_model.getRoleName(data.role);
      const dataitem = {
        usertype:0,
        nativeName:data.nativeName,
        email:data.email,
        phone:data.phone,
        company:company,
        is_del:0,
        dept_name:deptinfo?deptinfo.dept_name:'',
        role_name:role_name,
        updated_at:core_func.strftime(Date.now()),
      }
      const updated = await address_model.updateByPhone(phone,dataitem);
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
let edit = async (req, res) => {
  try {
    await fileController._uploadAccountImages(req, res);
    const { memberId } = req.body;
    const data = req.body;
    delete data['password'];
    const original = await user_model.getProfile(data.memberId);
    if(original==false) return res.status(401).json({ message: 'This user not exist.' });
    const exist = await user_model.existNotMe(memberId,data.phone, data.email);
    if (exist) return res.status(401).json({ message: 'Email or phone or username already exist.' });
    await user_model.update(data);
    const existInaddress = await address_model.existPhone(original.phone);
    if(existInaddress!==false){
      const company = await dept_model.getCompany(data.dept_id);
      const deptinfo = await dept_model.getOne(data.dept_id);
      const role_name = await user_model.getRoleName(data.role);
      const dataitem = {
        usertype:0,
        nativeName:data.nativeName,
        email:data.email,
        phone:data.phone,
        company:company,
        is_del:0,
        dept_name:deptinfo?deptinfo.dept_name:'',
        role_name:role_name,
        updated_at:core_func.strftime(Date.now()),
      }
      const updated = await address_model.updateByPhone(original.phone,dataitem);
    }
    return res.json({ message: 'Success!' });
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
      await user_model.del(data[i].memberId,data[i].email);
      const existInaddress = await address_model.existPhone(data[i].phone);
      if(existInaddress!==false){
        const dataitem = {
          is_del:1,
          usertype:1,
          updated_at:core_func.strftime(Date.now()),
        }
        const updated = await address_model.updateByPhone(data[i].phone,dataitem);
      }
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
let redept = async (req, res) => {
  try {
    const {data,moveTo} = req.body;
    for(let i = 0 ; i < data.length; i++){
      await user_model.redept(data[i].memberId,moveTo);
      const existInaddress = await address_model.existPhone(data[i].phone);
      if(existInaddress!==false){
        const company = await dept_model.getCompany(moveTo);
        const deptinfo = await dept_model.getOne(moveTo);
        const dataitem = {
          company:company,
          is_del:0,
          dept_name:deptinfo?deptinfo.dept_name:'',
          updated_at:core_func.strftime(Date.now()),
        }
        const updated = await address_model.updateByPhone(data[i].phone,dataitem);
      }
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
let resetPasswordUser = async (req, res) => {
  try {
    const { email, memberId } = req.body;
    const data = req.body;
    data.updated_at = core_func.strftime(Date.now())
    const exist = await user_model.exist(email);
    if (!exist) return res.status(401).json({ message: 'This email not exist.' });
    const password = await hashPassword('12345678');
    data.password = password;
    await user_model.update(data);
    return res.json({ message: '12345678 is new password.' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
//myprofile
let getProfile = async (req, res) => {
  try {
    const {id} = req.user;
    const item = await user_model.getProfile(id);
    if(item) return res.json({ result: item })
    else return res.status(401).json({message:'Your profile is not exist'})
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let editProfile = async (req, res) => {
  try {
    const {id} = req.user;
    await fileController._uploadAccountImages(req, res);
    const data = req.body;
    const exist = await user_model.existNotMe(id,data.phone, data.email);
    if (exist) return res.status(401).json({ message: 'Username already exist.' });
    const dataitem = {
      memberId:id,
      nativeName:data.nativeName,
      allow_share:data.allow_share,
      avatar:data.avatar,
    }
    if(data.password){
      const newpassword = await hashSSHA(data.password);
      data.password = newpassword;
    }
    const item = await user_model.getProfile(id);
    if(item){
      await user_model.update(dataitem);
      return res.json({ result: item,message: 'Success!' })
    } 
    else return res.status(401).json({message:'Your profile is not exist'})
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let editOfficeSetting = async (req, res) => {
  try {
    const {id,email,role} = req.user;
    const {data} = req.body;
    data.memberId = id;
    const item = await user_model.getProfile(id);
    if(item){
      await user_model.update(data);
      return res.json({ result: item,message: 'Success!' })
    }
    else return res.status(401).json({message:'Your profile is not exist'})
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
//ecard
let getEcard = async (req, res) => {
  try {
    const {id} = req.user;
    const item = await user_model.getEcard(id);
    return res.json({ result: item })
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let getUserCard = async (req, res) => {
  try {
    const {memberId} = req.body;
    let item;
    if(memberId) item = await user_model.getEcard(memberId);
    return res.json({ result: item })
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let editEcard = async (req, res) => {
  try {
    const {id,email,role} = req.user;
    await fileController._uploadAccountImages(req, res);
    const data = req.body;
    data.user_id = id;
    let stringdata = JSON.stringify({
      id:id,
      email:email,
      role:role,
    })
    data.qr_code = `http//:117.21.178.36:3001/e-card/${id}`;
    const updated = await user_model.editEcard(id,data);
    return res.json({message:"Success"});
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
//get contact
let getContact = async (req, res) => {
  try {
    const {id} = req.user;
    const contact = await address_model.getUsersInaddressBook(id);
    return res.json({ result: contact })
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  get,
  create,
  edit,
  del,
  redept,
  resetPasswordUser,
  editProfile,
  getProfile,
  editOfficeSetting,
  getEcard,
  getUserCard,
  editEcard,
  getContact,
}
