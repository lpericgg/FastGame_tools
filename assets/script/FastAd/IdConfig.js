//todo eric_gg
// 广告id配置文件
// bannerId:插屏广告id,
// nativeId:原生广告id,
// videoId:视频广告id,
// insertId:插屏广告id
// appId:后台值，
const oppo_id = {
    bannerId:"94403",
    nativeId:"81917",
    videoId:"55801",
    insertId:"55800",
    appId:"30097503",
};
const vivo_id = {
    bannerId:"079ee95b892e4de6aa1097ac60fb0b07",
    nativeId:"not support",
    videoId:"1168e43ef7d3420d8dd830f783dba96d",
    insertId:"5213157ab22341b6a3465124005f33be",
    appId:30122840,
};

const tt_id = {
    bannerId:"8gjk5b78gk9799710b",
    nativeId:"not support",
    videoId:"1ji1j09ngi4h5c6r8a",
    insertId:"not support",
    appId:30122840,
};
//4399用不到id值  不用填  告知后台开广告就可以了  
const a4399_id = {
    bannerId:"not support",
    nativeId:"not support",
    videoId:"not support",
    insertId:"not support",
    appId:30122840,
};
const IdConfig = {oppo_id,vivo_id,tt_id,a4399_id};
module.exports = IdConfig;