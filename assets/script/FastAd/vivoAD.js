//todo eric_gg

//加载广告成功回调1  失败回调0  错误回调2
var bannerAd = null;
var interstitialAd = null;
var rewardedVideoAd = null;
var vivoAD = {

    bannerId:1,
    insertId:2,
    videoId:3,
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
        var adShow = bannerAd && bannerAd.show();
        bannerAd.onError(function (err) {
            console.log("banner加载失败",err);
        });
    },

    hideBanner(){
        if(!bannerAd){
            console.log("请先调用createBanner创建广告");
            return;
        }
        var adHide = bannerAd && bannerAd.hide()
    },

    createInsert(id){
        if(!this.allowShowAd())return; 
        this.insertId = id;
        interstitialAd = qg.createInterstitialAd({
            posId: this.insertId
        });

        var adShow = interstitialAd && interstitialAd.show();

        var func = function (err) {
            // do something
            console.log("插屏广告加载失败",err);
            // 取消监听
            interstitialAd.offError(func);
        };
        // 开始监听
        interstitialAd.onError(func);
    },

    //传入的str  会原样回调给结果
    //读取res.videoState的值  0视频加载失败  1 视频播放完成可以发放奖励  2 视频中途关闭  不发放奖励
    createVideo(id,callback,str){
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
        var adShow = rewardedVideoAd && rewardedVideoAd.load();
        adShow && adShow.then(() => {
                console.log("激励视频广告加载成功");
                rewardedVideoAd.show().then(() => {
                    console.log("激励视频广告显示成功");
                }).catch(err => {
                    console.log("激励视频广告显示失败", err);
                });
            }).catch(err => {
                console.log("激励视频广告加载失败", err);
        });
       
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
            // MainGameManager.instance.getView().node.emit("UPDATE_MUSIC_STATE");
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
    },

    createNative(id,callback){
        console.log("暂未支持原生广告，请不要调用");
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