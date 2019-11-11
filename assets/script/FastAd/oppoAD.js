// todo eric_Gg
var bannerAd = null;
var insertAd = null;
var videoAd = null;
var nativeAd = null;
var initAdSuccess = false;
var oppoAD = {
    
    appId:0,
    bannerId:1,
    insertId:2,
    videoId:3,
    nativeId:4,
    initAD(id,debug){
        if(!id) {
          console.log("传入应用Id");
          return;
        }
        this.appId = id;
        qg.initAdService({
            appId: this.appId,
            success: function(res) {
              console.log("success");
              initAdSuccess = true;
            },
            fail: function(res) {
              console.log("fail:" + res.code + res.msg);
            },
            complete: function(res) {
              console.log("complete");
            }
          })
          if(!debug)debug = false;
          qg.setEnableDebug({
            enableDebug: debug, // true 为打开，false 为关闭
            success: function () {
                // 以下语句将会在 vConsole 面板输出 
                console.log("test consol log");
                console.info("test console info");
                console.warn("test consol warn");
                console.debug("test consol debug");
                console.error("test consol error");
            },
            complete: function () {
            },
            fail: function () {
            }
          });
    },
    
    createBanner(id){
        if(!initAdSuccess){
            console.log("请先调用initAD 初始化广告");
            return;
        }
        this.bannerId = id;
        bannerAd = qg.createBannerAd({
          posId: this.bannerId
        });
        bannerAd.show();
    },

    hideBanner(){
      if(!bannerAd){
        console.log("请先调用createBanner");
        return;
      }
      bannerAd.destroy();
    },

    createInsert(id){
        if(!initAdSuccess){
          console.log("请先调用initAD 初始化广告");
          return;
        }
        this.insertId = id;
        if(insertAd) insertAd.destroy();

        insertAd = qg.createInsertAd({ 
          posId: this.insertId 
        });

        insertAd.load();
        insertAd.onLoad(function() {
          console.log("插屏广告加载成功");
          insertAd.show();
        });

        insertAd.onShow(function() {
          console.log("插屏广告展示");
        })

        insertAd.onError(function(err) {
          console.log("插屏广告加载失败");
          console.log(err);
        });
    },

    //传入的str  会原样回调给结果
    //读取res.videoState的值  0视频加载失败  1 视频播放完成可以发放奖励  2 视频中途关闭  不发放奖励
    createVideo(id,callback,str){
        if(!initAdSuccess){
          console.log("请先调用initAD 初始化广告");
          return;
        }
        this.videoId = id;
        videoAd =  qg.createRewardedVideoAd({ 
          posId: this.videoId 
        });

        videoAd.load();
        videoAd.onLoad(function() {
          console.log("激励视频加载成功");
          videoAd.show();
        });

        videoAd.onClose((res) =>{
          res.str = str;
          if(res.isEnded){
              res.videoState = 1;
              console.log('激励视频广告完成，发放奖励')
          }else{
              res.videoState = 2;
              console.log('激励视频广告取消关闭，不发放奖励')
          }
          callback(res);
          videoAd.destroy();
        });

        videoAd.onError(function(err) {
          console.log(err);
          for (let i in err){
            console.log(i,err[i]);
          }
          let res = {};
          res.videoState = 0;
          res.str = str;
          callback(res);
        });
    },

    createNative(id,callback){
      if(!initAdSuccess){
        console.log("请先调用initAD 初始化广告");
        return;
      }
      this.nativeId = id;
      if(nativeAd) nativeAd.destroy();
      nativeAd = qg.createNativeAd({ 
        posId: this.nativeId 
      });

      nativeAd.load();
      nativeAd.onLoad(function(res) {
        console.log("插屏广告加载",res.adList[0])
        //上报广告曝光
        nativeAd.reportAdShow({
          adId: res.adList[0].adId
        });
        callback(res);
      });

      nativeAd.onError(function(){
        callback();
      });
    },

    clickNativeAd(id){
        nativeAd.reportAdClick({
          adId: id
        });
    },

    ifHaveDeskIcon(callback){
      let fun1 = function(res){
          callback(res);
      };
      qg.hasShortcutInstalled({
        success: function(res) {
            // 判断图标未存在时，创建图标
            if(res == false){
              console.log('未创建')
              fun1(0);
            }
            else{
              console.log('已创建')
              fun1(1);
            }
        },
        fail: function(err) {},
        complete: function() {}
    })
  },

  ifCreateIconSuccess(callback){
      let fun1 = function(res){
          callback(res);
      };
      qg.installShortcut({
        success: function() {
            // 执行用户创建图标奖励
            console.log('创建成功');
            fun1(1);
        },
        fail: function(err) {
          console.log('创建失败');
          fun1(0);
        },
        complete: function() {}
    })
  },
};
module.exports = oppoAD;