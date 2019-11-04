
//todo eric_gg
var MainGameManager = cc.Class({
    statics: {
        instance: null
    },

    properties: {
        _view:null,

        _gameDirection:{
            default:null,
            type:cc.Enum
        },

        bagFull:false,
    },

    __ctor__(){
        this._gameDirection = cc.Enum({
            LEFT:cc.v2(-1,0),
            RIGHT:cc.v2(1,0),
            UP:cc.v2(0,1),
            DOWN:cc.v2(0,-1), 
        });
    },

    setView(view){
        this._view = view;
    },

    getView(){
        return this._view;
    },

});

MainGameManager.instance = new MainGameManager();
module.exports = MainGameManager;
