/**
 * Created by vegan on 2017/1/25.
 */
var socket = io("ws://127.0.0.1:3000");
var vm = new Vue({
    el: "#webChat",
    data: {
        nickname: "",
        sendId: 0, //- 发送者id
        msgData: "", //- 发送消息数据
        currentTargetId: 0, //- 聊天用户的id
        contacts: [], //- 联系人列表
        message: [], //- 消息列表
    },
    watch: {
    },
    mounted: function(){
        this.$nextTick(function(){
            this.sendId && this.currentTargetId && socket.emit("get-message-list",{
                userId: this.sendId,
                targetId: this.currentTargetId
            });
        })
    },
    computed: {
        classObject: function () {
            return {
                "text-right": false
            }
        }
    },
    methods: {
        login: function () {
            this.nickname != "" && socket.emit("reg-user",{nickname: this.nickname});
        },
        getMsgList: function (item) {
            this.currentTargetId = item.userId;
            this.sendId && this.currentTargetId && socket.emit("get-message-list",{
                userId: this.sendId,
                targetId: this.currentTargetId
            });
        },
        sendMsg: function(){
            /*
             * sendId: 发送者id
             * recvId: 接受者id
             * msgData: 消息内容
             * msgType: 消息类型(默认1) 1: 文本类型 2: 附件类型
             *msgTime: Date.now()
             * */
            socket.emit("send-msg",{                
                sendId: this.sendId,
                recvId: this.currentTargetId,
                msgData: this.msgData,
                msgType: 1,
                msgTime: Date.now()
            });
            this.msgData = "";
        }
    }
});
socket.on("connect",function () {
        console.info("连接服务器成功");
        //- 重新注册用户
        vm.nickname && socket.emit("reg-user",{nickname: vm.nickname});
    });
    socket.on('reconnect', function() {
        console.log("重新连接到服务器");
    });
    //- 用户注册后收到的返回id
    socket.on("reg-user-response",function (msg) {
        vm.sendId = msg.sendId;
    });
    //- 发送消息
    function sendMsg(msg) {
        socket.emit("send-msg",msg);
    }
    //- 获取消息列表响应
    socket.on("get-message-list",function (message) {
        vm.message = message;
    });
    //- 接收消息
    socket.on("recv-msg",function (msg) {
        msg.forEach(function(ele){
            console.log(ele.recvId,vm.currentTargetId)
            if(ele.recvId != vm.currentTargetId) return;
            vm.message.push(ele);  
        });
    });
    //- 获取联系人列表
    socket.on("get-contacts",function (contacts) {
        console.log('contacts = ',contacts);
        if(contacts.length == 0) return;
        vm.contacts = contacts;
        //- 默认与第一个用户聊天
        vm.currentTargetId = contacts[0].userId || 0;
        vm.sendId && vm.currentTargetId && socket.emit("get-message-list",{
            userId: vm.sendId,
            targetId: vm.currentTargetId
        });
    });
    //- 更新联系人
    socket.on("update-contacts",function (msg) {
       //- 刷新联系人
        vm.contacts = msg;
    });