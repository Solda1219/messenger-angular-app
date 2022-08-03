const router = require('express').Router();
//middleware
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const requireSuper = require('../middlewares/requireSuper');
//controller
const smsController = require('../controller/phoneSMS')
const msgController = require('../controller/mail')
const AuthenticationController = require('../controller/authentication')
const accountController = require('../controller/account')
const deptController = require('../controller/dept')
const addressController = require('../controller/addressbook')
const recordingController = require('../controller/recording');
const cloudDiskController = require('../controller/clouddisk');
const annonymostController = require('../controller/anonymous');
const meetingController = require('../controller/meeting');
const infoController = require('../controller/info');
const messageBoardController = require('../controller/messageBoard');
const eventController = require('../controller/event');
//user authentication
router.post('/user/login',AuthenticationController.login);
router.post('/user/resetPasswordByPhone',AuthenticationController.resetPasswordByPhone);
router.get('/captchaBlob/:width?/:height?',AuthenticationController.captchaBlob);
router.get('/captchaImage/:width?/:height?',AuthenticationController.captchaImage);
router.post('/sendPhoneverify',smsController.phoneSMS);
router.post('/checkPhoneverify',smsController.phoneVerify);
//anonymous page
router.post('/annonymous/getDept',annonymostController.getDept);
router.post('/annonymous/getUsers',annonymostController.getUsers);
//dept manage
router.post('/dept/get',[requireAuth],deptController.get);
router.post('/dept/create',[requireAuth],deptController.create);
router.post('/dept/del',[requireAuth],deptController.del);
//profile manage
router.post('/profile/get',[requireAuth],accountController.getProfile);
router.post('/profile/edit',[requireAuth],accountController.editProfile);
router.post('/webofficesetting/edit',[requireAuth],accountController.editOfficeSetting);

router.post('/addressBook/get',[requireAuth],addressController.get);
router.post('/addressBook/getInsideUser',[requireAuth],addressController.getInsideUser);
router.post('/addressBook/createIn',[requireAuth],addressController.createIn);
router.post('/addressBook/createOut',[requireAuth],addressController.createOut);
router.post('/addressBook/edit',[requireAuth],addressController.edit);
router.post('/addressBook/del',[requireAuth],addressController.del);
router.post('/addressBook/regroup',[requireAuth],addressController.regroup);

router.post('/e-card/get',[requireAuth],accountController.getEcard);
router.post('/e-card/edit',[requireAuth],accountController.editEcard);
router.post('/e-card/getUserCard',accountController.getUserCard);

//account manage
router.post('/user/get',[requireAuth],accountController.get);
router.post('/user/create',[requireAuth],accountController.create);
router.post('/user/edit',[requireAuth],accountController.edit);
router.post('/user/del',[requireAuth],accountController.del);
router.post('/user/redept',[requireAuth],accountController.redept);
router.post('/user/getContact',[requireAuth],accountController.getContact);
router.post('/user/resetPasswordUser',[requireAuth],accountController.resetPasswordUser);
router.post('/user/sendmessage',[requireAuth],msgController.sendGmail);
//cloud page
router.post('/recording/get',[requireAuth],recordingController.get);
router.post('/recording/read',[requireAuth],recordingController.read);
// router.post('/cloudstorage/create',[requireAuth],recordingController.create);
// router.post('/cloudstorage/del',[requireAuth],recordingController.del);

router.post('/cloudDiskController/get',[requireAuth],cloudDiskController.get);
router.post('/cloudDiskController/upload',[requireAuth],cloudDiskController.upload);
router.post('/cloudDiskController/share',[requireAuth],cloudDiskController.share);
router.post('/cloudDiskController/edit',[requireAuth],cloudDiskController.edit);
router.post('/cloudDiskController/del',[requireAuth],cloudDiskController.del);
router.post('/cloudDiskController/getOne',cloudDiskController.getOne);
//meeting
router.post('/instantmeeting/createInstantMeetig',[requireAuth],meetingController.createInstantMeeting);
router.post('/instantmeeting/getInstantMeeting',[requireAuth],meetingController.getInstantMeeting);
router.post('/instantmeeting/editInstantParticipant',[requireAuth],meetingController.editInstantParticipant);
router.post('/instantmeeting/cancelParticipant',[requireAuth],meetingController.cancelParticipant);
router.post('/instantmeeting/startInstantMeeting',[requireAuth],meetingController.startMeeting);
router.post('/instantmeeting/cancelInstantMeeting',[requireAuth],meetingController.cancelMeeting);

router.post('/meeting/getHistoryMeeting',[requireAuth],meetingController.getHistoryMeeting);
router.post('/meeting/getHistoryRecord',[requireAuth],meetingController.getRecordingMeeting);
router.post('/meeting/del',[requireAuth],meetingController.del);
router.post('/meeting/getplayback',[requireAuth],meetingController.getplayback);
router.post('/meeting/restart',[requireAuth],meetingController.restart);
router.post('/meeting/getShare',[requireAuth],meetingController.getShare);
router.post('/meeting/getAllMeeting',[requireAuth],meetingController.getAllMeeting);
//message board
router.post('/messageBoard/getUsers',[requireAuth],messageBoardController.getUsers);
router.post('/messageBoard/leaveMessage',[requireAuth],messageBoardController.leavemessage);
router.post('/messageBoard/leavemessageForOutSide',messageBoardController.leavemessageForOutSide);
router.post('/messageBoard/checkMessage',[requireAuth],messageBoardController.checkMessage);
router.post('/messageBoard/editMessage',[requireAuth],messageBoardController.editmessage);
router.post('/messageBoard/saveToCloud',[requireAuth],messageBoardController.saveToCloud);
router.post('/messageBoard/read',[requireAuth],messageBoardController.read);
//calendar event
router.post('/event/get',[requireAuth],eventController.get);
router.post('/event/create',[requireAuth],eventController.create);
router.post('/event/edit',[requireAuth],eventController.edit);
router.post('/event/del',[requireAuth],eventController.del);
router.post('/event/alarm',[requireAuth],eventController.getEventAlarm);
router.post('/event/alarmRead',[requireAuth],eventController.alarmRead);
//learn url
router.post('/learn/learnRecord/recordingnew', [requireAuth], meetingController.recordingLearnNew);

//mail url
router.post('/mails/get', [requireAuth], msgController.getReceivedMail);
router.post('/mails/del', [requireAuth], msgController.del);
router.post('/mails/read', [requireAuth], msgController.read);

//get info 
router.post('/info/get',[requireAuth],infoController.getInfo);
module.exports = router
