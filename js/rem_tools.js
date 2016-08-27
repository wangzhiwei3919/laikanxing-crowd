/**
 * Created by wzw on 2016/4/13.
 */
(function(){
    var dpr, rem, scale;
    var docEl = document.documentElement;
    var fontEl = document.createElement('style');
    var metaEl = document.querySelector('meta[name="viewport"]');
    var clientWidth=docEl.clientWidth;
    dpr = window.devicePixelRatio || 1;
    scale = 1 / dpr;
    if(currentMatch().isPc){
        clientWidth=1000;
        rem = clientWidth * 100 / 750 * dpr;

    }else{
        rem = clientWidth * 100 / 750 * dpr;
    }
    rem=rem*1/dpr;
    metaEl.setAttribute('content', 'width=' + clientWidth + ',initial-scale=1,maximum-scale=1, minimum-scale=1,user-scalable=no');

    docEl.setAttribute('data-dpr', dpr);
    docEl.firstElementChild.appendChild(fontEl);
    fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';
    window.rem2px = function (v) {
        v = parseFloat(v);
        return v * rem;
    };
    window.px2rem = function (v) {
        v = parseFloat(v);
        return v / rem;
    };
    window.dpr = dpr;
    window.rem = rem;
})();
function currentMatch(){
    var match={};
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        if(bIsIphoneOs){
            match.bIsIphoneOs=true;
        }
        match.isMobile=true;
        match.isPc=false;
    } else {
        match.isMobile=false;
        match.isPc=true;
    }
    return match;
}
$(function(){
    if(currentMatch().isPc){
        $('body').height(1778.6666666666667).width(1000);
    }else{
        $('body').height(document.documentElement.clientHeight);
    }

    $('.close-div').on('click',function(){
        $('.activity-detail').hide();
    });

    $('.show-share').on('click',function(){
        $('.share-div').show().on('click',function(){
            $(this).hide();
        });
    });
    $('.download-app').on('click',function(){
        _CZC_LOCAL.appDownloadSuccess();
        location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kwcxkj.lookstars";
    });
});