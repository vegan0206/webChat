/**
 * Created by vegan on 2017/2/15.
 * 用户对象验证模型配置
 */
module.exports = {
    userId: Number, //- 用户id
    nickname: String,   //- 用户昵称
    isOnline: String, //- 是否在线
    contacts: Array, //- 联系人列表
    groups: Array,    //- 联系人分组列表
    messages: Array,    //- 聊天消息记录
    unreadMsg: Array, //- 未读消息记录
    userImg: String   //- 用户头像
};
