/**
 * Created by vegan on 2017/2/12.
 * websocket服务器基本配置
 */
var  startNum = 1000;  //- 用户注册id从1000起

var saveImg = require(rootPath + "/lib/util/saveImg");
var extendObj = require(rootPath + "/lib/util/extendObj");
var isEmptyObject = require(rootPath + "/lib/util/isEmptyObject");

/*MongoDB 构造函数(建立数据库连接，操作数据库)*/
var MongoDB = require(rootPath + "/lib/mongo/mongoDB");
var mongoDB = new MongoDB();

/**
 * [服务器发送消息到指定用户]
 * @param  {[ws]} ws  [socket 对象]
 * @param  {[msg]} msg [消息对象]
 * @return {[null]}     [无]
 */
function sendMsg(ws,msg) {
    //- 更新标记发送状态
    msg = (Object.prototype.toString.call(msg)=='[object Array]' ? msg : [msg]).map(function (ele,i) {
        let _id = ele._id;
        ele.isSend = "Y";
        //- 更新消息发送状态
        mongoDB.updateMessage({_id:_id},{isSend:'Y'});
        return ele;
    });
    ws.emit("recv-msg",msg);
    //- 发送更新联系人
    updateContacts(ws,msg.sendId);
}
/**
 * [更新联系人列表]
 * @param  {[ws]} ws  [socket对象]
 * @param  {[number]} userId [用户id]
 * @return {[null]}     [null]
 */
function updateContacts(ws,userId) {
    mongoDB.findUser({userId: userId}).then((doc) =>{
        let contacts = doc.contacts || [];
        let list = [];
        mongoDB.findUsers({userId: {"$in": contacts}}).then((items) =>{       
            items.forEach((ele) => {
                list.push({
                    nickname: ele.nickname,
                    userId: ele.userId,
                    isOnline: ele.isOnline
                });
            });
            ws.emit("get-contacts",list)
        });
    });
}
var getMessagList = function (ws,userId,targetId) {
    mongoDB.findUser({userId: userId}).then((doc) => {
        let message = [];
        mongoDB.findMsgs({_id: {"$in": doc.messages}}).then((msg) =>{
            msg.forEach((ele) =>{
                if((ele.recvId == targetId && ele.sendId == userId) || (ele.recvId == userId && ele.sendId == targetId)) {
                    //- 标记发送者和接收者  true 为发送
                    ele.flag = ele.recvId == targetId ? true : false;
                    message.push(ele);
                }
            });
            //- 返回消息列表
            ws.emit("get-message-list",message);
        });
    });
};
var users = [], //- 保存用户ID
    sockets = {}; //- 保存每个ID对应的socket

module.exports = function (server) {
    var io = require('socket.io')(server);
    io.on('connection', (socket) => {
        //- 用户ID注册到socket
        socket.on('reg-user', (msg) => {
            //- 保存用户上传头像 - 未实现
            if(msg.imgData){
                msg.userImg = saveImg(msg.imgData);
            }
            //- 自动为注册用户添加id
            mongoDB.findUser({nickname: msg.nickname}).then((doc) =>{
                let userId = doc.userId || "";
                //- 检查用户是否存在，不存在则保存用户到数据库
                if(!doc.userId){
                    //- 用户不存在,保存用户到数据库
                    mongoDB.getLastDoc(mongoDB.UserModel).then((doc) => {
                        //- 用户id 每次在最后一个用户id的基础上加1
                        let userId = doc.length == 0 ? startNum : parseInt(doc.userId) + 1;
                        msg.userId = userId;
                        let user = extendObj(mongoDB.defaultUserConf,msg,true);
                        mongoDB.saveUser(user).then((doc) =>{
                            //- 返回联系人列表
                            updateContacts(socket,doc.userId);
                        });
                        //- 将在线用户缓存在全局变量中
                        users.push(userId);
                        sockets[userId] = socket; //- 将sockets缓存到全局变量中
                        //- 返回用户id
                        socket.emit("reg-user-response",{sendId: userId});
                        console.info("users list = ",users);
                        //- 将所有注册用户默认添加到admin的联系人中
                        userId != 110 && mongoDB.findUser({userId: 110}).then((doc) =>{
                            if(doc.isEmptyObject) return;
                            doc.contacts.indexOf(userId) == -1 && doc.contacts.push(userId);
                            console.log('doc = ',doc);
                            mongoDB.updateUser({userId: 110},doc);
                        });
                    });
                }
                //- 用户存在操作
                else{
                    //- 用户已经登陆
                    if(users.indexOf(userId) == -1) users.push(userId);
                    sockets[userId] = socket; //- 将sockets缓存到全局变量中
                    //- 返回用户id
                    socket.emit("reg-user-response",{sendId: userId});
                    //- 获取联系人列表
                    updateContacts(socket,userId);
                    //- 用户存在，查找未读消息
                    if(doc.unreadMsg.length != 0){
                        mongoDB.findMsg({recvId: userId,isSend: "N"}).then((doc) => {
                            doc.length != 0 && sendMsg(socket,doc)
                        });
                    }
                    console.info("users list = ",users);
                }
            });
        });
        //- 断开连接
        socket.on('disconnect', () => {
            let id= 0,index = -1;
            for(let key in sockets){
                if(sockets[key] == socket){
                    id = key;
                    index = users.indexOf(parseInt(id));
                    break;
                }
            }
            //- 删除全局变量中得数据
            if(index != -1){
                users.splice(index,1);
                delete sockets[id];
                mongoDB.updateUser({userId: id},{isOnline: "N"});
            }
            console.info("users = ",users);
        });
        //- 服务器接收用户发送的消息
        socket.on("send-msg", (msg) => {            
            //- 保存消息到数据库
            msg = extendObj(mongoDB.defaultMsgConf,msg,true);
            mongoDB.saveMsg(msg).then((doc) =>{
                //- 更新消息到发送者列表
                sendMsg(sockets[msg.sendId],doc);
                let msgId = doc._id; //- 缓存消息id
                //- 将联系人和消息记录添加到发送者和接收者中                
                //- 更新发送人信息
                mongoDB.findUser({userId: msg.sendId}).then((doc) => {
                    //-  添加联系人列表
                    doc.contacts.indexOf(msg.recvId) == -1 && doc.contacts.push(msg.recvId);
                    //- 添加到消息列表
                    doc.messages.push(msgId);
                    mongoDB.updateUser({userId: doc.userId},doc);
                });
                //- 更新接收消息人信息
                mongoDB.findUser({userId: msg.recvId}).then((doc) => {
                    //-  添加联系人列表
                    doc.contacts.indexOf(msg.sendId) == -1 && doc.contacts.push(msg.sendId);
                    //- 添加到消息列表
                    doc.messages.push(msgId);
                    mongoDB.updateUser({userId: doc.userId},doc);
                });

                if(users.indexOf(msg.recvId) != -1){ //- 用户在线  直接发送消息
                    sendMsg(sockets[msg.recvId],doc);
                }
                else{ //- 用户离线
                    //- 未读消息？？？  保存消息到未读消息列表中{sendId : id,number: num}
                    mongoDB.findUser({userId: msg.recvId}).then((doc) =>{
                        //- 未读消息中是否有该联系人
                        var hasSendUser = false,
                            userIndex = -1,
                            unreadMsg = doc.unreadMsg;
                        for(let i = 0,len = unreadMsg.length; i < len; ++i){
                            if(unreadMsg[i]["sendId"] == msg["sendId"]){
                                hasSendUser = true;
                                userIndex = i;
                                break;
                            }
                        }
                        hasSendUser ? unreadMsg[userIndex]["number"] += 1: unreadMsg.push({sendId: msg["sendId"],number: 1});
                        mongoDB.updateUser({_id: doc._id},{unreadMsg: unreadMsg});
                        return doc;
                    });
                }
            });
        });
        //- 用户查询消息列表
        socket.on("get-message-list",(msg) => {
            //- 获取消息列表
            getMessagList(socket,msg.userId,msg.targetId);
        });
    });
};