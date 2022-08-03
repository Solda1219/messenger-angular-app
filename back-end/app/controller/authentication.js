const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashSSHA,} = require('../utils/authentication');
const user_model = require('../model/user');
const captcha = require("../utils/captcha");
const secretKey = '1234567890';
const axios = require('axios');
const sessionStorage = require('sessionstorage-for-nodejs');
let login = async (req, res) => {
  try {

    const { username, password } = req.body;
    //check request
    if(!username||!password) return res.status(401).json({message: 'Request is wrong.'})
    //check if username exist
    const user_data = await user_model.getUserByMail(username);
    if(user_data.length == 0) return res.status(401).json({message: 'Unknown Account.'})
    //check status
    const status = user_data[0].status;
    if(status == 0) return res.status(401).json({message: 'Your account is restricted. Please contact with support team.'})
    //check if password is correct
    const user = user_data[0];
    const u_password = user.password;
    const hashResult = hashSSHA(password);
    if (hashResult == u_password) { 
      const ObjForToken={
        id:user.memberId, 
        email:user.email,
        role:user.role,
        role_name:user.role_name,
      };
      const token = createToken(ObjForToken);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const userInfo = user;
      return res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      });
    } else return res.status(401).json({ message: 'Password is incorrect.'});
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      message: 'Something went wrong.', err: error
    });
  }
};
let resetPasswordByPhone = async (req, res) => {
  try {
    const { phone, password,code } = req.body;
    console.log([phone,password,code])
    const exist_phone = await user_model.getUserByPhone(req.body.phone);
    if(exist_phone.length == 0) return res.status(401).json({message:"Unregistered phone number."});
    const smsid=sessionStorage.getItem(phone);
    if(smsid!=code){
      return res.status(401).json({message:"Phone verify code is not correct"});
    }
    sessionStorage.removeItem(req.body.number, smsid);
    const hashResult = hashSSHA(password);
    const updated = await user_model.resetPasswordByPhone(phone,hashResult);
    if(updated) res.status(200).json({message:'Successfully updated'})
    else res.status(401).json({message:'Failed'});
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      message: 'Something went wrong.', err: error
    });
  }
};
let captchaBlob = async (req, res) => {
  const width = parseInt(req.params.width) || 200;
  const height = parseInt(req.params.height) || 100;
  const { image, text } = captcha(width, height);
  res.send({ image, text });
};
let captchaImage = async (req, res) => {
  const width = parseInt(req.params.width) || 200;
  const height = parseInt(req.params.height) || 100;
  const { image } = captcha(width, height);
  res.send(`<img class="generated-captcha" src="${image}">`);
};
module.exports = {
  login,
  resetPasswordByPhone,
  captchaBlob,
  captchaImage,
}
