/**
 * Created by wangzhiwei on 16/6/19.
 * ===============================================================
 *
 * 开始判断,是否登录,
 * 未登录:显示登录按钮,加载活动数据,点击投票按钮,弹出登录窗口
 * 登录:加载用户活动数据,点击投票,进行票数运算,弹出窗口.点击窗口,刷新页面.
 *
 * ===============================================================
 */

var URLBASE="../../laikanxing_v1/crowdfunding/";
var ACTIVITYID=wzw.getUrlParam('id',location.href);
function loadHtml(){
    $(function(){
        initShareEvent();
        if(isLogin()){//已经登录
            var token=$.cookie('token');
            getCrowdFundingByUser(token,ACTIVITYID);
            $('header .login-btn').hide();
        }else{
            getCrowdFunding(ACTIVITYID);//获取未登陆数据
            $('header .login-btn').show().on('click',showLoginDiv);//显示登陆框
        }
        if(isLocal()){//判断是否在来看星app中,进行相应的元素显示和隐藏.
            hideOtherElement();
        }else{
            showOtherElement();
        }
    });
}

function isLogin(){
    if($.cookie("token")!='null' && $.cookie("token")!=undefined){
        return true;
    }else{
        return false;
    }
}
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
function hideOtherElement(){
    $('.other').hide();
    $('.local').show();
    $('header .login-btn').hide();
}
function showOtherElement(){
    $('.other').show();
    $('.local').hide();
}
function initShareEvent(){//初始化分享弹窗
    $('.share-btn').on('click',showShareDiv);
}
function getCrowdFundingByUser(token,activityId){//已登录
    $.ajax({
        url:URLBASE+'get/'+activityId,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        timeout: 100000,
        headers:{"FanShowAuth":token},
        success: function (data, status) {
            appendData(data);
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
function getCrowdFunding(activityId){//未登录
    $.ajax({
        url:URLBASE+'get/base/'+activityId,
        contentType: "application/json",
        type: "GET",
        dataType: "json",
        timeout: 100000,
        success: function (data, status) {
            appendData(data);
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
function appendData(data){//追加数据
    if(data.options.length==1){
        optionOne(data);//追加数据
        initBackGround(1,0);//1为option长度,0用于背景高度
        $('.main-title').css('color','#ff5374');
    }else{
        optionMore(data);//追加数据
        initBackGround(data.options.length,$('.main').height());
    }
}
function optionOne(data){
    var ele=$('.one-option');
    var over=initCurrentProgress(data.options[0].votes,data.target,ele.find('.progress .bar'));
    var option=data.options[0];
    var endDate=data.endDate;
    ele.show();//显示元素
    initTitle(data);
    initOption(data.options[0],ele,over);
    appendAttr(ele,'data-top',0);//用于弹窗读取,下同
    appendAttr(ele,'data-votes',option.votes);
    if(endDate<=0){//活动是否已经结束
        ele.find('.img-box a').addClass('activity-end').html('活动已结束');
    }else{
        if(!option.ballot){//true已支持,false未支持
            ele.find('.img-box a').addClass('add-vote').attr('data-option',option.id).html('支持').attr('data-option',option.id);//未投票,记录选项id
        }else{
            ele.find('.img-box a').addClass('add-success').html('今日已支持,邀请好友来帮忙').on('click',showShareDiv);//投票成功
        }
        initAddVote($('.add-vote'));
    }

}
function optionMore(data){
    var box=$('.option-box');
    var endDate=data.endDate;
    initTitle(data);
    box.show();
    var options = data.options;
    options.sort(wzw.sort('votes'));//对象数组排序
    for(var index in options){
        var over;
        var ele;
        var option=options[index];
        if(index==0){
            ele=$('#clone');
            over=initCurrentProgress(options[index].votes,data.target,ele.find('.detail .progress .bar'));
            initOption(option,ele,over);
        }else{
            ele=$($('#clone').clone());//复制
            over=initCurrentProgress(options[index].votes,data.target,ele.find('.detail .progress .bar'));
            ele.attr('id', 'clone' + index);//修改id
            box.append(ele);//追加
            initOption(option,ele.find('.detail .info'),over);
        }
        appendAttr(ele,'data-top',index);
        appendAttr(ele,'data-votes',option.votes);
        ele.find('.detail img').attr('src',option.headerImgUrl);//头像
        ele.find('.detail .info .top .name').html(option.name);//名字
        //初始化投票按钮状态
        if(endDate<=0){//活动是否已经结束
            ele.find('.detail .info .top .btn').addClass('activity-end').html('活动已结束');
        }else{
            ele.find('.detail .info .top .btn').attr('class','btn');
            if(!option.ballot){//true已支持,false未支持
                if(data.votes<=0){//是否还可投票,大于0,可投票
                    ele.find('.detail .info .top .btn').addClass('over-vote').html('支持');//无票
                }else{
                    ele.find('.detail .info .top .btn').addClass('add-vote').attr('data-option',option.id).html('支持');//未投票,记录选项id
                }
            }else{
                ele.find('.detail .info .top .btn').addClass('add-success').html('已支持');//投票成功
            }
        }

    }
    initAddVote($('.add-vote'));

}
function initTitle(data){
    $('.body-title .main-title').html(data.title);
    if(data.endDate<=0){//活动是否已经结束
        $('.body-title .main-day').html('活动已结束').css('color','#ff537c');
    }else{
        $('.body-title .main-day span').html(data.endDate);
    }
    $('.head-background img').attr('src',data.headerImgUrl);//背景图
    $('.main-detail .detail-content').html(data.detail);
}
function  initOption(data,option,over){
    option.find('.bottom .people .nmb').html(data.people+'人');//人数
    option.find('.bottom .target .nmb').html(over+'%');//完成度
    option.find('.bottom .votes .nmb').html(data.votes+'点');//人气值
}
function initBackGround(option,width){//不同选项,背景展示不相同.
    if(option==1){//一个选项
        $('.head-background img').addClass('one');
        $('.main-background').hide();
        $('.main-detail').css('background-color','#f2f2f2');
    }else{
        $('.head-background img').addClass('more');
        $('.main-background').height(width).show();
        $('.main-detail').css('background-color','#ffffff');
    }
}
function initAddVote(option){//初始化分数添加
    option.on('click',function(){//未投票选项,添加投票事件
        var thisBtn=$(this);
        var parent=$(thisBtn.closest('.one-option'));
        var nmb;
        var name;
        if(parent.length==0){//如果集合是空,表示当前点击元素为option-box中元素
            parent=$(thisBtn.closest('.option'));
            nmb=parent.find('.votes .nmb').html();
            name=parent.find('.top .name').html();
        }else{
            nmb=parent.find('.votes .nmb').html();
            name=$('.body-title .main-title').html();
        }
        if(isLogin()){//是否登录
            var from=1;
            if(isLocal()){
                from=2;
            }
            addVote(wzw.getUrlParam('id',location.href),thisBtn.attr('data-option'),from,parent);//投票
            function addVote(activityId,optionId,from,option){
                $.ajax({
                    url:URLBASE+'activity/vote/'+activityId+'/'+optionId+'/'+from,
                    contentType: "application/json",
                    type: "PUT",
                    dataType: "json",
                    timeout: 100000,
                    headers:{"FanShowAuth": $.cookie('token')},
                    success: function (data, status) {
                        _CZC_LOCAL.addScoreSuccess();
                        showResult(nmb,name,from,option);
                        function showResult(nmb,name,from){
                            var ele=$('.activity-detail');
                            var top=option.attr('data-top');
                            ele.show().on('click',function(){
                                loadHtml();
                            });
                            if(from!=2){
                                $('.activity-detail .download-app').show();
                            }
                            ele.find('.content .name').html(name);
                            ele.find('.content .nmb').html(nmb+'+'+from);
                            if(top==0){
                                ele.find('.content .top').html("已经是第一名了,保持加油哦~");
                            }else{
                                var votes=$('[data-top="'+(top-1)+'"]').attr('data-votes');//上一名积分
                                if((nmb+from)>votes){
                                    ele.find('.content .top').html("你已成功帮他超过上一名!");//问中文!!!是否需要这个提示
                                }else{
                                    nmb=votes-nmb-from;
                                    ele.find('.content .top').html("距离上一名还差"+nmb+"点人气!");
                                }

                            }

                        }
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
        }else{
            showLoginDiv();
        }
    });
}
function initCurrentProgress(votes,target,progress){//当前进度条百分比
    var over=votes/target;
    over=Math.floor(over*100);
    if(over>100){
        var width=Math.log(votes/target)/Math.log(10);
        progress.css('width',100+'%');//进度条
        width=Math.floor(width*100);
        if(width>=100){
            width=100;
        }
        progress.find('div').css('width',width+'%');
    }else{
        progress.css('width',over+'%');//进度条
    }
    return over;
}
function showLoginDiv(){
    _CZC_LOCAL.loginStart();//数据统计
    $('.login-div').show();
}
function showShareDiv(){
    _CZC_LOCAL.shareSuccess();//数据统计
    $('.share-div').show().on('click',function(){
        $(this).hide();
    });
}
function loginCallBak(){
    _CZC_LOCAL.loginSuccess();//数据统计
    $.cookie("from", 'other', { path: '/' });
    var token=$.cookie('token');
    getCrowdFundingByUser(token,ACTIVITYID);
    $('.login-div').hide();
    $('header .login-btn').hide();
   // getCrowdFundingByUser($.cookie('token'));
}
function registerCallBack(){
    alert('注册失败,请重试!');
}
function appendAttr(ele,name,value){
   ele.attr(name,value);
}