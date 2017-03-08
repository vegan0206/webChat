/**
 * Created by vegan on 2017/2/11.
 * mongoDB连接
 */
var mongoose = require('mongoose');
var bluebird = require('bluebird');
    mongoose.Promise = bluebird; //- 替换原来不建议使用的promise
var Schema = mongoose.Schema;
var mongoConf = require("./mongoDBConfig");
var db = mongoose.connect("mongodb://"+mongoConf.host+":"+mongoConf.port+"/"+mongoConf.db);

db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("——数据库连接成功！——");
});

//- 消息模型
var msgSchemaConfig = require("./message/msgSchemaConfig");
var defaultMsgConf = require("./message/defaultMsgConfig");

//- 用户模型
var userSchemaConfig = require("./user/userSchemaConfig");
var defaultUserConf = require("./user/defaultUserConfig");

function MongoDB() {
    //- 创建集合名为： message
    this.msgSchema = new Schema(msgSchemaConfig,{collection: "message",autoIndex: true});
    this.MsgModel = db.model('Msg',this.msgSchema);
    this.msgEntity = new this.MsgModel();
    this.defaultMsgConf = defaultMsgConf;

    //- 创建集合名为： users
    this.userSchema = new Schema(userSchemaConfig,{collection: "users",autoIndex: true});
    this.UserModel = db.model("User",this.userSchema);
    this.userEntity = new this.UserModel();
    this.defaultUserConf = defaultUserConf;
    return this;
}
MongoDB.prototype.getLastDoc = function (model) {
    if(!model ) return [];
    let promise = model.find({})
        .exec()
        .then((doc) =>{
            return doc.length > 0 ? doc[doc.length - 1] : [];
        });
    return promise;
};
/**
 * [saveMsg 保存消息到数据库]
 * @param  {[obj]} msg [消息记录]
 * @return {[obj]}     [promise对象，可以通过then获取保存结果]
 */
MongoDB.prototype.saveMsg = function (msg) {
    var promise = this.MsgModel.create(msg)
        .then((doc) =>{
            return doc;
        });
    return promise;
};
/**
 * [saveUser 保存用户到数据库]
 * @param  {[obj]} user [用户记录]
 * @return {[obj]}     [mongo对象]
 */
MongoDB.prototype.saveUser = function (user) {
    var promise = this.UserModel.create(user)
        .then((doc) =>{
            console.info("保存联系人成功");
            return doc;
        });
    return promise;
};

/**
 * [查找消息记录]
 * @param  {[obj]} options [查找条件]
 * @return {[Array]}         [promise对象，可以通过then获取查询结果]
 */
MongoDB.prototype.findMsg = function (options) {
    var promise = this.MsgModel.find(options)
        .exec()
        .then((doc) =>{
            return doc.length  != 0 ? doc[0] : [];
        });
    return promise;
};
/**
 * [查找多条消息记录]
 * @param  {[obj]} options [查找条件]
 * @return {[Array]}         [promise对象，可以通过then获取查询结果]
 */
MongoDB.prototype.findMsgs = function (options) {
    var promise = this.MsgModel.find(options)
        .exec()
        .then((doc) =>{
            return doc;
        });
    return promise;
};
/**
 * [查找用户记录]
 * @param  {[obj]} options [查找条件]
 * @return {[promise]}         [promise对象，可以通过then获取查询结果]
 */
MongoDB.prototype.findUser = function(options){
    var promise = this.UserModel.find(options)
        .exec()
        .then(function (doc) {
            return doc.length  != 0 ? doc[0] : {};
        });
    return promise;
};
/**
 * [查找多个用户]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
MongoDB.prototype.findUsers = function(options){
    var promise = this.UserModel.find(options)
        .exec()
        .then(function (doc) {
            return doc;
        });
    return promise;
};
/**
 * [更新消息]
 * @param  {[obj]} findCondition [查找用户条件]
 * @param  {[obj]} updateOption  [更新的内容]
 * @return {[null]}               [更新操作不返回值]
 */
MongoDB.prototype.updateMessage = function(findCondition,updateOption){
    this.MsgModel.update(findCondition, updateOption,(err) => {        
        console.info(err ? "更新消息失败 error = " : "更新消息成功", err)
    });
};

/**
 * [更新用户信息]
 * @param  {[obj]} findCondition [查找用户条件]
 * @param  {[obj]} updateOption  [更新的内容]
 * @return {[null]}               [更新操作不返回值]
 */
MongoDB.prototype.updateUser = function(findCondition,updateOption){
    this.UserModel.update(findCondition, updateOption,(err) => {
        console.info(err ? "更新用户失败 error = " : "更新用户成功", err)
    });
};

module.exports = MongoDB;