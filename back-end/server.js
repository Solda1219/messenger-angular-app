const app = require("./app");
const setting = require("./config/setting");
const systemExe = require("./app/controller/system");
const socket = require('./socket');
if (require.main === module) {
  setting.sqlDriver.connect((err) => {
    if (err) throw err;
    console.log('My sql connected!');
    systemExe.exe();
  });
  const server = app.listen(setting.port, ()=> {
    console.log('server is working on port:'+setting.port)
  });
  socket.sockets(server);
}
