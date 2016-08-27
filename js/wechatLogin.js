/**
 * Created by wangzhiwei on 16/7/5.
*/
if($.cookie("token")!='null' && $.cookie("token")!=undefined){
    loadHtml();
}else{
    $.ajax({
        url:'../../laikanxing_v1/website/get/h5/wechat/'+wzw.getUrlParam('code',location.href),
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        timeout: 100000,
        success: function (data, status) {
            $.cookie("token", data.token, { path: '/' });
            //$.cookie("userId", data.userId, { path: '/' });
            $.cookie("from", 'other', { path: '/' });
            loadHtml();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 403) {
                console.log(403);
            } else {
                console.log(xhr.status);
            }
        }
    });
}


