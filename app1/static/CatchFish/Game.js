/**
 * Created with JetBrains WebStorm.
 * User: Predaking
 * Date: 14-1-3
 * Time: 下午9:28
 * To change this template use File | Settings | File Templates.
 */


Game.gameInstance = null;
Game.fishMgr = null;
Game.mapMgr = null;
Game.teamMgr = null;
Game.playerMgr = null;

Game.STATE_NULL = 0;
Game.STATE_ACTION = 1;
Game.STATE_DESTORY = 2;
Game.STATE_FISH_TO_COIN = 3;


function Game() {
    var s = this;
    base(s, LSprite, []);
    s.isEnable = false;
    Game.gameInstance = this;
};

p = {
    initGame: function () {
        var s = this;
        s.removeAllChild();

        s.mapMgr = new MapManager();
        s.mapMgr.init();
        s.addChild(s.mapMgr);
        Game.mapMgr = s.mapMgr;

        s.teamMgr = new TeamManager();
        s.teamMgr.init();
//        s.addChild(s.teamMgr);
        Game.teamMgr = s.teamMgr;

        s.fishMgr = new FishManager();
        s.fishMgr.init();
        s.addChild(s.fishMgr);
        Game.fishMgr = s.fishMgr;

        s.playerMgr = new PlayerManager();
        s.playerMgr.init();
        s.addChild(s.playerMgr);
        Game.playerMgr = s.playerMgr;

        s.isEnable = true;
    },
    updateGame: function () {
        var s = this;
        if (!s.isEnable) {
            return;
        }
//        s.mapMgr.update();
        s.teamMgr.update();
        s.fishMgr.update();
        s.playerMgr.update();
    },
    onMouseDown: function (event) {
        var s = this;
        //------------算出鱼的个数
//        var count = 0;
//        var lst = s.fishMgr.fishList;
//        for(var i = 0; i < lst.length; i++){
//            if(lst[i].state != Game.STATE_NULL){
//                count++;
//            }
//        }
//        trace(s.fishMgr.fishList.length+"    "+count);
        //--------------------

        s.playerMgr.fire();

    },
    onMouseUp: function (event) {
        var s = this;
    }
};
for (var k in p)Game.prototype[k] = p[k];

function MapManager() {
    base(this, RenderLayer, []);
}
p = {
    init: function () {
        var s = this;
        s.imgBack = new GameImage(imglist["back"]);
        s.addChild(s.imgBack);
    },

    update: function () {
    }

};
for (var k in p)MapManager.prototype[k] = p[k];

