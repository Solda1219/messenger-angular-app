const fs = require('fs');
const fsPromise = require("fs").promises;
const QRCode = require('qrcode');
function timeDeltaToDate(delta) {
    let str = '';
    const day = Math.floor(delta / 24 / 60 / 60 / 1000);
    const hour = Math.floor((delta % (24 * 60 * 60 * 1000)) / 60 / 60 / 1000);
    const minute = Math.floor((delta % (60 * 60 * 1000)) / 60 / 1000);
    const seconds = Math.floor(delta % (60 * 1000)/1000);
    if (day > 0) str += day + 'days ';
    if (hour > 0) str += hour + 'h ';
    if (minute > 0) str += minute + 'min ';
    if (seconds > 0) str += seconds + 's ';
    return str;
  }
function strftime(ss,format) {
    const getFormat = (text) => {
        if (text < 10) return '0' + text
        else return text;
    }
    const d = new Date(ss);
    if(format=='YYYY-mm-dd hh:mm:ss'){
        const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + ' ' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
        return dateFormat;
    }
    else if(format=='hh:mm:ss'){
        const hour = Math.floor(ss / 3600) < 10 ? '0' + Math.floor(ss / 3600) : Math.floor(ss / 3600);
        const minute = Math.floor((ss % 3600) / 60) < 10 ? '0' + Math.floor((ss % 3600) / 60) : Math.floor((ss % 3600) / 60);
        const second = ss % 60 < 10 ? '0' + ss % 60 : ss % 60;
        return '' + hour + ':' + minute + ':' + second;
    }
    else{
        const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + ' ' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
        return dateFormat;
    }
  
}  
function utcToChina(time) {
    if(!time) return ''
    const date = new Date(time)
    return strftime(date.setHours(date.getHours()+8),"YYYY-mm-dd hh:mm:ss")
}
function formatBytes(x) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;

    while(n >= 1024 && ++l){
        n = n/1024;
    }
    //include a decimal point and a tenths-place digit if presenting 
    //less than ten of KB or greater units
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}
//file
const existFile = (path) => {
   return fs.existsSync(path)  
}
//qrcode
const qrCodeString = (strdata) =>
  new Promise((resolve, reject) => {
    QRCode.toString(strdata,{type:'terminal'},
    function (err, res) {
        if(err) return reject(err);
        // Printing the generated code
        return resolve(res)
    })
});
const qrCodeURL = (strdata) =>
  new Promise((resolve, reject) => {
    QRCode.toDataURL(strdata,{type:'terminal'},
    function (err, res) {
        if(err) return reject(res);
        // Printing the generated code
        return resolve(QRCode)
    })
});
module.exports = {
    formatBytes,
    timeDeltaToDate,
    strftime,
    existFile,
    utcToChina,
    qrCodeString,
    qrCodeURL,
};
  