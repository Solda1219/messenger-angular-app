var nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const mail_model = require('../model/mail');
var mail = nodemailer.createTransport({
  // // host: "smtp.mailtrap.io",
  // // port: 2525,
  // // auth: {
  // //   user: "707931d68ae098",
  // //   pass: "865535a96734a7"
  // // }
  // host: "smtp.mail.ru",
  // port: 587,
  // secure: false,
  // auth: {
  //   user: "vladim.soldatov@mail.ru",
  //   pass: "work@study#Earn"
  // }
  host: "smtp.126.com",
  port: 465,
  secure: true,
  auth: {
    user: "imflybird@126.com",
    pass: "JBQEPREVEUJHCDQJ"
  }
  // service: 'gmail',
  // name: 'mail.legacyems.co.za',
  // host: 'mail.legacyems.co.za',
  // auth: {
  //   user: 'no-reply@legacyems.co.za',
  //   pass: 'A&uftCh*x^aL'
  // },
  // port: 465,
  // secure: true
});


let sendGmail = async (req, res) => {
 
  var data = { mail_from: req.body.from, mail_to: req.body.to, subject: req.body.subject, status: 0 };
  await mail_model.createNewMsg(data)
  var mailOptions = {
    from: req.body.from,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.content
  };
  try{
    mail.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return res.status(401).json({ message: 'failure', err: error });
      } else {
        console.log('Email sent: ' + info.response);
        return res.json({ message: 'success', result: info.response });
      }
    });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Mail can not send now. Please try again.',err:error
    });
  }
}

let getReceivedMail = async (req, res) => {
  var receiver = req.body.receiverMail;
  var receivedMails = await mail_model.getMailsByReceiver(receiver);
  return res.json({ result: receivedMails });
}

let del = async (req, res) => {
  try {
    const data = req.body;
    for (let i = 0; i < data.length; i++) {
      await mail_model.del(data[i].id);
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
let read = async (req, res) => {
  try {
    const data = req.body;
    // const exist = await model.existNotMe(data.id, data.title);
    // if (exist) return res.status(401).json({ message: 'This title already exist.' });
    const { id } = data;
    delete data.id;
    await mail_model.update(id);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  sendGmail: sendGmail,
  getReceivedMail: getReceivedMail,
  del: del,
  read: read
}