

const {ccclass, property} = cc._decorator;

@ccclass
class Test extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    
    static outPut(){
        console.log("测试成功调用");
    }

    // update (dt) {}
}