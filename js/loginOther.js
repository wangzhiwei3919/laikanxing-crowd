/**
 * Created by wangzhiwei on 16/6/2
 * 初始化动画事件.(判断是否为app中打开(根据链接是否存在token))
 * 初始化登录事件(登录成功,调用登录成功事件>调用登录成功回调)
 * 创建验证方法
 * 初始化注册事件(注册成功,调用登录事件)
 */

function loadLogin(){
    $(function(){
        var base_url='../../musicwar/';
        initEvent();
        initLogin();
        if(!isLocal()){
            initWeibo();
            initQqLogin();
        }
        var validate={
            //ele,errorEle:jQuery对象
            phone:function(ele,errorEle){
                var phone=ele.val();
                var reg = /^1[3|7|5|8][0-9]\d{8}$/;
                var v=true;
                if(phone.length>11 && v==true){
                    errorEle.html('请输入正确的手机号码');
                    v=false;
                }
                if(phone.length==0){
                    errorEle.html('请输入手机号码');
                    v=false;
                }
                if(!reg.test(phone)){
                    errorEle.html('请输入正确的手机号码');
                    v=false;
                }
                if(!v){
                    this.css(ele);
                }else{
                    errorEle.html('');
                }
                return v;
            },
            checked:function(ele,errorEle){
                var checked=ele.val();
                var regC=/^[0-9]{6}$/;
                var v=true;
                if(checked.length==0){
                    errorEle.html('验证码不能为空');
                    v=false;
                }
                if(!regC.test(checked) && v==true){
                    errorEle.html('您输入的验证码错误');
                    v=false;
                }
                if(!v){
                    this.css(ele);
                }else{
                    errorEle.html('');
                }
                return v;
            },
            password:function(ele,errorEle){
                var password=ele.val();
                var regP=/^[0-9a-zA-Z]{6,16}$/;
                var v=true;
                if(password.length==0){
                    errorEle.html('请输入您的密码');
                    v=false;
                }
                if(!regP.test(password) && v==true){
                    errorEle.html('密码应为6-16位,只能包含数字与字母');
                    v=false;
                }
                if(!v){
                    this.css(ele);
                    $('.hide-password').show();
                }else{
                    errorEle.html('');
                }
                return v;
            },
            css:function(ele){
                ele.css('border-color','#fa4c87');
                ele.on('focus',function(){
                    $(this).css('border-color','#3edbee');
                });
                ele.on('blur',function(){
                    $(this).css('border-color','#cdcdcd');
                });
            }
        };
        initRegister();
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
        function initRegister(){//初始化注册事件,交互
            $('.get-checked-code-btn').on('click',getCheckedCode);//获取验证码
            $('#submitRegister').on('click',function(){
                var elePhone=$('#registerPhone');
                var elePassword=$('#registerPassword');
                var eleChecked=$('#registerChecked');
                var errorLog=$('.register-box .register-password-log');
                if(!validate.phone(elePhone,errorLog)){
                    return;
                }
                if(!validate.checked(eleChecked,errorLog)){
                    return;
                }
                if(!validate.password(elePassword,errorLog)){
                    return;
                }
                $.ajax({
                    url: base_url+'user/rigster/'+elePhone.val()+'/'+$.md5(elePassword.val())+'/'+eleChecked.val(),
                    contentType: "application/json",
                    type: "GET",
                    dataType: "json",
                    timeout: 100000,
                    success: function (datas, status) {
                        var data=JSON.parse(datas);
                        if(data.state==0){
                            errorLog.html('验证码错误!');
                            validate.css(eleChecked);
                        }else{
                            //getUserByToken(data.token);
                            login(elePhone.val(),elePassword.val());
                            $('.register-div').hide();//隐藏注册框
                        }
                    },
                    error: function (xhr, status ) {
                        if (xhr.status == 403) {
                            console.log(403);
                        } else {
                            console.log(status);
                        }
                    }
                });
            });

            function getCheckedCode(){
                if(!validate.phone($('#registerPhone'),$('.register-box .register-password-log'))){
                    return;
                }
                var ele=$('.get-checked-code-btn');
                var countdown=59;
                ele.css('color','#b8b8b8');//修改颜色

                var clear=setInterval(function(){
                    if(countdown==0){
                        regetCheckedCode(ele);
                    }else{
                        ele.html(countdown--+'<small>S</small>后重新获取');
                    }

                },1000);
                $(this).unbind();//防止重复点击
                $.ajax({
                    url: '../../musicwar/user/send/code/'+$('.register-box .username input').val(),
                    contentType: "application/json",
                    type: "GET",
                    dataType: "json",
                    timeout: 100000,
                    data:JSON.stringify({'phoneNumber':$('.register-box .username input').val()}),
                    success: function (datas, status) {
                        var data=JSON.parse(datas);
                        if(data.state==0){//已注册
                            $('.register-box .register-password-log').html('您输入的手机号码已注册,请直接登录');
                            regetCheckedCode(ele);
                        }
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status == 403) {
                            console.log(403);
                        } else {
                            console.log(status);
                        }
                    }
                });
                function regetCheckedCode(ele){
                    ele.css('color','#ff537e').html('重新获取验证码');
                    clearInterval(clear);
                    ele.on('click',getCheckedCode);
                }
            }
        }
        function initLogin(){
            $('#submitLogin').on('click',function(){
                var elePhone=$('#loginPhone');
                var elePassword=$('#loginPassword');
                var eleErrorLog=$('.login-box .error-log');
                if(!validate.phone(elePhone,eleErrorLog)){
                    return;
                }
                if(!validate.password(elePassword,eleErrorLog)){
                    return;
                }
                login(elePhone.val(),elePassword.val());
            });
        }
        function initEvent(){
            $('.close-login-div').on('click',function(){
                $('.'+$(this).attr('data-value')).hide();
            });
            //$('.login').on('click',function(){
            //    $('.password input').val("");
            //    $('.checked input').val("");
            //    try{
            //        var token=wzw.getUrlParam('token',location.href);
            //        if(token==null || token==undefined){//是否存在token
            //            if($.cookie("token")=='null' || $.cookie("token")==undefined){//不存在cookie
            //                $('.login-div').show();
            //            }else{
            //                loginSuccess($.cookie("token"));//登录成功
            //            }
            //        }else{//app中已经登录
            //            loginSuccess($.cookie("token"));
            //        }
            //
            //    }catch(e){
            //        if($.cookie("token")=='null' || $.cookie("token")==undefined){//work here
            //            $('.login-div').show();
            //        }else{
            //            loginSuccess($.cookie("token"));
            //        }
            //    }
            //});
            $('.to-register-btn').on('click',function(){//切换弹窗
                $('.register-div').show();
                $('.login-div').hide();
            });
            //$('.hide-password').on('click',function(){//显示密码
            //    var ele=$(this).parent().find('input');
            //    var type=$(ele).attr('type');
            //    if(type=='password'){
            //        $(this).css('top','.12rem').find('img').attr('src','../img/login/show-password.png');
            //        $(ele).attr('type','text');
            //    }else{
            //        $(this).css('top','.24rem').find('img').attr('src','../img/login/hide-password.png');
            //        $(ele).attr('type','password');
            //    }
            //});
            $('.to-login-btn').on('click',function(){//切换弹窗
                $('.register-div').hide();
                $('.login-div').show();
            });
        }
        function loginSuccess(token){
            $.cookie("token", token, { path: '/' });
            $.cookie("from", 'other', { path: '/' });
            loginCallBak();
        }
        function getUserByToken(token){
            $.ajax({
                url: base_url+'user/basicinfo/'+token,
                contentType: "application/json",
                type: "GET",
                dataType: "json",
                timeout: 100000,
                success: function (data, status) {
                    loginSuccess(JSON.parse(data).id);
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 403) {
                        console.log(403);
                    } else {
                        console.log(status);
                    }
                }
            });
        }
        function login(phone,password){
            $.ajax({
                url: base_url+'user/login/'+phone+'/'+$.md5(password),
                contentType: "application/json",
                type: "GET",
                dataType: "json",
                timeout: 100000,
                success: function (datas, status) {
                    var data=JSON.parse(datas);
                    var errorEle=$('.login-box .error-log');
                    switch (data.state){
                        case 1:
                            loginSuccess(data.token);
                            $.cookie("userId", data.userId, { path: '/' });
                            break;
                        case 6:
                            errorEle.html('您输入的手机号码未注册');
                            validate.css($("#loginPhone"));
                            break;
                        case 10:
                            errorEle.html('您输入的密码错误');
                            validate.css($('#loginPassword'));
                            break;
                        default:
                            errorEle.html('您的密码错误次数太多,请在APP中修改密码!');
                            validate.css($('#loginPassword'));
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 403) {
                        console.log(403);
                    } else {
                        console.log(status);
                    }
                }
            });
        }
        function initQqLogin(){
            QC.Login({
                    //btnId：插入按钮的节点id，必选
                    btnId:"qqLoginBtn",
                    //用户需要确认的scope授权项，可选，默认all
                    scope:"all",
                    //按钮尺寸，可用值[A_XL| A_L| A_M| A_S|  B_M| B_S| C_S]，可选，默认B_S
                    size: "B_S"
                }, function(reqData, opts){//登录成功
                    //根据返回数据，更换按钮显示状态方法
                    console.log(reqData);
                    QC.Login.getMe(function(openId, accessToken){
                        console.log('QQOPENID:'+openId);
                        thirdparty(null,null,reqData.figureurl_qq_2,reqData.nickname,1,openId);
                        QC.Login.signOut();
                    });


                }
            );
        }
        function initWeibo(){
            WB2.anyWhere(function (W) {
                W.widget.connectButton({
                    id: "wb_connect_btn",
                    type: '3,2',
                    callback: {
                        login: function (o) { //登录后的回调函数
                            console.log(o);
                            thirdparty(null,null,o.avatar_hd, o.name ,3, o.id);
                            try{
                                document.getElementsByClassName('loginout')[0].click();

                            }catch(e){
                                console.log(e);
                            }
                        },
                        logout: function () { //退出后的回调函数
                        }
                    }
                });
            });
        }
        function initWechat(){}
        function thirdparty(deviceId,deviceSystem,headUrl,nickname,sourceType,uniqId){
            var json=JSON.stringify({ "deviceId":deviceId,"deviceSystem":deviceSystem,"headUrl":headUrl,"nickname":nickname,"sourceType":sourceType,"uniqId":uniqId});
            console.log(json);
            $.ajax({
                url:'../../laikanxing_v1/login/h5/thirdparty',
                contentType: "application/json",
                type: "POST",
                dataType: "json",
                timeout: 100000,
                data:json,
                success: function (data, status) {
                    console.log(data);
                    loginSuccess(data.token);
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
        $('.find-password').on('click',function(){
            $(this).html('请在来看星APP中找回密码!');
        });
    });
}


