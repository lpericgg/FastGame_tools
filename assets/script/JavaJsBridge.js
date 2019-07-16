//todo eric_gg
var JavaJsBridge = {
    showAdComponent:true,
    InspireForVideo:true,

    setAdComponentActive(boo){
        this.showAdComponent = boo;
    },
    //激励为插屏  还是视频   true视频   false 插屏
    setInspireForVideo(boo){
        this.InspireForVideo = boo;
    },

    showBanner(){
        if(GameConfigManager.getNowDevice() =="android"){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showBanner", "(Ljava/lang/String;)V","eric_gg");
        }
    },  

    showInsert(str){
        if(GameConfigManager.getNowDevice() =="android"){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showInsert", "(Ljava/lang/String;)V",str);
        }
    },

    showVideo(str){
        if(GameConfigManager.getNowDevice() =="android"){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showVideo", "(Ljava/lang/String;)V",str);
        }
    },
    //0 加载失败  1 加载成功发奖  2 未点击或提前关闭
    onInsertShow(str,state){
        switch(str){
            case "LoginAward":
                MainGameManager.instance.getView().node.emit("LoginAward_ad",{state:state});
            break;
            case "SkinAward":
                MainGameManager.instance.getView().node.emit("SkinAward_ad",{state:state});
            break;
            case "HintAward":
                MainGameManager.instance.getView().node.emit("HintAward_ad",{state:state});
            break;
            default:break;
        }
    }, 
    
    onVideoShow(str,state){
        switch(str){
            case "LoginAward":
            MainGameManager.instance.getView().node.emit("LoginAward_ad",{state:state});
            break;
            case "SkinAward":
            MainGameManager.instance.getView().node.emit("SkinAward_ad",{state:state});
            break;
            case "HintAward":
            MainGameManager.instance.getView().node.emit("HintAward_ad",{state:state});
            break;
            default:break;
        }
    },
};

window.JavaJsBridge = JavaJsBridge;