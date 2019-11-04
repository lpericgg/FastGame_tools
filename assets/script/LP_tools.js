//todo eric_gg  工具类 一些通用的方法

var LP_tools = {

    //将数字转换为KMBQ 的方法 ，如果小于1000就返回传进来的值
    changeKMB(num){
        let str = "";
        let temp = num;
        let point = null;
        if (num<1000){
            return num;
        }
        if(num>=1000 && num<1000000){
            point =  (Math.floor(temp/10)) %100;
            temp = Math.floor(temp/1000);
            if (point %10 == 0) point = point/10;
            if(point == 0) {
                return temp  + "K";
            }   
            return temp + "." + point + "K";
        }
        if(num>=1000000 && num <1000000000){
            point = (Math.floor(temp/10000)) %100;
            temp = Math.floor(temp/1000000);
            if (point %10 == 0) point = point/10;
            if(point == 0){
                return temp  + "M";
            }
            return temp + "." + point + "M";
        }
        if(num>=1000000000 && num < 1000000000000){
            point = (Math.floor(temp/10000000)) %100;
            temp = Math.floor(temp/1000000000);
            if (point %10 == 0) point = point/10;
            if(point == 0) {
                return temp  + "B";
            }
            return temp + "." + point + "B";
        }
        if(num>=1000000000000 && num <1000000000000000){
            point = (Math.floor(temp/10000000000)) %100;
            temp = Math.floor(temp/1000000000000);
            if (point %10 == 0) point = point/10;
            if(point == 0){
                return temp  + "T";
            }
            return temp + "." + point + "T";
        }
        if(num>=1000000000000000){
            point = (Math.floor(temp/10000000000000)) %100;
            temp = Math.floor(temp/1000000000000000);
            if (point %10 == 0) point = point/10;
            if(point == 0){
                return temp  + "Q";
            }
            return temp + "." + point + "Q";
        }
    },
    //判断是不是切换了周   用于周签到   在同一周返回true
    whetherSameWeek(){
        var myDate = new Date();
        let nowWeek = myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
        if(nowWeek == 0) nowWeek = 7;
        nowWeek --;

        let nowTime = myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
        let hour = myDate.getHours(); //获取当前小时数(0-23)
        let minute = myDate.getMinutes(); //获取当前分钟数(0-59)
        let second = myDate.getSeconds(); //获取当前秒数(0-59)
        let milSecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
        let mondayDate = cc.sys.localStorage.getItem("MondayDate");//周一的时间  用来判断是否是新的一周

        //获取目前天的凌晨毫秒数
        let todayMidnight = nowTime - milSecond - second*1000 - minute*60*1000 - hour*60*60*1000;
        //获取当前天所在周的周一凌晨毫秒数
        let nowWeekMonday = todayMidnight - nowWeek*(24*60*60*1000);
        if(nowWeekMonday == mondayDate){  //同一周
            return true;
        }
        else{
            //同步
            cc.sys.localStorage.setItem("MondayDate",nowWeekMonday)
            return false;
        }
    },

    //显示  
    // update(){
    //     if(LP_tools.showAds(45)){
    //         this.btn_ad.active = true;
    //         cc.sys.localStorage.setItem("InterCloseTime",null);
    //     }
    // },
    showAds(time){
        if (cc.sys.localStorage.getItem("InterCloseTime")){
            let oldData = parseInt(cc.sys.localStorage.getItem("InterCloseTime"));
            var myDate = new Date(); 
            let newData = myDate.getTime();
            if ((parseInt(newData) - oldData)/1000 >= time){
               return true;  //通知android展示广告  在展示广告出加上 cc.sys.localStorage.setItem("InterCloseTime",null);
            }
            return false;
        }
        return false;
    },
    //一天领取多少次 返回今天是否还可领
    hideOrShowAds(time){
        var ADHaveStarTime = cc.sys.localStorage.getItem("ADHaveStarTime");  
        var GainADStarDate = cc.sys.localStorage.getItem("GainADStarDate");  
        var myDate = new Date();
        var nowDate = myDate.toLocaleDateString(); //获取当前日期
        //日期改变重置每天领取的次数
        if(nowDate != GainADStarDate){
            cc.sys.localStorage.setItem("ADHaveStarTime",0);
            ADHaveStarTime = 0;
            cc.sys.localStorage.setItem("GainADStarDate",nowDate);
        }
        if(ADHaveStarTime >= time){
            return false
        }
        else{
            // cc.log("展示广告");
            //在外部改变领取次数的值  有可能领取失败

            if (cc.sys.localStorage.getItem("InterCloseTime")){
                let oldData = parseInt(cc.sys.localStorage.getItem("InterCloseTime"));
                var myDate = new Date(); 
                let newData = myDate.getTime();
                if ((parseInt(newData) - oldData)/1000 <= 45){
                    return false;   //如果还在冷却时间内  就不显示
                }
            }
            return true;
        }
    },

    //屏蔽广告一段时间  跳过审核阶段  startTime 开始时间的毫秒数    skipTime跳过的小时数量
    // startTime:  实时输出当前的毫秒数  传进来即可
    // var myDate = new Date(); 
    // let newData = myDate.getTime();
    // console.log(newData); 
    skipSomeTime(startTime,skipTime){
        let myDate = new Date(); 
        let newData = myDate.getTime();
        return (parseInt(newData) - parseInt(startTime)) /(1000*3600) > skipTime;
    },
    
};
module.exports = LP_tools;