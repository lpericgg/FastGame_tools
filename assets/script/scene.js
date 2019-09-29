//todo eric_gg
import Test from "./Test";
var ADAdapter = require("ADAdapter")
var NativeAdComponent = null;
cc.Class({
    extends: cc.Component,

    properties: {
        banner:cc.Node,
        video:cc.Node,
        insert:cc.Node,

        nextScene:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Test.outPut();
        // let channel = "vivo";
        let channel = "oppo";
        ADAdapter.initFastAd(channel,true);
        
        this.banner.on(cc.Node.EventType.TOUCH_END,function(){
            // ADAdapter.createBanner();
            // window.JavaJsBridge.showBanner();
            let pro = {scale:0.6,adType:1};
            ADAdapter.createNative(pro,"NativeAd/NativeAd");
        },this);

        this.video.on(cc.Node.EventType.TOUCH_END,function(){
            let str = "test";
            // window.JavaJsBridge.showVideo("testVideo");
            ADAdapter.createVideo(function(res){
                console.log(res.videoState);
                console.log(res.str);
                console.log(res.err);
            },str);
            // let pro = {scale:0.6,adType:2};
            // ADAdapter.createNative(pro,"NativeAd/NativeAd_1");
        },this);

        this.insert.on(cc.Node.EventType.TOUCH_END,function(){
            // ADAdapter.createInsert();
            // window.JavaJsBridge.showInsert("testInsert");
            let pro = {scale:0.4,adType:3};
            ADAdapter.createNative(pro,"NativeAd/NativeAd_2");
        
        },this);

        this.nextScene.on(cc.Node.EventType.TOUCH_END,function(){
            this.resetAd();
        },this);
    },

    onClickAddCoin(){
        let self = this;
        qg.hasShortcutInstalled({
            success: function(res) {
                // 判断图标未存在时，创建图标
                if(res == false){
                    qg.installShortcut({
                        success: function() {
                            // 执行用户创建图标奖励
                            console.log("请求创建桌面图标");
                            qg.installShortcut({
                                success: function(res){
                                    console.log("创建桌面图标成功");
                                },
                                fail: function(res){
                                    console.log("创建桌面图标失败",res);
                                },
                                complete:function(res){
                                    console.log("创建桌面图标完成",res);
                                },
                            });
                        },
                        fail: function(err) {console.log("请求创建桌面图标失败");},
                        complete: function() {console.log("请求创建桌面图标完成");}
                    })
                }
            },
            fail: function(err) {},
            complete: function() {}
        })
    },

    resetAd(){

    }

    // update (dt) {},
});
