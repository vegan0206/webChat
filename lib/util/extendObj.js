/**
 * 该函数实现了合并多个对象的扩展
 * @Author	veganQian
 * @DateTime         2016-11-20T16:32:23+0800
 * @param            {[obj]}                    [源json对象(可以为多个)]
 * @param            {[boolean]}                [可选，后面对象的属性是否覆盖前面，true为覆盖]
 * @return           {[obj]}                   [扩展后的json对象]
 */
module.exports = function(){
    var deep = false,
        args = arguments,
        length = args.length,
        target = args[0];
    if(length <= 1) return args[0] || target;
    if(typeof args[length - 1] === "boolean"){
        deep = args[length - 1];
        length -= 1;
    }
    for(var i = 1;i < length; ++i){
        if(typeof args[i] !== "object") continue;
        for(var key in args[i]){
            if(!deep && key in target) continue;
            target[key] = args[i][key];
        }
    }
    return target;
};