
function FishManager(){
    base(this,RenderLayer,[]);
    var s = this;
    s.rl = new RenderLayer();       //!!!!!!!!!!!!!!!!!!!!!
    s.addChild(s.rl);                //!!!!!!!!!!!!!!!!!!!!!
}
p = {
    init:function(){
        var s = this;
        s.fishList = new Array();
        s.freeFishCount = 0;//当前剩余的空位个数
    },
    addFish:function(type,x,y,angle,speed){
        var s = this;
        if(s.freeFishCount == 0){
            if(s.fishList.length < StaticData.maxFish){
                var fish = new FishObject(type,x,y,angle,speed);
                s.fishList.push(fish);
                s.addChild(fish);
                fish.arrayId = s.fishList.length - 1;
            }
        }
        else{
            for(var i = 0; i < s.fishList.length; i++){
                var fish = s.fishList[i];
                if(fish.state == Game.STATE_NULL){
                    fish.resetFish(type,x,y,angle,speed);
                    fish.visible = true;
                    s.freeFishCount--;
                    break;
                }
            }
        }
    },
    removeFish:function(fish){
        var s = this;
        fish.visible = false;
        s.freeFishCount++;
    },

    update:function(){
        var s = this;

        s.rl.die();//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        var len = s.fishList.length;
        for(var i = 0; i < len; i++){
            var fish = s.fishList[i];
            fish.update();
//            s.updateFrm(fish);
        }
    }

//    updateFrm:function(fish){
//        if(fish.state == Game.STATE_NULL)return;
//
//        var s = this;
//        var clrs = StaticData.getFishCircles(fish.type);
//        var pfc = new LPoint(fish.getX(),fish.getY());
//
//        var clr = new Array();
//        clr.push("#ff0000");
//        clr.push("#00ff00");
//        for(var i = 0; i < clrs.length; i++){
//            var p1 = new LPoint(pfc.x + clrs[i].x,pfc.y + clrs[i].y);
//            var p = EMath.getPointRotateCoordinate(p1,pfc,fish.angle);
//            var c2 = clrs[i].clone();
//            c2.x = p.x;
//            c2.y = p.y;
//            c2.draw(s.rl,clr[i]);
//        }
//    }

};
for(var k in p)FishManager.prototype[k]=p[k];


function TeamManager(){
}
p = {
    init:function(){
        var s = this;
        s.teamList = new Array();
        s.freeTeamCount = 0;
        s.intervalAddTeam = [0,0,0];
        for(var i = 0; i < 3; i++){
            s.resetTeamInterval(i);
        }
        s.sideArea = [0,0,0];
        for(var i = 0; i < 3; i++){
            s.resetTeamInterval(i);
        }
    },
    resetTeamArea:function(side){
        var s = this;
        var area = s.sideArea[side];
        area += EMath.getRandomClose(2,6);
        if(area >= 8){
            area -= 8;
        }
        s.sideArea[side] = area;
    },

    resetTeamInterval:function(side){
        var s = this;
        s.intervalAddTeam[side] = StaticData.getResetTeamIntervalFrame(side);
    },
    addTeam:function(side,area){
        var s = this;
        if(s.freeTeamCount == 0){
            var team = new Team(side,area);
            s.teamList.push(team);
        }
        else{
            for(var i = 0; i < s.teamList.length; i++){
                var team = s.teamList[i];
                if(team.state == Game.STATE_NULL){
                    team.init(side,area);
                    s.freeTeamCount--;
                    break;
                }
            }
        }
    },
    removeTeam:function(team){
        var s = this;
        s.freeTeamCount++;
    },
    update:function(){
        var s = this;
        var len = s.teamList.length;
        for(var i = 0; i < len; i++){
            s.teamList[i].update();
        }
        for(var i = 0; i < 3; i++){
            if(--s.intervalAddTeam[i] <= 0){
                s.resetTeamInterval(i);
                s.resetTeamArea(i);
                s.addTeam(i, s.sideArea[i]);
            }
        }
    }

};
for(var k in p)TeamManager.prototype[k]=p[k];




function Team(side,area){
    var s = this;
    s.init(side,area);
}
p = {
    init:function(side,area){
        var s = this;
        s.x = 0;s.y = 0;s.angle = 0;
        s.fishType = StaticData.getFishType();//鱼的种类
        s.side = side;
        s.angle = StaticData.getStartAngle(side, s.fishType);
        switch (side){//根据传来的边的位置，和在边中区域的位置，算出坐标来
            case 0://左边
                s.x = -StaticData.getFishSideDistance(s.fishType);
                s.y = StaticData.teamScreenOffsetY + (StaticData.teamScreenH * area >> 3);
                break;
            case 1://右边
                s.x = screenW + StaticData.getFishSideDistance(s.fishType);
                s.y = StaticData.teamScreenOffsetY + (StaticData.teamScreenH * area >> 3);
                break;
            case 2://上边
                s.x = StaticData.teamScreenOffsetX + (StaticData.teamScreenW * area >> 3);
                s.y = -StaticData.getFishSideDistance(s.fishType);
                break;
        }

        s.countFishInTeam = StaticData.getFishTeamCount(s.fishType); //队伍中的鱼个数
        s.intervalFrame = StaticData.getFishIntervalFrame(s.fishType);//队伍出鱼的间隔时间
        s.setState(Game.STATE_ACTION);
    },
    setState:function(state){
        var s = this;
        s.state = state
        switch (s.state){
            case Game.STATE_ACTION:
                break;
            case Game.STATE_NULL:
                Game.teamMgr.removeTeam(s);
                break;
        }
    },
    update:function(){
        var s = this;
        switch (s.state){
            case Game.STATE_ACTION:
                if(--s.intervalFrame <= 0){
                    if(s.side == 2){
                        Game.fishMgr.addFish(s.fishType,
                            s.x + StaticData.getFishStartOffset(s.fishType),s.y,
                            s.angle);
                    }
                    else{
                        Game.fishMgr.addFish(s.fishType,
                            s.x,s.y + StaticData.getFishStartOffset(s.fishType),
                            s.angle);
                    }
                    if(--s.countFishInTeam <= 0){
                        s.setState(Game.STATE_NULL);
                    }
                    else{
                        s.intervalFrame = StaticData.getFishIntervalFrame(s.fishType);//队伍出鱼的间隔时间
                    }
                }
                break;
            case Game.STATE_NULL:
                break;
        }
    }
}
for(var k in p)Team.prototype[k]=p[k];




function FishObject(type,x,y,angle){
    var s = this;
    base(s,SpriteModel,[StaticData.getFishSpriteData(type),0,0]);
    s.init(type,x,y,angle);
    s.arrayId = 0;
}
p = {
    resetFish:function(type,x,y,angle){
        var s = this;
        s.sprData = StaticData.getFishSpriteData(type);

        s.init(type,x,y,angle);
    },
    init:function(type,x,y,angle){
        var s = this;
        s.setAction(0,0);
        s.setActionScale(1);
        s.type = type;
        s.setCoordinate(x,y);
        s.moveFrames = StaticData.getFishMoveFrame(s.type);
        s.angle = angle+StaticData.getFishNextAngleOffset(s.type);
        s.isIntoScreen = false;
        s.baseSpeed = StaticData.getFishBaseSpeed(s.type);
        s.setNewSpeed();
        s.hitCircles = null;
        s.updateCollision(true);
        s.setState(Game.STATE_ACTION);
    },

    setNewSpeed:function(){
        var s = this;
        s.moveFrames = StaticData.getFishMoveFrame(s.type);
        s.angle -= StaticData.getFishNextAngleOffset(s.type);
        s.setActionRotate(s.angle);
        s.speedX = s.baseSpeed * EMath.cos(s.angle);
        s.speedY = s.baseSpeed * EMath.sin(s.angle);

    },
    setState:function(state){
        var s = this;
        s.state = state
        switch (s.state){
            case Game.STATE_ACTION:
                break;
            case Game.STATE_DESTORY:
                s.setAction(1);
                break;
            case Game.STATE_NULL:
                Game.fishMgr.removeFish(this);
                break;
            case Game.STATE_FISH_TO_COIN:
                Game.playerMgr.numberMgr.addNumber(s.getX(), s.getY(),StaticData.getFishCost(s.type));
                s.sprData = StaticData.sprDataCoin;
                s.setAction(0);
                s.setActionScale(StaticData.getFishCoinRate(s.type));
                s.setActionRotate(0);
                s.getMoveSpeed();
                break;
        }
    },
    getX:function(){
        return this.offsetX;
    },
    getY:function(){
        return this.offsetY;
    },
    updateScreenArea:function(){
        var s = this;
        var x = s.getX();
        var y = s.getY();
        var len = StaticData.getFishSideDistance(s.type);
        if(x > -len && x < screenW+len && y > -len && y < screenH+len){//在屏幕里
            if(!s.isIntoScreen){//没进过屏幕
                s.isIntoScreen = true;
            }
        }
        else{//出了屏幕了
            if(s.isIntoScreen){//进过屏幕
                s.setState(Game.STATE_NULL);
            }
        }

    },
    getMoveSpeed:function(){
        var s = this;
        var dtx = StaticData.destCoinPoint.x - s.getX();
        var dty = StaticData.destCoinPoint.y - s.getY();
        var distance = Math.sqrt(dtx * dtx + dty * dty);
        s.speedX = StaticData.moveCoinBaseSpeed * dtx / distance;
        s.speedY = StaticData.moveCoinBaseSpeed * dty / distance;
        s.moveFrames = EMath.getInt(distance/StaticData.moveCoinBaseSpeed);
    },
    update:function(){
        var s = this;
        switch (s.state){
            case Game.STATE_ACTION:
                s.nextFrame();
                s.moveCoordinate(s.speedX, s.speedY);

                s.updateScreenArea();
                if(--s.moveFrames <= 0){
                    s.setNewSpeed();
                    s.updateCollision(true);
                }
                else{
                    s.updateCollision(false);
                }
                break;
            case Game.STATE_DESTORY:
                if(s.nextFrameNoLoop()){
                    s.setState(Game.STATE_FISH_TO_COIN);
                }
                break;
            case Game.STATE_FISH_TO_COIN:
                s.nextFrame();
                s.moveCoordinate(s.speedX, s.speedY);
                if(--s.moveFrames <= 0){
                    s.setState(Game.STATE_NULL);
                }
                break;
            case Game.STATE_NULL:
                break;
        }
    },
    updateCollision:function(isReset){
        var s = this;
        if(isReset){
            var circles = StaticData.getFishCircles(s.type);
            var len = circles.length;
            var pt = new LPoint(s.getX(), s.getY());
            if(s.hitCircles){
                for(var i = 0; i < len; i++){
                    var fishPt = EMath.getPointRotateCoordinate(new LPoint(pt.x + circles[i].x,pt.y + circles[i].y),pt, s.angle);
                    s.hitCircles[i].resetCoordinate(fishPt.x,fishPt.y);
                }
            }
            else{
                s.hitCircles = new Array();
                for(var i = 0; i < len; i++){
                    var fishPt = EMath.getPointRotateCoordinate(new LPoint(pt.x + circles[i].x,pt.y + circles[i].y),pt, s.angle);
                    s.hitCircles.push(new Circle(fishPt.x,fishPt.y,circles[i].r));
                }
            }
        }
        else{
            var len = s.hitCircles.length;
            for(var i = 0; i < len; i++){
                s.hitCircles[i].offset(s.speedX, s.speedY);
            }
        }
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        for(var i = 0; i < s.hitCircles.length; i++){
            s.hitCircles[i].draw(Game.fishMgr.rl,"#ffff00"); //!!!!!!!!!!!!
        }

    }

};
for(var k in p)FishObject.prototype[k]=p[k];