(function () {
    if (LGlobal.canTouch) {
        LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
        LSystem.screen(LStage.FULL_SCREEN);
    }

    window.onload = function () {
        LInit(30, "legend", 800, 500, main,LEvent.INIT);
    };
    var backLayer;//背景层
    var imgList = {};
    var imgData = new Array({name: "n1", path: "/static/test/n1.png"});
    var circles=[];
    function main() {
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
        LGlobal.setDebug(true);
        LGlobal.box2d = new LBox2d();//创建Box2d对象
        backLayer=new Main();
        addChild(backLayer);
        backLayer.init();

        var adf = new LSprite();
        adf.x = 100;
        adf.y = 50;
        adf.addBodyPolygon(100,10,1,5);
        adf.addEventListener(LMouseEvent.MOUSE_DOWN,function(e){
            console.log(e);
        });
        backLayer.addChild(adf);
    }
    function Main(){
        var me=this;
        base(me,LSprite,[]);
        me.sceneWidth = 1500;
        me.sceneHeight = LStage.height;
    }
    Main.prototype.init=function(){
        var me=this;
        me.kuang();
        me.cir= new Circle(0,460);
        me.addEventListener(LEvent.ENTER_FRAME,me.loop);
    }

    Main.prototype.loop = function(event){
        var me = event.target;

        var bo = me.cir.mainBody.GetUserData();
        me.x = LStage.width*0.5 - (bo.x + bo.getWidth());
        me.y = LStage.height*0.5 - (bo.y + bo.getHeight());
        if(me.x > 0){
            me.x = 0;
        }else if(me.x < LStage.width - me.sceneWidth){
            me.x = LStage.width - me.sceneWidth;
        }
        if(me.y > 0){
            me.y = 0;
        }else if(me.y < LStage.height - me.sceneHeight){
            me.y = LStage.height - me.sceneHeight;
        }
        LStage.box2d.synchronous();
    };

    function Circle(x,y){
        var me=this;
        base(me,LSprite,[]);
        me.x=x;
        me.y=y;
        me.bodyList=new Array();
        me.moveVec=new LStage.box2d.b2Vec2();//左右力度向量
        me.tcVec = new LStage.box2d.b2Vec2();//拉压力度向量

        LEvent.addEventListener(window,LKeyboardEvent.KEY_DOWN, function (e) {
            me.keydown(e,me);
        });
        LEvent.addEventListener(window,LKeyboardEvent.KEY_UP, function (e) {
            me.keyup(e,me);
        });
        me.init();
    }

    Circle.prototype.init= function(){
        var me=this;

        var wheelAObj=me.newCircle("n1",20,-30);
        backLayer.addChild(wheelAObj);
        me.bodyList.push(wheelAObj);

        var wheelBObj=me.newCircle("n1",130,-30);
        backLayer.addChild(wheelBObj);
        me.bodyList.push(wheelBObj);

        var frameAObj = new LSprite();
        frameAObj.x = me.x+100;
        frameAObj.y = me.y-50;
        frameAObj.addBodyPolygon(100,10,1,5);
        backLayer.addChild(frameAObj);
        me.bodyList.push(frameAObj);

        var frameBObj = new LSprite();
        frameBObj.x = me.x+50;
        frameBObj.y = me.y-40;
        frameBObj.addBodyPolygon(10,50,1,2);
        backLayer.addChild(frameBObj);
        me.bodyList.push(frameBObj);

        var frameCObj = new LSprite();
        frameCObj.x = me.x+150;
        frameCObj.y = me.y-40;
        frameCObj.addBodyPolygon(10,50,1,2);
        backLayer.addChild(frameCObj);
        me.bodyList.push(frameCObj);


        var wheelCObj=me.newCircle("n1",100,100);
        backLayer.addChild(wheelCObj);
        me.bodyList.push(wheelCObj);


        LStage.box2d.setRevoluteJoint(frameAObj.box2dBody, frameBObj.box2dBody);
        LStage.box2d.setRevoluteJoint(frameBObj.box2dBody, wheelAObj.box2dBody);
        LStage.box2d.setRevoluteJoint(frameAObj.box2dBody, frameCObj.box2dBody);
        LStage.box2d.setRevoluteJoint(frameCObj.box2dBody, wheelBObj.box2dBody);
        LStage.box2d.setRevoluteJoint(frameAObj.box2dBody, wheelBObj.box2dBody);
        LStage.box2d.setRevoluteJoint(frameAObj.box2dBody, wheelAObj.box2dBody);

        me.mainBody = wheelAObj.box2dBody;
        me.main1Body = wheelBObj.box2dBody;
        me.tcBody = wheelBObj.box2dBody;
    }

    Circle.prototype.newCircle= function(img,ax,ay){
        var me=this;
        var circle = new LSprite();
        var bitmap = new LBitmap(new LBitmapData(imgList[img]));
        circle.x=me.x+ax;
        circle.y=me.y-ay-bitmap.getHeight();
        circle.addChild(bitmap);
        circle.addBodyCircle(bitmap.getWidth()*0.5,bitmap.getHeight()*0.5,bitmap.getWidth()*0.5,1,2.5,.4,.5);
        return circle;
    }

    Circle.prototype.keydown=function(e,me){
        var force = 50;
        switch(e.keyCode){
            case 39:
                me.moveVec.x=force;
                break;
            case 37:
                me.moveVec.x=-force;
                break;
            case 38:
                me.tcVec.y = -force;
                break;
            case 40:
                me.tcVec.y = force;
                break;
            default:
                return;
        }
        me.mainBody.ApplyForce(me.moveVec,me.mainBody.GetWorldCenter());
        me.main1Body.ApplyForce(me.moveVec,me.main1Body.GetWorldCenter());
        me.tcBody.ApplyForce(me.tcVec,me.tcBody.GetWorldCenter());
    }

    Circle.prototype.keyup=function(e,me){
        me.moveVec.SetZero();
        me.tcVec.SetZero();
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