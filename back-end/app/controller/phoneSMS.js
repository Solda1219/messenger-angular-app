var unirest = require("unirest");
var request = unirest("POST", "http://106.ihuyi.cn/webservice/sms.php?method=Submit");
var parseString = require('xml2js').parseString;
const user_model = require("../model/user");
const sessionStorage = require('sessionstorage-for-nodejs');
////////////////////////////////////////////////////////////////
module.exports.phoneSMS =  async(req, res) => {
    const exist_phone = await user_model.getUserByPhone(req.body.phone);
    if(exist_phone.length == 0) return res.status(401).json({message:"Unregistered phone number."})
    var otp=Math.floor(Math.random()*10000);
    request.form({
        account: "C57610010", // Set your own "sender_id"
        password: "dcf0ab56e45249f81a17ce0bdc11c43b", // template id
        mobile: req.body.phone,
        content: "您正在进行手机验证，验证码是"+otp+"，如非本人操作，请忽略本短信。。" // Transactional Route SMS 
    });
    request.end(function(res1) {
        parseString(res1.raw_body, {trim: true}, function (err, result) {
            if(result!==undefined){
                const st= result['SubmitResult']['code'];
                if(st=='2'){
                    const smsid= result['SubmitResult']['smsid'];
                    console.log(result['SubmitResult'])
                    console.log(otp);
                    sessionStorage.setItem(req.body.phone, String(otp));
                    res.status(200).json({message:'Successfully sent message to your phone.'})
                }else{
                    res.status(401).json({message:'PhoneNumeber is incorrect.'})
                }
            }
        });
    });
}
module.exports.phoneVerify = (req, res) => {
    console.log('here')
    const smsid=sessionStorage.getItem(req.body.phone);
    console.log([req.body.phone,smsid,req.body.code])
    if(smsid&&smsid==req.body.code){
        res.status(200).json({message:'Verify successfull.'});
        // sessionStorage.removeItem(req.body.number, smsid);
    }else  {
        res.status(401).json({message:'Verify code is not correct.'})
    }
}