//todo eric_gg

//字节跳动平台  也就是头条  一些通用的操作  包括菜单转发的显示和隐藏，登录，录屏，分享录屏，头条自带toast展示
var recorder = null;
var InitTtSdk = {

    login(){
        tt.login({
            success (res) {
                console.log(`login调用成功${res.code} ${res.anonymousCode}`);
            },
            fail (res) {
                console.log(`login调用失败`);
            }
        });
    },

    //显示当前页面的转发按钮  并登录
    showShareMenu(){
        tt.showShareMenu();
    },

    //隐藏菜单的分享按钮
    hideShareMenu(){
        tt.hideShareMenu();
    },

    //开始录屏  回调监听录屏开始和结束 
    startRecordScreen(time,callback){
        if(!recorder) recorder = tt.getGameRecorderManager();
        recorder.start({
            duration: time || 15,
        });

        recorder.onStart(res =>{
            this.showToast("开始录屏",2000);
            callback("start");
        });

        recorder.onStop(res =>{
            console.log(res.videoPath);
            this._videoPath = res.videoPath;
            this.showToast("录屏结束",2000);
            callback("end");
        })
    },

    //分享视频，传入分享视频的标题
    shareVideo(title,callback){
        if(!this._videoPath){
            console.log("未录制视频不能调用分享");
        }
        let pro = {
            channel:"video",
            videoPath:this._videoPath,
            title:title || ""
        }
        this.shareAppMessage(pro,callback);
    },

    //头条的展示toast方法   str：内容   time：显示时间
    showToast(str,time){
        tt.showToast({
            title: str,
            duration: time,
            success (res) {
                console.log(`${res}`);
            },
            fail (res) {
                console.log(`showToast调用失败`);
            }
        });
    },

    // 监听用户点击右上角菜单的“转发”按钮时触发的事件
    onShareAppMessage(title,url){
        // let url = "https://www.zywxgames.com/wx/taxiLife/sharePicture.jpg";
        tt.onShareAppMessage(function (res){
            console.log(res.channel);
            // do something
            return {
              title: title,
              imageUrl: url,
              success() {
                console.log('分享成功')
              },
              fail(e) {
                console.log('分享失败', e)
              }
            }
          });
    },
    /* channel   type :string   
    值	说明
    article	发布图文内容
    video	发布视频内容
    token	口令分享，生成一串特定的字符串文本，仅头条APP支持*/
    // tittle:标题  
    // 0分享失败  1分享成功   
    shareAppMessage(event,callback){
        let pro = event;
        if(!event) pro = {};
        tt.shareAppMessage({
            channel: pro.channel,
            title: pro.tittle　|| "测试标题",
            extra: {
              videoPath: pro.videoPath, // 可用录屏得到的视频地址
              videoTopics: ['跟我一起来玩玩吧']
            },
            success() {
              console.log('分享视频成功');
              callback(1)
            },
            fail(e) {
              console.log('分享视频失败',e);
              callback(0);
            }
          })
    },
};
module.exports = InitTtSdk;