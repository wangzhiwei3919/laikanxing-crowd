/**
 * Created by wangzhiwei on 16/7/27.
 */
var _CZC_LOCAL;
//声明_czc对象:
var _czc = _czc || [];
//绑定siteid，请用您的siteid替换下方"XXXXXXXX"部分
_czc.push(["_setAccount", "1259980737"]);
$(function(){
    _CZC_LOCAL=(function(){
        return {
            common:function(category,action,label,value,nodeId){
                //_czc.push(['_trackEvent', '小说', '打分', '达芬奇密码','5','dafen']);
                _czc.push(['_trackEvent', category, action, label,value,nodeId]);
            },
            loginStart:function(){
                _czc.push(['_trackEvent', '点击', '登录', '事件起始','1','login']);
            },
            loginSuccess:function(){
                _czc.push(['_trackEvent', '行为执行', '登录', '事件成功','1','login']);
            },
            logoutSuccess:function(){
                _czc.push(['_trackEvent', '行为执行', '退出', '事件成功','1','logout']);
            },
            shareSuccess:function(){
                _czc.push(['_trackEvent', '行为执行', '分享', '事件成功','1','share']);
            },
            appDownloadSuccess:function(){
                _czc.push(['_trackEvent', '行为执行', '下载', '事件成功','1','appDown']);
            },
            fileUpload:function(){
                _czc.push(['_trackEvent', '点击', '上传', '事件起始','1','fileUpload']);
            },
            fileUploadSuccess:function(){
                _czc.push(['_trackEvent', '行为执行', '上传', '事件成功','1','fileUpload']);
            },
            addScoreSuccess:function(){
                _czc.push(['_trackEvent', '行为执行', '投票', '事件成功','1','addScore']);
            },
            addPraiseSuccess:function(){
                _czc.push(['_trackEvent', '行为执行', '点赞', '事件成功','1','addPraise']);
            },
            deletePraiseSuccess:function(){
                _czc.push(['_trackEvent', '行为执行', '取消赞', '事件成功','1','deletePraise']);
            }
        };
    })();
});


