var extendObj = require(__dirname + "/lib/util/extendObj");
/*默认用户 admin*/
var defaultUserList = require(__dirname + "/lib/mongo/user/defaultUserList"); 
/*MongoDB 构造函数(建立数据库连接，操作数据库)*/
var MongoDB = require(__dirname + "/lib/mongo/mongoDB");
var mongoDB = new MongoDB();

defaultUserList.forEach((user)=>{
	user = extendObj(mongoDB.defaultUserConf,user,true);
	mongoDB.findUsers({userId: user.userId}).then((doc) =>{
		if(doc.length == 0){
			mongoDB.saveUser(user);
		}
	})
});