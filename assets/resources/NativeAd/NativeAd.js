//todo eric_gg
var oppoAD = require("oppoAD");
var NativeAd = cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    initComponent(){
        let self = this;
        self.btn_close = cc.find("btn_close",self.node);
        self.title = cc.find("title",self.node);

        self.picture_icon = cc.find("picture_icon",self.node).getComponent(cc.Sprite);
        self.picture_ad = cc.find("picture_ad",self.node).getComponent(cc.Sprite);
        self.ad_desc = cc.find("ad_desc",self.node).getComponent(cc.Label);
        self.btn_clickAd = cc.find("btn_clickAd",self.node);  
        self.clickBtnTxt = cc.find("btn_clickAd/clickBtnTxt",self.node).getComponent(cc.Label);
        self.btn_clickAd.active = false;  //隐藏点击安装

        self.bg_click = cc.find("bg_click",self.node);//
        self.bg_click_2 = cc.find("bg_2/bg_click_2",self.node);

        self.bg_2 = cc.find("bg_2",self.node);
    },

    showADType(adType){
        let self = this;
        switch(adType){
            case 1:
                this.node.color = cc.Color.WHITE;
                self.bg_2.active = false;
                self.title.setPosition(cc.v2(0,-90));
                self.title.getComponent(cc.Label).fontSize = 45;
                self.btn_close.scale = 0.7;
                self.btn_close.setPosition(cc.v2(317,284));
                break;
            case 2:
                this.node.color = cc.Color.BLUE;
                self.bg_2.active = false;
                self.title.setPosition(cc.v2(0,-90));
                self.title.getComponent(cc.Label).fontSize = 45;
                self.btn_close.scale = 0.7;
                self.btn_close.setPosition(cc.v2(317,284));
                break;
            case 3:
                self.bg_2.active = true;
                self.title.setPosition(cc.v2(0,468));
                self.title.getComponent(cc.Label).fontSize = 70;
                self.btn_close.scale = 1.3;
                self.btn_close.setPosition(cc.v2(-433,562));
                break;
            default:break;
        }
    },

    onEnable(){
        let self = this;
        self.initComponent();
        self.btn_close.on(cc.Node.EventType.TOUCH_END,self.onClickClose,self);
        self.bg_click.on(cc.Node.EventType.TOUCH_END,self.onClickAd,self);
        self.bg_click_2.on(cc.Node.EventType.TOUCH_END,self.onClickAd,self);

        // var iconUrl = "http://adsfs.oppomobile.com/union/adlogo/o_1512387525231.png";
        // var iconUrl = "http://chuantu.xyz/t6/702/1558945224x992245975.png";
        // cc.loader.load(iconUrl, function (err, texture) {
        //     // Use texture to create sprite frame
        //     console.log(err,texture);
        //     let newFrame = new cc.SpriteFrame(texture);
        //     self.picture_icon.spriteFrame = newFrame;
        // });
    },

    onDisable(){
        let self = this;
        self.btn_close.off(cc.Node.EventType.TOUCH_END,self.onClickClose,self);
        self.bg_click.on(cc.Node.EventType.TOUCH_END,self.onClickAd,self);
        self.bg_click_2.off(cc.Node.EventType.TOUCH_END,self.onClickAd,self);
    },

    onClickAd(){
        oppoAD.clickNativeAd(this.adId);
        this.onClickClose();
    },

    onClickClose(){
        this.node.parent = null;
    },

    //如果界面过大  传入res.adScale值
    initLayer(res){
        let self = this;
        this.showADType(res.adType);
        // adId	string	广告标识，用来上报曝光与点击
        // title	string	广告标题
        // desc	string	广告描述
        // iconUrlList	Array	推广应用的Icon图标
        // imgUrlList	Array	广告图片
        // logoUrl	string	“广告”标签图片
        // clickBtnTxt	string	点击按钮文本描述
        // creativeType	number	获取广告类型，取值说明：0：无 1：纯文字 2：图片 3：图文混合 4：视频
        // interactionType获取广告点击之后的交互类型，取值说明： 0：无 1：浏览类 2：下载类 3：浏览器（下载中间页广告） 4：打开应用首页 5：打开应用详情页

        console.log(res.adList[0].adId);
        console.log(res.adList[0].title);
        console.log(res.adList[0].desc);
        console.log(res.adList[0].iconUrlList);
        console.log(res.adList[0].imgUrlList);
        console.log(res.adList[0].logoUrl);
        console.log(res.adList[0].clickBtnTxt);
        console.log(res.adList[0].creativeType);
        console.log(res.adList[0].interactionType);

        if(res.adScale) self.node.scale = res.adScale;

        self.adId = res.adList[0].adId;

        self.title.getComponent(cc.Label).string = res.adList[0].title;
        self.ad_desc.string = res.adList[0].desc;
        self.clickBtnTxt.string = res.adList[0].clickBtnTxt;

        self.picture_icon.spriteFrame = null;
        self.picture_ad.spriteFrame = null;

        var iconUrl = res.adList[0].iconUrlList;
        iconUrl = iconUrl.toString();
        cc.loader.load(iconUrl, function (err, texture) {
            let newFrame = new cc.SpriteFrame(texture);
            self.picture_icon.spriteFrame = newFrame;
        });      
    },

    // update (dt) {},
});
