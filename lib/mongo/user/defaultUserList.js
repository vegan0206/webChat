/**
 * Created by vegan on 2017/3/8.
 * 默认用户列表
 */
module.exports = [
	{
	    userId: 110, //- 用户id
	    nickname: "admin",   //- 用户昵称
	    isOnline:  "N", //- 离线
	    contacts: [], //- 联系人列表
	    groups: [],    //- 联系人分组列表
	    messages: [],    //- 聊天消息记录(消息id)
	    unreadMsg: [], //- 未读消息记录{sendId : id,number: num}
	    userImg: ""   //- 用户头像
	},
];