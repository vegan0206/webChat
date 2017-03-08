/**
 * [该方法实现了上传图片功能 upload]
 * @Author	veganQian
 * @DateTime         2016-12-22T17:48:58+0800
 * @param            {[要操作的input[type="file"]的id]}                 ){	window.upload [description]
 * @param            {[图片裁剪配置参数]}                 deviceW           [description]
 * @param            {裁剪图片并上传后执行的回调函数}                 options           [description]
 * @return           {[null]}                                   [description]
 */

;(function(window,$){
    window.upload = function(id,obj,callback){
		if(!id ) id = "change-user-img";
		if(!obj ) obj = {};
		var oImg = {},
			options = {
				boxWidth : 570, //容器宽度
				aspectRatio: 1, //宽高比例
				width : 200,	//生成图片后大小
				onSelect: function (e) {
				    if(!e) return;
			        //获取裁剪尺寸 this.tellSelect()
			       oImg.data = JSON.stringify(e);
			       oImg.size = options.width + "," + options.width*options.aspectRatio; // 设置图片宽高
			    }
			};
		// 覆盖默认参数
		options = $.extend(options,obj);
		initEvent(id,oImg,options,callback);
	};

    // 初始化事件
    function initEvent(id,oImg,options,callback) {
        /*input值改变触发函数*/
        $("#" + id).on("change",function () {
            var reader = new FileReader(),
                file = this.files[0],
                self = this;
            var typ = $(this).attr("data-type");
            //- 类型匹配
            if(typ && file.type.indexOf(typ) == -1) {
                alert("type error~");
                return;
            }
            reader.readAsDataURL(file);
            var maxNameLen = 30; //- 文件名最大长度
            oImg.name = file.name.length >  maxNameLen ? file.name.substring(file.name.length-maxNameLen) : file.name;
            reader.onload = function(evt){
                var str = "<img src="+this.result+" class='img-responsive center-block view-user-img' id='view-user-img' />";
                oImg.img = encodeURIComponent(this.result);
                $("#modal-user-img .view-img-container").append(str);
                $(self).val("");
                /*图片加载完成后*/
                $("#view-user-img").on("load",function () {
                    // 设置默认选中框大小
                    var maxW = options.boxWidth,
                        maxH = $("#modal-user-img .view-img-container").height();
                    maxH = maxH == 0 ? 570 : maxH;
                    maxH < maxW*options.aspectRatio ? maxW = maxH*options.aspectRatio : maxH = maxW;
                    options.setSelect = [0,0,maxW,maxH];
                    // 裁剪
                    $(this).Jcrop(options);
                    // 显示模态框
                    $("#user-img-action").click();
                });
            };
        });
        // 发送裁剪图片
        $("#modal-user-img .ok").on("click",function () {
            if(!oImg.data) return;
            //删除容器内所有元素
            $("#modal-user-img .view-img-container").empty();
            var str = '<a style="position:static; margin-left:10px;" class=" alert alert-success alert-note" data-dismiss="alert" href="#" aria-hidden="true">'+globalData.BI0177+'</a>';
            $(".change-img-body").append(str);
            $.ajax({
                url : "/upload/img-cut",
                type : "post",
                data : oImg,
                success : function (result) {
                    $(".alert-note").remove();
                    if(callback) callback.call(this,result);
                }
            });
        });
        // 取消操作
        $("#modal-user-img .cancel").on("click",function () {
            $("#modal-user-img .view-img-container").empty();
        });
    }
})(window,$);
