/**
 * ====================================
 * Created by wangzhiwei on 16/6/3.
 *
 * @param:当前URL中参数
 * start-------------------------------
 * 判断容器类型:1 微信,2 浏览器, 3 App view
 * |-----1 跳转 wechat.html+@param ---end
 * |
 * |-----2 跳转 other.html+@param   ---end
 * |
 * |-----3 执行后续与app通讯代码
 *   |----初始化 bridge
 *    |----执行注册方法,获取token
 *     |----判断是否正确登录
 *      |-----加载页面数据
 *
 * ====================================
 */
var param=location.href.split("?")[1];
if(wzw.browser.versions.weixin){
    //wechat
    var url=encodeURIComponent("http://h5.laikanxing.com/h5-crowd/html/wechat.html?"+param);
    window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxadc302736fea5abf&redirect_uri="+
        url+"&response_type=code&scope=snsapi_userinfo&"+param+"#wechat_redirect";
}else if( wzw.browser.isIOS ) {
    //ios
    if(wzw.browser.isIOSView){
        //view
        //loadHtml();
    }else{
        location.href='other.html?'+param;
    }
} else {
    //not iOS
    var versions=wzw.browser.versions;
    if(versions.androidView){
        //android webview
        //loadHtml();
    }else{
        location.href='other.html?'+param;
    }
}
// 初始化app通信
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge);
        }, false);
    }
}
//html创建后执行一次该函数，进行bridge初始化和handler的注册
connectWebViewJavascriptBridge(function(bridge) {
    //htmel创建后执行该函数，建立与iOS的链接
    bridge.init(function(message, responseCallback) {//iOS
        $.cookie("first", 'first', { path: '/' });
        setCookieToken(message);
        //responseCallback('success!');
    });
    //注册Handler  监听android新版本发来的数据
    bridge.registerHandler('getToken', function(data, responseCallback) {
        var message=JSON.parse(data);
        $.cookie("first", 'first', { path: '/' });
        setCookieToken(message);
    });
    //注册Handler  监听android旧版本发来的数据
    bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
        var token=data.split(',')[0].split(':')[1];
        var isLogin=data.split(',')[1].split(':')[1].substring(0,1);
        var message={'token':token,'isLogin':isLogin};
        $.cookie("first", 'first', { path: '/' });
        setCookieToken(message);
    });
    $('.show-share').on('click',h5_share(bridge));
    function h5_share(bridge){
        _CZC_LOCAL.shareSuccess();
        return function (){
            bridge.callHandler('h5_share', {'foo': 'bar'}, function(response) {
                alertDivHide($('.share-div'));//隐藏通用分享提示
            });
        };
    }
    $('.login').on('click',login(bridge));
    function login(bridge){
        return function (){
            bridge.callHandler('login', {'url': 'bar'}, function(response) {
                _CZC_LOCAL.loginStart();//登录统计
                location.reload();
            });
        };
    }
    bridge.callHandler('get_token', {'url': 'bar'}, function(response) {
        if(typeof response === "string"){
            response=JSON.parse(response);
        }
        if(!wzw.isFirst()){//是否已经通过初始化获取数据(因为需要兼容之前版本,之前没有刷新获取数据,两个接口一起使用会导致重复获取)
            //刷新获取
            setCookieToken(response);
        }else{//让下次刷新获取数据
            //已通过初始化获取
            $.cookie("first", 'reload', { path: '/' });
        }
    });
});
function setCookieToken(message){
    $.cookie("from", 'app', { path: '/' });
    if(message!=null){
        if(message.token!=null && message.token!='' && message.isLogin==1){
            //getUserId(message.token.toString());
            $.cookie("token", message.token, { path: '/' });
            _CZC_LOCAL.loginSuccess();
        }else if(message.isLogin==0){
            $.cookie("token", null, { path: '/' });
            $.cookie("userId", null, { path: '/' });
            //alert('请在app中登录!');
        }
    }
        loadHtml();
}