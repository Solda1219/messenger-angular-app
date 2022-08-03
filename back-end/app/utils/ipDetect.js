const axios = require('axios');


const ipDetect = async (ip) => {

    try {
      // fetch data from a url endpoint
      const result=await axios
      .get('http://ip-api.com/json/'+ip);
      return result;
    } catch(error) {
      const result=false;
      return result;
      // appropriately handle the error
    }
};



module.exports = {
    ipDetect
};
