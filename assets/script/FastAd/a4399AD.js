//todo eric_gg

var a4399AD = {
    createBanner(){
        console.log("不支持");
    },  
    
    createInsert(){
        console.log("不支持");
    },  

    createNative(){
        console.log("不支持");
    },  

    createVideo(id,callback,str){
        let res = {};
        res.str = str;
        let result = h5api.canPlayAd(callback1);

        function callback1(data) {
            console.log("是否可播放广告： ", data.canPlayAd, '\n', "剩余次数： ", data.remain)
        }

        if (result) {
            console.log('有广告资源可播放')
            h5api.playAd(data => {
                console.log('代码:' + data.code + ',消息:' + data.message)
                if(data.code === 10000){
                    console.log('开始播放')
                } else if(data.code === 10001){
                    console.log('播放结束')
                    res.videoState = 1;
                    callback(res);
                } else {
                    console.log('广告异常')
                    res.videoState = 0;
                    callback(res);
                }
            });
        }
        else {
            console.log('没有广告资源可播放');
            res.videoState = 0;
            callback(res);
        }
    },  
};
module.exports = a4399AD;
