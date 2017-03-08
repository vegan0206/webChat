/**
 * Created by vegan on 2017/2/12.
 * 消息对象验证模型配置
 */

module.exports = {
    id: String, //- 消息id
    isSend: String, //- 是否发送
    isRead: String, //- 是否阅读
    sendId: Number,    //- 发送者id
    recvId: Number,    //- 接收者id
    msgData: String, //- 消息内容
    msgType: Number,   //- 消息类型
    msgTime: Date   //- 发送消息时间
};