//todo eric_gg
var oppoAD = require("oppoAD");
var vivoAD = require("vivoAD");
var IdConfig = require("IdConfig");  //广告id配置文件

var nowChannel = null;  //当前渠道的名称
var NativeAdComponent = null;  //原生广告节点


var ADAdapter = {
    //初始化快游戏广告组件   
    //参数  channel：广告渠道   appid:后台值，  debug ：是否展示debug信息（可不填）  
    initFastAd(channel,appid,debug){
        this._channel = channel;
        this._AdFile = null;
        switch(channel){
            case "oppo":
                oppoAD.initAD(appid,debug);
                this._AdFile = oppoAD;
                nowChannel = "oppo";
            break;
            case "vivo":
                this._AdFile = vivoAD;
                nowChannel = "vivo";
            break;
            default:console.log("平台没有广告，不需要初始化");return;
        }
    },

    //是否初始化广告
    alreadyInit(){
        if(this._channel && this._AdFile){
            return true;
        }
        else{
            console.log("请先调用initFastAd初始化广告");
            return false;
        }
    },

    createBanner(){
        if(!this.alreadyInit()) return;
        let id = IdConfig[nowChannel + "_id"].bannerId;
        this._AdFile.createBanner(id);
    },

    createInsert(){
        if(!this.alreadyInit()) return;
        let id = IdConfig[nowChannel + "_id"].insertId;
        this._AdFile.createInsert(id);
    },
    
    //传入的str  会原样回调给结果   可不传
    //读取res.videoState的值  0视频加载失败  1 视频播放完成可以发放奖励  2 视频中途关闭  不发放奖励
    //读取res.err获得加载失败的错误信息
    createVideo(callback,str){
        if(!this.alreadyInit()) return;
        let id = IdConfig[nowChannel + "_id"].videoId;
        this._AdFile.createVideo(id,callback,str);
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
};
module.exports = ADAdapter;