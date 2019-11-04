//todo eric_gg
var MainGameManager = require("MainGameManager");
var GameConfigManager = require("GameConfigManager");
const nowDevice = GameConfigManager.getNowDevice();
var ADAdapter = require("ADAdapter");
var LP_tools = require("LP_tools");
var JavaJsBridge = {

    adComponent:true,  //广告节点的显示与否

    setAdComponent(value){
        this.adComponent = value;
    },

    shakeShort(){
        if(nowDevice =="android"){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shakeShort", "(Ljava/lang/String;)V","eric_gg");
        }
        if(nowDevice =="weChat"){
            wx.vibrateLong(function(){}); 
            // wx.vibrateShort(function(){});  //手机 震动
        }
    },

    onClickAndroidBack(){
        MainGameManager.instance.getView().node.emit("CLICK_ANDROID_BACK");
    },

    requestQuickGame(){
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "requestQuickGame", "(Ljava/lang/String;)V","eric_gg");
    },

    showInsert(str){
        if(nowDevice =="android"){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showInsert", "(Ljava/lang/String;)V",str);
        }
        else{
            let index = Math.random();
            if(nowDevice =="oppo" && index > 0.2){
                ADAdapter.createNative();
            }
            else{
                ADAdapter.createInsert();
            }
        }
    },

    showVideo(str){
        if(nowDevice =="debug"){
            this.showInspireADCallBack(str,1);
            return;
        }
        MainGameManager.instance.getView().node.emit("SHOW_TIPS",{str:"观看视频广告获得奖励"});
        if(nowDevice =="android"){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showVideo", "(Ljava/lang/String;)V",str);
        }
        else {
            let adIndex = "";
            // if(str == "FromAchievement") adIndex = 2;
            // if(str == "FromHitPass_9" || str == "FromPass_9") adIndex = 3;
            ADAdapter.createVideo(function(res){
                switch(res.videoState){
                    case 0: this.showInspireADCallBack(res.str,0);
                        break;
                    case 1: this.showInspireADCallBack(res.str,1);
                        break;
                    case 2: this.showInspireADCallBack(res.str,2);
                        break;
                    default:break;
                }
            }.bind(this),str,adIndex);
        }
    },

    showBanner(){
        if(nowDevice =="android"){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showBanner", "(Ljava/lang/String;)V","eric_gg");
        }
        else {
            if(nowDevice == "tt"){
                if(LP_tools.skipSomeTime(1567478728889,48)){
                    ADAdapter.createBanner();
                    console.log("超过预设时间弹广告");
                }
                else{
                    console.log("no超过预设时间no弹广告");
                }
            }
            else
                ADAdapter.createBanner();
        }
    },

    hideBanner(){
        ADAdapter.hideBanner();
    },

    //state  0加载失败  1成功发奖  2未完成提前关闭
    showInspireADCallBack(str,state){
        switch(state){
            case 0:
                setTimeout(function(){
                    MainGameManager.instance.getView().node.emit("SHOW_TIPS",{str:"视频加载失败，请稍后再试"});
                },500);
                break;
            case 1:
                setTimeout(function(){
                    let eventStr = "AD_CALLBACK_" + str;
                    MainGameManager.instance.getView().node.emit(eventStr,{videoState:state});
                }.bind(this),500);
                break;
            case 2:
                setTimeout(function(){
                    MainGameManager.instance.getView().node.emit("SHOW_TIPS",{str:"未完整观看视频不能获得奖励"});
                },500);
                break;
            default:break;
        }
    },
};
window.JavaJsBridge = JavaJsBridge;
module.exports = JavaJsBridge;