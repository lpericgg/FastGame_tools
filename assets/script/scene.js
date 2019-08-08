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

    resetAd(){

    }

    // update (dt) {},
});
