/**
 * Created by vegan on 2017/3/2.
 * 判断对象是否为空对象
 */

module.exports = function isEmptyObject(o) {
    for (let k in o)
        return false;
    return true;
};