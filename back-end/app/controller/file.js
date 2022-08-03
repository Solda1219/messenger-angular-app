const axios = require('axios');
const path = require('path');
const fsPromise = require("fs").promises;/* API to create new Item */
const fs = require('fs');
const cf = require('../utils/core_func');
const util = require("util");
const multer = require("multer");
const upload = multer();
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const core_func = require('../utils/core_func');
let _detectImagefileToServer = async (req, res) => {
  try {
    const { url,name } = req.body // or any file format
    let list = [];
    for(let i = 0 ; i < url.length; i++){
      const fileName = '_public/detect_images/'+name;
      if(cf.existFile(fileName)) list.push(fileName)
      else{
        const downloadedStatus = await downloadFile(url,fileName);
        if(downloadedStatus == true) list.push(fileName)
      }
    }
    return res.status(200).json({result:list})
  } catch (err) {
      console.log(err)
    return res.status(404).json({message: 'something went wrong' });
  }
}
let getFileSize = (rt)=>{
  var stats = fs.statSync(path.join(`${__dirname}/../../${rt}`));
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
let sizeOfFile = (paths)=>{
  var stats = fs.statSync(paths);
  var fileSizeInBytes = stats.size;
  return core_func.formatBytes(fileSizeInBytes);
}
async function downloadFile (filePath,fileName) {  
  const writer = fs.createWriteStream(fileName);
  const response = await axios({
    url:filePath,
    method: 'GET',
    responseType: 'stream'
  })
  const pipe_r = response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    pipe_r.on('finish', function(){
     return resolve(true);
    })
    pipe_r.on('error', function(){
      return reject;
     })
  })
}
async function writeFile(fileData,filePath) {
  try {
    const data = await fsPromise.writeFile(filePath,fileData);
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}
async function createDir(dir) {
  try {
    if (!fs.existsSync(dir)){
     await fsPromise.mkdir(dir);
    }
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}
async function readFile(filePath) {
  try {
    const data = await fsPromise.readFile(filePath);
    return data;
  } catch (error) {
    return false;
  }
}
async function copyFile(from,to) {
  try {
    await fsPromise.copyFile(from,to);
    return true;
  } catch (error) {
    return false;
  }
}
async function delFile(filePath) {
  try {
    const data = await fsPromise.unlink(filePath);
    return data;
  } catch (error) {
    return false;
  }
}
function readFileSync(filePath) {
  try {
    const data = fs.readFileSync(filePath,'UTF-8');
    return data;
  } catch (error) {
    console.log(error)
    return false;
  }
}
async function readXML(filePath) {
  try {
    const data = await fsPromise.readFile(filePath);
    const json = await parser.parseStringPromise(data);
    return json;
  } catch (error) {
    console.log(error)
    return false;
  }
}
async function readfolder(filePath) {
  try {
    const files = await fsPromise.readdir(filePath);
    return files;
  } catch (error) {
    // console.log(error)
    return false;
  }
}
async function StringFromXML(filePath){
  var readStream = fs.createReadStream(filePath, 'utf8');
  let data = '';
  try{
    const result = await new Promise(
      (resolve,rejects)=>{
        readStream.on('data', function(chunk) {
          data += chunk;
      }).on('end', function() {
          return resolve(data);
      }).on('error',function(error){
        return rejects(error)
      });
      }
    );
    return result;
  }catch(err){
   console.log(err);
   return false;
  }

}
async function createXML(filePath,obj) {
  try { 
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(obj);
    await writeFile(xml,filePath)
    return filePath;
  } catch (error) {
    console.log(error)
    return false;
  }
}
//upload account image
const storage_account = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../_public/image/account`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }
    var datetimestamp = Date.now();
    callback(null, file.originalname);
  }
});

const uploadAccountImages = multer({ storage: storage_account }).array("files",10);
const _uploadAccountImages = util.promisify(uploadAccountImages);

//upload jnj
const storage_JNJ = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../_public/jnj`));
  },
  filename: (req, file, callback) => {
  // Allowed ext
  const filetypes = /jnj/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (!extname) {
      var message = `Filetype is invalid. Only accept jnj file.`;
      return callback(message, null);
    }
    var datetimestamp = Date.now();
    callback(null, file.originalname);
  }
});
const uploadJNJ = multer({ storage: storage_JNJ }).array("files",10);
const _uploadJNJ = util.promisify(uploadJNJ);

//upload cloud
const storage_cloud = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../_public/cloud`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      // var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      // return callback(message, null);
    }
    var datetimestamp = Date.now();
    callback(null, file.originalname);
  }
});

const uploadCloud = multer({ storage: storage_cloud }).array("files",10);
const _uploadCloud = util.promisify(uploadCloud);
module.exports = {
  _detectImagefileToServer,
  _uploadAccountImages,
  _uploadJNJ,
  _uploadCloud,
  getFileSize,
  readFile,
  readFileSync,
  writeFile,
  readXML,
  StringFromXML,
  createXML,
  createDir,
  readfolder,
  sizeOfFile,
  delFile,
  copyFile,
}