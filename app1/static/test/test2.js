(function () {
    if (LGlobal.canTouch) {
        LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
        LSystem.screen(LStage.FULL_SCREEN);
    }

    window.onload = function () {
        LInit(30, "legend", 720, 480, main,LEvent.INIT);
    };
    var backLayer;
    var imgList = {};
    var imgData = new Array({name: "img0", path: "/static/test/img0.jpg"},{name: "p3", path: "/static/test/p3.png"},{name: "p2", path: "/static/test/p2.png"},{name: "n1", path: "/static/test/n1.png"});
    var circles=[];
    function main() {
        LGlobal.setDebug(true);
        //LGlobal.box2d = new LBox2d([0,0]);
        //LGlobal.box2d = new LBox2d();
        LLoadManage.load(
            imgData,
            null,
            function (result) {
                imgList = result;
                init();
            }
        );
    }
    function init() {
        LGlobal.box2d = new LBox2d([0,1]);//创建Box2d对象
        //addChild(new FPS());
        backLayer=new Main();
        addChild(backLayer);
    }

    function Main(){
        var me=this;
        base(me,LSprite,[]);
        me.sceneWidth = 720;
        me.sceneHeight = 480;
        me.cannon();
        me.kuang();
        me.addEventListener(LEvent.ENTER_FRAME,me.loop);
    }

    Main.prototype.cannon=function(){
        var me=this;
        var line=new LSprite();
        line.graphics.drawImage()
        me.addChild(line);
    }

    Main.prototype.loop=function(e){
        var me = e.target;
        var x = LGlobal.offsetX;
        var y = LGlobal.offsetY;
    }

    Main.prototype.kuang=function(){
        var me=this;
        var wallSize = 10;
        var wallList = [
            //左边
            [wallSize*0.5, me.sceneHeight*0.5, wallSize, me.sceneHeight],
            //右边
            [me.sceneWidth-wallSize*0.5, me.sceneHeight*0.5, wallSize, me.sceneHeight],
            //上面
            [me.sceneWidth*0.5, wallSize*0.5, me.sceneWidth, wallSize],
            //下面
            [me.sceneWidth*0.5, me.sceneHeight-wallSize*0.5, me.sceneWidth, wallSize],
        ];
        for(var key in wallList){
            var item = wallList[key];
            var wallLayer = new LSprite();
            wallLayer.x = item[0];
            wallLayer.y = item[1];
            wallLayer.addBodyPolygon(item[2],item[3],0);
            me.addChild(wallLayer);
        }
    }

})();