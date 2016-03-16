(function () {
    if (LGlobal.canTouch) {
        LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
        LSystem.screen(LStage.FULL_SCREEN);
    }

    LInit(30, "mylegend", 720, 480, main);

    var backLayer;
    var imglist = {};
    var imgData = new Array({name: "f0", path: "/static/test/f0.png"});

    function main() {
        LGlobal.setDebug(true);
        LGlobal.box2d = new LBox2d([0,0]);
        //LGlobal.box2d = new LBox2d();
        LLoadManage.load(
            imgData,
            null,
            function (result) {
                imglist = result;
                console.log(result);
                init();
            }
        );
    };

    var bird;
    var bitmap;
    function init() {
        addChild(new FPS());
        backLayer = new LSprite();
        addChild(backLayer);
        kuang();
        yuan();
        ballr();



        bird = new LSprite();
        bird.name = "bird01";
        backLayer.addChild(bird);

        //bitmap = new LBitmap(new LBitmapData(imglist["f0"]));
        //bird.addChild(bitmap);
        //bird.rotate = 0;
        //bird.x = 300;
        //bird.y = 430;
        //bird.yspeed = -5;
        //LTweenLite.to(bird,1,
        //    {
        //        x:200,
        //        yspeed:5,
        //        delay:1,
        //        rotate:-360,
        //        onUpdate:function(){
        //            bird.y += bird.yspeed;
        //        },
        //        onComplete:function(){
        //            start();
        //        },
        //        ease:Sine.easeIn
        //    }
        //);
    }
    function move(event){
        console.log(event.offsetX,event.offsetY);
    }


    function yuan(){
        var lyuan=new LSprite();
        lyuan.x=200;
        lyuan.y=200;
        addChild(lyuan);
        var bitmap = new LBitmap(new LBitmapData(imglist["f0"]));
        lyuan.addBodyCircle(bitmap.getWidth()*0.5,bitmap.getHeight()*0.5,bitmap.getWidth()*0.5,1,0.1,0.2,0.3);
        lyuan.setBodyMouseJoint(true);
        lyuan.addChild(bitmap);
    }


    function ballr(){
        var x=parseInt( Math.random()*480);
        var layer = new LSprite();
        addChild(layer);
        layer.graphics.drawArc(0,"gray",[x,0,5,0,2*Math.PI],true,"gray");
        layer.addEventListener(LEvent.ENTER_FRAME,onframe);
    }
    var direction = 3;
    var i=0;
    function onframe(event){

        var layer = event.currentTarget;
        layer.y += direction;
        //console.log(direction);
        if(layer.y < 0){
            direction = 3;
        }
        if(layer.y > 480){
            direction = -3;
        }
    }
    function kuang(){
        var k1=new LSprite();
        k1.addBodyPolygon(1440,1,0);
        backLayer.addChild(k1);

        var k2=new LSprite();
        k2.addBodyPolygon(1,960,0);
        backLayer.addChild(k2);

        var k3=new LSprite();
        k3.y=480;
        k3.addBodyPolygon(1440,1,0);
        backLayer.addChild(k3);

        var k4=new LSprite();
        k4.x=720;
        k4.addBodyPolygon(1,960);
        backLayer.addChild(k4);
    }
    function down(){
        console.log("down");
    }
})();