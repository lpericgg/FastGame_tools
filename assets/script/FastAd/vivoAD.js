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
        bannerAd.show();
        bannerAd.onError(function (err) {
            console.log("banner加载失败",err);
        });
    },

    showBanner(){
        if(!bannerAd){
            console.log("请先调用createBanner创建广告");
            return;
        }
        bannerAd.show();

        bannerAd.onLoad(function () {
            console.log('Banner广告加载成功');
            bannerAd.show();
        });
        bannerAd.onError(function (err) {
            console.log(err);
        });
    },

    hideBanner(){
        if(!bannerAd){
            console.log("请先调用createBanner创建广告");
            return;
        }
        bannerAd.hide()
    },

    createInsert(id){
        if(!this.allowShowAd())return; 
        this.insertId = id;
        interstitialAd = qg.createInterstitialAd({
            posId: this.insertId
        });

        interstitialAd.show();
        //失败重新拉取
        interstitialAd.show().catch(function (err) {
            interstitialAd.load().then(function () {
                interstitialAd.show()
            });
        });
   
        interstitialAd.onLoad(function () {
            console.log('插屏广告加载成功');
        },this);

        interstitialAd.show().then(function () {
            console.log('插屏广告显示');
        },this);

        interstitialAd.onClose(function(){

        },this);

        interstitialAd.onError(function (err) {
            console.log(err);
        },this);
    },

    //传入的str  会原样回调给结果
    //读取res.videoState的值  0视频加载失败  1 视频播放完成可以发放奖励  2 视频中途关闭  不发放奖励
    createVideo(id,callback){
        console.log("暂未支持激励视频，请不要调用");
        return;
        if(!this.allowShowAd())return;
        if(!qg.createRewardedVideoAd){
            callback("error");
            return;
        }
        this.videoId = id;
        if(!rewardedVideoAd){
            rewardedVideoAd = qg.createRewardedVideoAd({
                posId: this.videoId
            });
        }
        rewardedVideoAd.load().then(() => {
                console.log("激励视频广告加载成功");
                rewardedVideoAd.show().then(() => {
                    console.log("激励视频广告显示成功");
                }).catch(err => {
                    console.log("激励视频广告显示失败", err);
                });
            }).catch(err => {
                console.log("激励视频广告加载失败", err);
            });
       
    
        rewardedVideoAd.onError(err => {
                console.log("激励视频异常", err);
                let res = {};
                res.videoState = 0;
                res.str = str;
                res.err = err;
                callback(res);
            });

        rewardedVideoAd.onClose(res => {
            if (res && res.isEnded) {
                console.log("正常播放结束，可以下发游戏奖励");
                res.videoState = 1;
            } else {
                res.videoState = 2;
                console.log("播放中途退出，不下发游戏奖励");
            }
            callback(res);
        });
    },

    createNative(id,callback){
        console.log("暂未支持原生广告，请不要调用");
    },
};
module.exports = vivoAD;