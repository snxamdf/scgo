

var cannonFireScale = new Array(
    0.95,
    0.90,
    0.85,
    0.8,
    0.75,
    0.95,
    1.15,
    1.07,
    1,
    1.05,
    1);
var fireFrame = 2;
var netDataLevel = new Array(
    7,0.5,
    7,0.58,
    7,0.66,
    7,0.72,
    8,0.8,
    8,0.88,
    8,0.96
);
//var netDataLevel = new Array(
//    0,0.5,
//    0,0.58,
//    0,0.66,
//    0,0.72,
//    0,0.8,
//    0,0.88,
//    0,0.96
//);
var netDataScale = new Array(
    0.6,
    0.7,
    0.8,
    0.9,
    1,
    0.9,
    0.8
    );
var netHitFrame = 1;
var netR = 85;


function PlayerManager(){
    base(this,RenderLayer,[]);
    var s = this;
//    s.mouseChildren = true;
}
p = {
    init:function(){
        var s = this;
        s.playerLevel = 0;
        s.spmUI = Engine.createSpriteModel("game_ui",getUiSpxData);
        s.addChild(s.spmUI);

        s.spdButton = Engine.createSpriteData("btn",getUiSpxData);
        s.buttonManager = new ButtonManager(s);
        setButtonManager(s.buttonManager);
        var pt = s.spmUI.getPoint(1);
        s.buttonManager.addButton(s.spdButton,0,pt.x,pt.y, function(){
            s.changeCannonLevel(true);
        });
        pt = s.spmUI.getPoint(2);
        s.buttonManager.addButton(s.spdButton,4,pt.x,pt.y, function(){
            s.changeCannonLevel(false);
        });
        StaticData.destCoinPoint = s.spmUI.getPoint(4);

        s.cannonAngle = 270;
        s.cannonCenter = s.spmUI.getPoint(0);
        s.spmCannon = Engine.createSpriteModel("cannon",getUiSpxData);
        s.spmCannon.moveCoordinate(s.cannonCenter.x,s.cannonCenter.y);
        s.spmCannon.setActionRotate(s.cannonAngle);
        s.addChild(s.spmCannon);

        s.bulletList = new Array();
        s.freeBulletCount = 0;//当前剩余的空位个数

        s.numberMgr = new NumberManager(Engine.createSpriteData("num_big",getScoreSpxData));
        s.addChild(s.numberMgr);

//        s.spmNet = Engine.createSpriteModel("net",getWeaponSpxData);
//        s.spmNet.moveCoordinate(100,100);
//        s.spmNet.setActionScale(0.5);
//        s.addChild(s.spmNet);

        s.fireCount = -1;


    },
    changeCannonLevel:function(isAdd){
        var s = this;
        if(isAdd){
            if(++s.playerLevel > 6){
                s.playerLevel = 0;
            }
        }
        else{
            if(--s.playerLevel < 0){
                s.playerLevel = 6;
            }
        }
        s.spmCannon.setAction(s.playerLevel);
    },
    fire:function(){
        var s = this;
        if(s.fireCount == -1){
            var pt = new LPoint(LGlobal.offsetX,LGlobal.offsetY);
            s.cannonAngle = EMath.getAngle(s.cannonCenter,pt);
            if(s.cannonAngle >= 0 && s.cannonAngle <= 90){
                s.cannonAngle = 0;
            }
            else
            if(s.cannonAngle >= 90 && s.cannonAngle <= 180){
                s.cannonAngle = 180;
            }
            s.spmCannon.setActionRotate(s.cannonAngle);
            s.fireCount = 0;
        }

    },
    update:function(){
        var s = this;
        if(s.fireCount != -1){
            s.spmCannon.scaleX = cannonFireScale[s.fireCount];
            if(s.fireCount == fireFrame){
                var len = StaticData.getCannonLength(s.playerLevel);
                var x = s.cannonCenter.x + len * EMath.cos(s.cannonAngle);
                var y = s.cannonCenter.y + len * EMath.sin(s.cannonAngle);
                s.addBullet(s.playerLevel,x,y, s.cannonAngle);
            }
            if(++s.fireCount > cannonFireScale.length){
                s.fireCount = -1;
                s.spmCannon.scaleX = 1;
            }
        }
        var len = s.bulletList.length;
        for(var i = 0; i < len; i++){
            var bullet = s.bulletList[i];
            bullet.update();
        }

        s.numberMgr.update();
    },

    addBullet:function(level,x,y,angle){
        var s = this;
        if(s.freeBulletCount == 0){
            var bullet = new Bullet(level,x,y,angle);
            s.bulletList.push(bullet);
            s.addChild(bullet);
        }
        else{

            for(var i = 0; i < s.bulletList.length; i++){
                var bullet = s.bulletList[i];
                if(bullet.state == Game.STATE_NULL){
                    bullet.reset(level,x,y,angle);
                    bullet.visible = true;
                    s.freeBulletCount--;
                    break;
                }
            }
        }
    },
    removeBullet:function(bullet){
        var s = this;
        bullet.visible = false;
        s.freeBulletCount++;
    }

};
for(var k in p)PlayerManager.prototype[k]=p[k];


function Bullet(level,x,y,angle){
    var s = this;
    base(s,SpriteModel,[StaticData.sprDataBullet,level,0]);
    s.init(level,x,y,angle);
}

p={
    reset:function(level,x,y,angle){
        var s = this;
//        s.sprData = StaticData.sprDataBullet;
        s.setAction(level);
        s.setActionScale(1);
        s.init(level,x,y,angle);
    },
    init:function(level,x,y,angle){
        var s = this;
        s.level = level;
        s.setCoordinate(x,y);
        s.setActionRotate(angle);
        s.speedX = StaticData.bulletBaseSpeed * EMath.cos(angle);
        s.speedY = StaticData.bulletBaseSpeed * EMath.sin(angle);
        s.r = s.getPoint(0).x;
        s.hitCircle = new Circle(x,y, s.r);
        s.netIndex = 0;
        s.setState(Game.STATE_ACTION);
    },
    setState:function(state){
        var s = this;
        s.state = state
        switch (s.state){
            case Game.STATE_ACTION:
                break;
            case Game.STATE_DESTORY:
//                s.sprData = StaticData.sprDataNet;
                s.setAction(netDataLevel[s.level << 1]);
                s.baseScale = netDataLevel[(s.level << 1) + 1];
                s.setActionScale(s.baseScale * netDataScale[s.netIndex]);
                s.setActionRotate(0);
                break;
            case Game.STATE_NULL:
                Game.playerMgr.removeBullet(this);
                break;
        }
    },
    update:function(){
        var s = this;
//        trace(111+ "   "+s.state );
        switch (s.state){
            case Game.STATE_ACTION:
                s.moveCoordinate(s.speedX, s.speedY);
                var x = s.getX();
                var y = s.getY();
                if(x < -s.r || x > screenW + s.r || y < -s.r || y > screenH+s.r){
                    s.setState(Game.STATE_NULL);
                }
                s.updateCollision();//!!!!!!!
                break;
            case Game.STATE_DESTORY:
                if(++s.netIndex < netDataScale.length){
                    s.setActionScale(s.baseScale * netDataScale[s.netIndex]);
                    if(s.netIndex == netHitFrame){ //网子只有一阵判断碰撞
                        var circleNet = new Circle(s.getX(), s.getY(), netR * s.baseScale);
                        var fishes = Game.fishMgr.fishList;
                        var len = fishes.length;
                        for(var i = 0; i < len; i++){
                            if(fishes[i].state == Game.STATE_ACTION){
                                var circles = fishes[i].hitCircles;
                                for(var j = 0; j < circles.length; j++){
                                    if(circleNet.isHitOtherCircle(circles[j])){
                                        fishes[i].setState(Game.STATE_DESTORY);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else{
                    s.setState(Game.STATE_NULL);
                }
                break;
            case Game.STATE_NULL:
                break;
        }
    },
    getX:function(){
        return this.offsetX;
    },
    getY:function(){
        return this.offsetY;
    },
    updateCollision:function(){
        var s = this;
        s.hitCircle.resetCoordinate(s.getX(), s.getY());
        var fishes = Game.fishMgr.fishList;
        var len = fishes.length;
        for(var i = 0; i < len; i++){
            if(fishes[i].state == Game.STATE_ACTION){
                var circles = fishes[i].hitCircles;
                for(var j = 0; j < circles.length; j++){
                    if(s.hitCircle.isHitOtherCircle(circles[j])){
                        s.setState(Game.STATE_DESTORY);//!!!!!!!!!!!!
                        return;
                    }
                }
            }
        }

        s.hitCircle.draw(Game.fishMgr.rl,"#ff0000"); //!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

};
for(var k in p)Bullet.prototype[k]=p[k];

function NumberManager(spd){
    var s = this;
    base(s, RenderLayer,[]);
    s.sprData = spd;
    s.init();
};
p = {
    init:function(){
        var s = this;
        s.numList = new Array();
        s.freeNumberCount = 0;
    },
    addNumber:function(x,y,value){
        var s = this;
//        trace(s.sprData.name+" "+x+","+y+"   "+value)
        if(s.freeNumberCount == 0){
            var num = new Number(s.sprData,x,y,value,36);
            s.numList.push(num);
            s.addChild(num);
        }
        else{
            for(var i = 0; i < s.numList.length; i++){
                var num = s.numList[i];
                if(num.state == Game.STATE_NULL){
                    num.reset(x,y,value);
                    num.visible = true;
                    s.freeNumberCount--;
                    break;
                }
            }
        }
    },
    removeNumber:function(number){
        var s = this;
        number.visible = false;
        s.freeBulletCount++;
    },
    update:function(){
        var s = this;
//        trace(1111)
        for(var i = 0; i < s.numList.length; i++){
            s.numList[i].update();
        }
    }
}
for(var k in p)NumberManager.prototype[k]=p[k];


function Number(spd,x,y,value,interval,bit){
    var s = this;
    base(s, RenderLayer,[]);
    s.interval = interval;
    if(!bit){
        s.bit = 0;
    }
    else{
        s.bit = bit;
    }
    s.sprData = spd;
//    trace(111);
    s.init(x,y,value);
//    trace(222);
}
p = {
    reset:function(x,y,value){
        var s = this;
        s.init(x,y,value);
    },
    init:function(x,y,value){
        var s = this;
        s.value = value;
        s.setCoordinate(x,y);
        s.setValue(value);
        s.showTime = 10;
        s.alpha = 1;
        s.scaleX = 0.5;      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        s.scaleY = 0.5;
        s.setState(Game.STATE_ACTION);
    },
    setValue:function(value){
        var s = this;
        s.strValue = s.getStringValue(value, s.bit);
        s.removeAllChild();
        var x = 0;
        var y = 0;
        var len = s.strValue.length;
        for(var i = 0; i < len; i++){
            var numBit = parseInt(s.strValue[i],10);
            var spm = new SpriteModel(s.sprData,numBit);
            spm.setCoordinateX(x);
            s.addChild(spm);
            x += s.interval;
        }
    },
    getStringValue:function(value,bit){
        var str = value + "";
        if(bit > 0){
            if(str.length > bit){
                str = "";
                for(var i = 0; i < bit; i++){
                    str += 9;
                }
            }
            else{
                var len = bit - str.length;
                for(var i = 0; i < len; i++){
                    str = "0"+str;
                }
            }
        }
        return str;
    },
    setState:function(state){
        var s = this;
        s.state = state;
        switch (s.state){
            case Game.STATE_ACTION:
                break;
            case Game.STATE_DESTORY:
                break;
            case Game.STATE_NULL:
                Game.playerMgr.numberMgr.removeNumber(this);
                break;
        }
    },
    getX:function(){
        return this.offsetX;
    },
    getY:function(){
        return this.offsetY;
    },
    update:function(){
        var s = this;
//        trace("s.state "+s.state)
        switch (s.state){
            case Game.STATE_ACTION:
                s.moveCoordinate(0,-4);
                s.alpha -= 0.07;
                if(--s.showTime <= 0){
                    s.setState(Game.STATE_NULL);
                }
                break;
            case Game.STATE_DESTORY:
                break;
            case Game.STATE_NULL:
                break;
        }
    }

}

for(var k in p)Number.prototype[k]=p[k];
