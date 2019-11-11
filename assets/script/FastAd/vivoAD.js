//todo eric_gg
var MainGameManager = require("MainGameManager");
//加载广告成功回调1  失败回调0  错误回调2
var bannerAd = null;
var interstitialAd = null;
var rewardedVideoAd = null;
var nativeAd = null;
var vivoAD = {

    bannerId:1,
    insertId:2,
    videoId:3,
    nativeId:4,
    ifShowAD:true,

    //判断平台是否支持广告
    allowShowAd(){
        if (qg.getSystemInfoSync().platformVersionCode < 1031) {
            console.log("不支持广告");
            this.ifShowAD = false;
        }
        else {
            console.log("支持广告");
            this.ifShowAD = true;
        }
        return  this.ifShowAD;
    },

    createBanner(id){
        if(!this.allowShowAd())   return; 
        //style内无需设置任何字段，banner会在屏幕底部居中显示，style具体属性后续版本会开放
        //不设置style默认在顶部显示，布局起始位置为屏幕左上角
        this.bannerId = id;
        if(bannerAd) bannerAd.destroy();
        bannerAd = qg.createBannerAd({
            posId: this.bannerId,
            style: {}
        });
        if(bannerAd)
            bannerAd.show();
        bannerAd.onError(function (err) {
            console.log("banner加载失败",err);
        });
    },

    hideBanner(){
        if(!bannerAd){
            console.log("请先调用createBanner创建广告");
            return;
        }
        var adShow = bannerAd && bannerAd.hide()
    },

    createInsert(id){
        if(!this.allowShowAd())return; 
        this.insertId = id;
        interstitialAd = qg.createInterstitialAd({
            posId: this.insertId
        });

        var adShow = interstitialAd && interstitialAd.show();
        // //失败重新拉取
        // interstitialAd.show().catch(function (err) {
        //     interstitialAd.load().then(function () {
        //         interstitialAd.show()
        //     });
        // });
   
        // interstitialAd.onLoad(function () {
        //     console.log('插屏广告加载成功');
        // },this);

        // interstitialAd.show().then(function () {
        //     console.log('插屏广告显示');
        // },this);

        // interstitialAd.onClose(function(){

        // },this);

        // interstitialAd.onError(function (err) {
        //     console.log(err);
        // },this);
    },

    //传入的str  会原样回调给结果
    //读取res.videoState的值  0视频加载失败  1 视频播放完成可以发放奖励  2 视频中途关闭  不发放奖励
    createVideo(id,callback,str){
        // MainGameManager.instance.getView().vivoVideoTime = true;
        // cc.audioEngine.setMusicVolume(0);
        if(qg.getSystemInfoSync().platformVersionCode < 1041 ||　!qg.createRewardedVideoAd){
            console.log("不支持激励视频");
            let res = {};
            res.videoState = 0;
            res.str = str;
            res.err = err;
            callback(res);
            return;
        }
        this.videoId = id;
        if(!rewardedVideoAd){
            rewardedVideoAd = qg.createRewardedVideoAd({
                posId: this.videoId
            });
        }
        let errorFun = function(err){
            console.log("激励视频异常", err);
            let res = {};
            res.videoState = 0;
            res.str = str;
            res.err = err;
            callback(res);
            rewardedVideoAd.offError(errorFun);
        };
        rewardedVideoAd.onError(errorFun);

        let closeFun = function(res){
            res.str = str;
            if (res && res.isEnded) {
                console.log("正常播放结束，可以下发游戏奖励");
                res.videoState = 1;
            } else {
                res.videoState = 2;
                console.log("播放中途退出，不下发游戏奖励");
            }
            callback(res);
            rewardedVideoAd.offClose(closeFun);
        }

        rewardedVideoAd.onClose(closeFun);

        let faildeFun = function(){
            let res = {};
            res.videoState = 0;
            res.str = str;
            callback(res);
        };
        var adShow = rewardedVideoAd && rewardedVideoAd.load();
        adShow && adShow.then(() => {
                console.log("激励视频广告加载成功");
                rewardedVideoAd.show().then(() => {
                    console.log("激励视频广告显示成功");
                }).catch(err => {
                    console.log("激励视频广告显示失败", err);
                    faildeFun();
                });
            }).catch(err => {
                console.log("激励视频广告加载失败", err);
                faildeFun();
            });
       
    },

    createNative(id,callback){
        if(!this.allowShowAd())return; 
        this.nativeId = id;
        nativeAd = qg.createNativeAd({'posId': this.nativeId})
        nativeAd.load();
        let onLoadFun = function(res){
            console.log("原生广告加载成功");
            if (res && res.adList){
                for(let i in res.adList){
                    console.log(i,res.adList[i]);
                }
                console.log("上报广告成功",res.adList[0].adId.toString());
                nativeAd.reportAdShow({ 
                    adId: res.adList[0].adId, 
                });
                nativeAd.offLoad(onLoadFun);
                res.adList[0].iconUrlList = res.adList[0].icon;
                callback(res);
            }

            nativeAd.offLoad(onLoadFun);
        };
        nativeAd.onLoad(onLoadFun);

        let errorFun = function(err){
            console.log("原生广告加载失败");
            for(let i in err){
                console.log(i,err[i]);
            }
            nativeAd.offError(errorFun);
            callback();
        }
        nativeAd.onError(errorFun);

    },

    clickNativeAd(id){
        nativeAd.reportAdClick({
            adId: id.toString()
        });
    },

    ifHaveDeskIcon(callback){
        let fun1 = function(res){
            callback(res);
        };
        qg.hasShortcutInstalled({
            success: function(status) {
              if(status) {
                console.log('已创建')
                fun1(1);
              }else{
                console.log('未创建')
                fun1(0);
              }
            }
        });
    },

    ifCreateIconSuccess(callback){
        let fun1 = function(res){
            callback(res);
        };
        qg.installShortcut({
            success: function() {
                console.log('创建成功');
                fun1(1);
            },
            fail:function(){
                console.log('创建失败');
                fun1(0);
            },
        });
    },
};
module.exports = vivoAD;