//todo eric_gg
var oppoAD = require("oppoAD");
var vivoAD = require("vivoAD");
var ttAD = require("ttAD");
var a4399AD = require("a4399AD");
var qqAD = require("qqAD");
var IdConfig = require("IdConfig");  //广告id配置文件

var nowChannel = null;  //当前渠道的名称
var NativeAdComponent = null;  //原生广告节点


var ADAdapter = {
    //初始化快游戏广告组件   
    //参数  channel：广告渠道  debug ：是否展示debug信息（可不填）  
    initFastAd(channel,debug){
        this._AdFile = null;
        nowChannel = channel;
        if(IdConfig[nowChannel + "_id"])
            this._appId = IdConfig[nowChannel + "_id"].appId;
        switch(channel){
            case "oppo":
                this._AdFile = oppoAD;
                oppoAD.initAD(this._appId,debug);
            break;
            case "vivo":
                this._AdFile = vivoAD;
            break;
            case "tt":
                this._AdFile = ttAD;
            break;
            case "a4399":
                this._AdFile = ttAD;
            break;
            case "qq":
                this._AdFile = qqAD;
                nowChannel = "qq";
            break;
            default:console.log("平台没有广告，不需要初始化");return;
        }
    },

    //是否初始化广告
    alreadyInit(){
        if(nowChannel && this._AdFile){
            return true;
        }
        else{
            console.log("请先调用initFastAd初始化广告或检查传入渠道是否正确");
            return false;
        }
    },

    //头条可控width宽度   128 - 208   可不传   
    createBanner(width){
        if(!this.alreadyInit()) return;
        let id = IdConfig[nowChannel + "_id"].bannerId;
        try{
            this._AdFile.createBanner(id,width);
        }
        catch(err){
            console.log(err);
        }
    },

    createInsert(){
        if(!this.alreadyInit()) return;
        let id = IdConfig[nowChannel + "_id"].insertId;
        try{
            this._AdFile.createInsert(id);
        }
        catch(err){
            console.log(err);
        }
    },
    
    //传入的str  会原样回调给结果   可不传
    //读取res.videoState的值  0视频加载失败  1 视频播放完成可以发放奖励  2 视频中途关闭  不发放奖励   3没有视频广告了
    //读取res.err获得加载失败的错误信息
    createVideo(callback,str,adIndex){
        if(!this.alreadyInit()) return;
        if(!adIndex) adIndex = "";
        let id = IdConfig[nowChannel + "_id"]["videoId" + adIndex];
        try{
            this._AdFile.createVideo(id,callback,str);
        }
        catch(err){
            console.log(err);
        }
    },

    // pro广告节点的可修改参数   group://如果是camera多层次渲染  将此节点的group设置为最高层摄像机渲染   scale :节点缩放  默认为1
    createNative(pro){
        if(!this.alreadyInit()) return;
        let id = IdConfig[nowChannel + "_id"].nativeId;
        this._AdFile.createNative(id,function(res){
            //读取回调的res值  有值表示广告请求成功  无值表示加载失败
            if(res){
                if(pro)res.adScale = pro.scale || 1;
                console.log("res.adScale",res.adScale);
                let addNativeNode = function(){
                    if(NativeAdComponent.parent)  NativeAdComponent.parent = null;
                    cc.Canvas.instance.node.addChild(NativeAdComponent,999);    
                    NativeAdComponent.getComponent("NativeAd").initLayer(res);
                }
                if(!NativeAdComponent){
                    console.log("首次加载loadRes");
                    cc.loader.loadRes("NativeAd/NativeAd", function (err, prefab) {
                        NativeAdComponent = cc.instantiate(prefab);
                        if(pro &&　pro.group) NativeAdComponent.group = group;//如果是camera多层次渲染  将此节点的group设置为最高层摄像机渲染
                        addNativeNode();
                    });
                }
                else{
                    console.log("非首次加载直接拉取");
                    addNativeNode();
                }
            }
            else{
                console.log("原生广告加载失败");
            }
        });
    },

    ifHaveDeskIcon(callback){
        this._AdFile.ifHaveDeskIcon(callback);
    },

    ifCreateIconSuccess(callback){
        this._AdFile.ifCreateIconSuccess(callback);
    },
};
module.exports = ADAdapter;


// 刷新banner方法  供参考  先调用showBanner 在计时器中循环调用updatebanner
/*
this.showBannerAd();
this.schedule(function(){
    this.updateBanner();
},5);

showBannerAd(){
    var myDate = new Date(); 
    let newData = myDate.getTime();
    cc.sys.localStorage.setItem("AddBannerTime",newData);  
    // 展示banner
},

updateBanner(){
    var oldData =  cc.sys.localStorage.getItem("AddBannerTime") ||　0;  
    var myDate = new Date(); 
    let newData = myDate.getTime();
    if ((parseInt(newData) - oldData)/1000 >= 180){
        this.showBannerAd();
    }
},

    vivoBackGround(){
        let self = this;
        self.vivoVideoTime = false; //检测是否在播放视频   vivo进入视频需要关声音
        var hidef = function () {
            console.log('game enter background')
            cc.audioEngine.stopAllEffects();
            // qg.offHide(hidef)
        };
        qg.onHide(hidef);

        var showf = function () {
            console.log('game enter foreground')
            if(!self.vivoVideoTime){      //进入前台后如果是在播放视频   就开启音乐   否则关闭所有音乐  从新走背景音乐开关流程   避免之前音乐未释放播出的声音
                cc.audioEngine.stopAllEffects();
                cc.audioEngine.playMusic(self.bgm,true);
                self.updateMusicState();
            }
            // qg.offShow(showf);
        }.bind(self);
        qg.onShow(showf);
    },

    //播放视频回调后调用   修改参数  从新走背景音乐开关流程
    vivoVideoFun(){
        let self = this;
        self.vivoVideoTime = false;
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playMusic(self.bgm,true);
        self.updateMusicState();
    },

*/