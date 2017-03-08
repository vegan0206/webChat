/**
 * Created by vegan on 2017/2/26.
 */

var image =require("images");
//- 上传到服务器的路径和文件名
var filePath = rootPath + '/uploads/';

module.exports = function (file) {
    if(!file.data || file.data == {}) return null;
    var base64Img = decodeURIComponent(file.data),
        name = parseInt((1+Math.random())*1000)+file.name;
    var fileFormat = base64Img.match(/^data:image\/(.*);base64,/)[1];
    var base64Data = base64Img.replace(/^data:image\/.*;base64,/, "");
    var buf = new Buffer(base64Data,'base64');
    image.copyFromImage(image(buf))
    .save(filePath+name,{
        quality: 100
    });
    return name;
};