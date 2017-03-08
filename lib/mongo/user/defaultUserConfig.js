/**
 * Created by vegan on 2017/2/15.
 * 用户默认配置(用于扩展)
 */
module.exports = {
    userId: 0, //- 用户id
    nickname: "",   //- 用户昵称
    isOnline:  "Y", //- 在线
    contacts: [110], //- 联系人列表
    groups: [],    //- 联系人分组列表
    messages: [],    //- 聊天消息记录(消息id)
    unreadMsg: [], //- 未读消息记录{sendId : id,number: num}
    userImg: ""   //- 用户头像
};
