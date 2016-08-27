/**
 * Created by Administrator on 2016/4/19.
 */
var wzw=function(){
    var wzw={
        //浏览器相关信息
        browser:{
            versions:function(){
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    iosView: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1 || u.indexOf('micromessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.indexOf('QQ')>-1 || u.indexOf('qq')>-1, //是否QQ
                    uc: u.indexOf('UCBrowser') > -1 || u.indexOf('uc') > -1,
                    androidView: u.indexOf('ANDROIDWEBVIEW')>-1//需要app端配合,在userAgent中加入标识
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase(),
            appVersion:navigator.appVersion,
            isIOS:function(){
                if (/iphone|ipod|ipad/.test(navigator.userAgent)) { return true;}
                else {return false;}
            }(),
            isAndroid:function(){
                if (/(Android)/i.test(navigator.userAgent)) {return true}
                else{return false}
            }(),
            isIOSView:function(){
                var standalone = window.navigator.standalone,
                    userAgent = window.navigator.userAgent.toLowerCase(),
                    safari = /safari/.test( userAgent );
                    if(!standalone && !safari){
                    return true;
                }else{
                    return false;
                }
            }()
        }
    };
    wzw.browser.isMobile=function(){
        if(wzw.browser.versions.mobile||wzw.browser.versions.android||wzw.browser.versions.ios){ return true }
        else{return false}
    }();
    wzw.browser.isPc=function(){
        if(wzw.browser.versions.mobile||wzw.browser.versions.android||wzw.browser.versions.ios){ return false }
        else{return true}
    }();
    //获取两个时间的时间差
    //@param1 毫秒（开始时间）
    //@param2 毫秒（结束时间）
    function timeSubtractionTime2(time,time2){

        var time1=new Date(new Number(time2));
        var time=new Date(new Number(time));
        var timeC=time1-time;
        if(time>time1){
            return null;
        }
        var result={};
        //result.year=time1.getYear()-time.getYear();
        //result.month=time1.getMonth()-time.getMonth();
        result.day=Math.floor(timeC/1000/60/60/24);
        result.hour=Math.floor(timeC/1000/60/60%24);
        result.minute=Math.floor(timeC/1000/60%60);
        result.second=Math.floor(timeC/1000%60);
        return result;
    }
    wzw.timeSubtractionTime2=timeSubtractionTime2;
    function getUrlParam(name,url){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        url=url.split("?")[1];
        var r = url.match(reg);  //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    }
    wzw.getUrlParam=getUrlParam;
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S",Date) ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S",Date)      ==> 2006-7-2 8:9:4.18
    function dateFormat(fmt,date) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    wzw.dateFormat=dateFormat;
    //根据对象数组某个字段进行降序排序
    //var options = data.options;options.sort(wzw.sort('votes'));//对象数组排序

    function sort(name){
        return function(o, p){
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a < b ? 1 : -1;
                }
                return typeof a < typeof b ? 1 : -1;
            }
            else {
                throw ("error");
            }
        }
    }
    wzw.sort=sort;
    function isLogin(){
        if($.cookie("token")!='null' && $.cookie("token")!=undefined){
            return true;
        }else{
            return false;
        }
    }
    wzw.isLogin=isLogin;
    function isLocal(){
        if($.cookie("from")!='null' && $.cookie("from")!=undefined){
            if($.cookie('from')=='app'){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    wzw.isLocal=isLocal;
    return wzw;
}();
