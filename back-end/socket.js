const socketio = require("socket.io");
const _ = require("lodash");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const meetingC = require('./app/controller/meeting');
module.exports.sockets = function(http) {
  io = socketio.listen(http);
  //setting chat route
  const ioChat = io.of("/socket");
  const userStack = {};
  let oldChats, sendUserStack, setRoom;
  const userSocket = {};
  const officeStatus = {};//0-calling, 1-ended
  //socket.io magic starts here
  ioChat.on("connection", function(socket) {
    console.log("socketio chat connected.");
    //function to get user name
    socket.on("set-user-data", function(userdata) {
      if(!userdata) return;
      console.log(userdata.email + ' is connected')
      //storing variable.
      socket.userdata = userdata;
      socket.goto = userdata.memberId;
      userSocket[socket.goto] = socket.id;
      
      socket.broadcast.emit("broadcast", {
        description: userdata.email + " Logged In"
      });

      //getting all users list
      eventEmitter.emit("get-all-users");

      //sending all users list. and setting if online or offline.
      sendUserStack = function() {
        for (i in userSocket) {
          for (j in userStack) {
            if (j == i) {
              userStack[j] = "Online";
            }
          }
        }
        //for popping connection message.
        ioChat.emit("onlineStack", userStack);
      }; //end of sendUserStack function.
    }); //end of set-user-data event.

    //setting room.
    socket.on("enterOffice", function(userTo) {
      if(officeStatus[userTo.memberId===0]) return socket.emit("resultOffice",{status:1,message:`${userTo.email} is busy now. Please try later.`});//0-ok,1-busy,2-rejected,3:offline
      ioChat.to(userSocket[userTo.memberId]).emit("reqOffice", socket.userdata);
      officeStatus[socket.goto] = 0;
      officeStatus[userTo.memberId] = 0;
      setTimeout(()=>{
        if(officeStatus[socket.goto]!==0) return;
        officeStatus[socket.goto] = 1;
        officeStatus[userTo.memberId] = 1;
        socket.emit("resultOffice",{status:3,message:`${userTo.email} not responsing now. Please try later.`});
        ioChat.to(userSocket[userTo.memberId]).emit("cancelOffice");
      },30000);
    }); 
    socket.on("cancelOfficeByRequester", function(userTo) {
      if(!userTo) return;
      // if(officeStatus[userTo.memberId===0]) return socket.emit("resultOffice",{status:1,message:`${userTo.email} is busy now. Please try later.`});//0-ok,1-busy,2-rejected,3:offline
      ioChat.to(userSocket[userTo.memberId]).emit("cancelOffice");
      officeStatus[socket.goto] = 1;
      officeStatus[userTo.memberId] = 1;
    }); 
    socket.on("cancelOfficeByHost", function(userTo) {
      if(!userTo) return;
      // if(officeStatus[userTo.memberId===0]) return socket.emit("resultOffice",{status:1,message:`${userTo.email} is busy now. Please try later.`});//0-ok,1-busy,2-rejected,3:offline
      ioChat.to(userSocket[userTo.memberId]).emit("resultOffice", {status:2,message:'Rejected.'});
      officeStatus[socket.goto] = 1;
      officeStatus[userTo.memberId] = 1;
    }); 
    socket.on("acceptOffice", async function(userTo) {
      if(!userTo || !socket.userdata) {
        socket.emit("resultAccept", {status:4,message:'Socket error'});
        ioChat.to(userSocket[userTo.memberId]).emit("resultOffice", {status:4,message:'Socket error'});
      };
      const url = await meetingC.createWebOffice(socket.userdata,userTo);
      if(url==false){
        socket.emit("resultAccept", {status:4,message:'JNJ create failed'});
        ioChat.to(userSocket[userTo.memberId]).emit("resultOffice", {status:4,message:'JNJ create failed'});
        return;
      }
      socket.emit("resultAccept", {status:0,url:url.host});
      ioChat.to(userSocket[userTo.memberId]).emit("resultOffice", {status:0,url:url.join});
      officeStatus[socket.goto] = 1;
      officeStatus[userTo.memberId] = 1;
    }); 
    //for popping disconnection message.
    socket.on("disconnect", function() {
      if(!socket.userdata) return;
      console.log(socket.userdata.email + "  logged out");
      socket.broadcast.emit("broadcast", {
        description: socket.userdata.email + " Logged out"
      });
      _.unset(userSocket, socket.goto);
      userStack[socket.goto] = "Offline";
      ioChat.emit("onlineStack", userStack);
    }); //end of disconnect event.
  }); //end of io.on(connection).
  //end of socket.io code for chat feature.
  return io;
};
