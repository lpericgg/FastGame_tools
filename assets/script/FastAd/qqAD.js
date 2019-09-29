//todo eric_gg
var bannerAd = null;
var videoAd = null;
var qqAD = {

    bannerId:null,
    videoId:null,

    createBanner(id,width){
        this.bannerId = id;
        const {
            windowWidth,
            windowHeight,
        } = qq.getSystemInfoSync();
        var targetBannerAdWidth = width || 300;
        
        if(bannerAd){
            bannerAd.destroy();
        }

        bannerAd = qq.createBannerAd({
            adUnitId:  this.bannerId,
            style: {
                width: targetBannerAdWidth,
                top: windowHeight - (targetBannerAdWidth / 16 * 9), // 根据系统约定尺寸计算出广告高度
                left:0,
                height:targetBannerAdWidth / 16 * 9,
            },
            testDemoType: 65,
        });
    
        bannerAd.show()
            .then(() => {
                console.log('广告显示成功');
            })
            .catch(err => {
                console.log('广告组件出现问题', err);
        });

        // 尺寸调整时会触发回调
        bannerAd.onResize(size => {
            console.log(size.width, size.height);
            bannerAd.style.top = windowHeight - bannerAd.style.realHeight;
            bannerAd.style.left = (windowWidth - bannerAd.style.realWidth)/2;
        });
    },

    hideBanner(){
        if(!bannerAd) return;
        bannerAd.hide();
    },

    //传入的str  会原样回调给结果
    //读取res.videoState的值  0视频加载失败  1 视频播放完成可以发放奖励  2 视频中途关闭  不发放奖励
    createVideo(id,callback,str){
        this.videoId = id;
        if(!videoAd) {
            videoAd = qq.createRewardedVideoAd({
                adUnitId: this.videoId
            });
        }

        videoAd.show()
        .then(() => {
                console.log('广告显示成功');
        })
        .catch(err => {
            console.log('广告组件出现问题', err);
        });

        let closeFunc = function(res){
            res.str = str;
            console.log(res);
            if (res.isEnded) {
                res.videoState = 1;
            }
            else{
                res.videoState = 2;
            }
            callback(res);
   
            videoAd.offClose(closeFunc);
        };

        videoAd.onClose(closeFunc);

        let errorFunc = function(err) {
            console.log(err.errCode,err.errMsg);
            let res = {};
            res.videoState = 0;
            res.str = str;
            callback(res);
            
            videoAd.offError(errorFunc);
        };

        videoAd.onError(errorFunc);
    },

    createInsert(){
        console.log("qq不支持插屏广告");
    },

    createNative(){
        console.log("qq不支持原生广告")
    },
};
module.exports = qqAD;