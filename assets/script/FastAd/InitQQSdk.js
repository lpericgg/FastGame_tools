
//todo eric_gg
var InitQQSdk = {
    baseFunc(){
        //分享
        qq.updateShareMenu({
            withShareTicket: true
        });
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        });
        let url = "https://www.zywxgames.com/wx/jntm/jntm.jpg";
        qq.onShareAppMessage(() => ({
            title: '你真的会垃圾分类吗？？？',
            imageUrl: url // 图片 URL
        }));
    }
};
module.exports = InitQQSdk;
