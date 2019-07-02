//todo eric_gg
var bannerAd = null;
var videoAd = null;
var ttAD = {

    bannerId:null,
    videoId:null,
    createBanner(id,width){
        this.bannerId = id;
        const {
            windowWidth,
            windowHeight,
        } = tt.getSystemInfoSync();
        var targetBannerAdWidth = width || 128;
        
        if(bannerAd){
            bannerAd.destroy();
        }
        // 创建一个居于屏幕底部正中的广告
        bannerAd = tt.createBannerAd({
            adUnitId:  this.bannerId,
            style: {
                width: targetBannerAdWidth,
                top: windowHeight - (targetBannerAdWidth / 16 * 9), // 根据系统约定尺寸计算出广告高度
            },
        });
        // 也可以手动修改属性以调整广告尺寸
        bannerAd.style.left = (windowWidth - targetBannerAdWidth) / 2;   //移动至屏幕中间   默认靠左

        bannerAd.onLoad(function (){
            bannerAd.show()
              .then(() => {
                  console.log('广告显示成功');
              })
              .catch(err => {
                  console.log('广告组件出现问题', err);
              })
        });
        
        // 尺寸调整时会触发回调
        // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
        bannerAd.onResize(size => {
            console.log(size.width, size.height);
              // 如果一开始设置的 banner 宽度超过了系统限制，可以在此处加以调整
            if (targetBannerAdWidth != size.width) {
                targetBannerAdWidth = size.width;
                bannerAd.style.top = windowHeight - (res.width / 16 * 9);
                bannerAd.style.left = (windowWidth - res.width) / 2;
            }
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
            videoAd = tt.createRewardedVideoAd({
                adUnitId: this.videoId
            });
        }

        videoAd.show()
        .then(() => {
                console.log('广告显示成功');
        })
        .catch(err => {
            console.log('广告组件出现问题', err);
            // 可以手动加载一次
            videoAd.load()
                .then(() => {
                    console.log('手动加载成功');
            });
        });

        videoAd.onClose(res => {
            res.str = str;
            if (res.isEnded) {
                res.videoState = 1;
            }
            else{
                res.videoState = 2;
            }
            callback(res);
        });

        videoAd.onError(function(err) {
            console.log(err.errCode,err.errMsg);
            let res = {};
            res.videoState = 0;
            res.str = str;
            callback(res);
        });
    },

    createInsert(){
        console.log("头条不支持插屏广告");
    },

    createNative(){
        console.log("头条不支持原生广告")
    },
};
module.exports = ttAD;