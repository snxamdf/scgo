/**
 * Created with JetBrains WebStorm.
 * User: Predaking
 * Date: 14-1-12
 * Time: 上午9:52
 * To change this template use File | Settings | File Templates.
 */

function FishStaticData(type){
    var s = this;
    s.type = type;
    s.baseSpeedMin = 3;//基础速度最小值
    s.baseSpeedMax = 4;//基础速度最大值
    s.sideDistance = 40;//离开边界的像素值
    s.teamCountMin = 2;//队伍中鱼数量的最小值
    s.teamCountMax = 6;//队伍中鱼数量的最大值
    s.intervalFrameMin = 15;//队伍刷鱼的间隔时间最小值
    s.intervalFrameMax = 25;//队伍刷鱼的间隔时间最大值
    s.fishStartOffsetMin = -50;//鱼的出生地偏移area中心点最小值
    s.fishStartOffsetMax = 50;//鱼的出生地偏移area中心点最大值
    s.coinSizeRate = 0.5;//鱼变成金币以后金币的缩放比例
    s.cost = 10;//鱼的价格

    s.spriteData = new SpriteData(imglist["fish0"],getFishSpxData("fish0"));//鱼的spriteData
    s.circleDatas = new Array();//每个鱼身上的碰撞圆圈的偏移信息
    var frame = s.spriteData.frames[0];
    var len = frame.pointCount;
    for(var i = 0; i < len; i++){
        var r = s.spriteData.getRect(0,i).width >> 1;
        var point = s.spriteData.getPoint(0,i);
        s.circleDatas.push(new Circle(point.x,point.y,r));
    }
    s.init();
}
FishStaticData.prototype.init = function(){
    var s = this;
//    switch(s.type){
//        case 0:
//            s.baseSpeedMin = 3.5;//基础速度最小值
//            s.baseSpeedMax = 4;//基础速度最大值
//            s.sideDistance = 20;//距离边界的像素
//            s.teamCountMin = 2;//队伍中鱼数量的最小值
//            s.teamCountMax = 5;//队伍中鱼数量的最大值
//            s.intervalFrameMin = 5;//队伍刷鱼的间隔时间最小值
//            s.intervalFrameMax = 10;//队伍刷鱼的间隔时间最大值
//            break;
//        case 1:
//            s.baseSpeedMin = 4.5;//基础速度最小值
//            s.baseSpeedMax = 5;//基础速度最大值
//            s.sideDistance = 10;//距离边界的像素
//            s.teamCountMin = 2;//队伍中鱼数量的最小值
//            s.teamCountMax = 5;//队伍中鱼数量的最大值
//            s.intervalFrameMin = 5;//队伍刷鱼的间隔时间最小值
//            s.intervalFrameMax = 10;//队伍刷鱼的间隔时间最大值
//            break;
//        case 2:
//            s.baseSpeedMin = 3;//基础速度最小值
//            s.baseSpeedMax = 3.5;//基础速度最大值
//            s.sideDistance = 10;//距离边界的像素
//            s.teamCountMin = 2;//队伍中鱼数量的最小值
//            s.teamCountMax = 5;//队伍中鱼数量的最大值
//            s.intervalFrameMin = 5;//队伍刷鱼的间隔时间最小值
//            s.intervalFrameMax = 10;//队伍刷鱼的间隔时间最大值
//            break;
//        case 3:
//            s.baseSpeedMin = 3;//基础速度最小值
//            s.baseSpeedMax = 3.5;//基础速度最大值
//            s.sideDistance = 10;//距离边界的像素
//            s.teamCountMin = 2;//队伍中鱼数量的最小值
//            s.teamCountMax = 5;//队伍中鱼数量的最大值
//            s.intervalFrameMin = 5;//队伍刷鱼的间隔时间最小值
//            s.intervalFrameMax = 10;//队伍刷鱼的间隔时间最大值
//            break;
//        case 4:
//            s.baseSpeedMin = 3;//基础速度最小值
//            s.baseSpeedMax = 3.5;//基础速度最大值
//            s.sideDistance = 10;//距离边界的像素
//            s.teamCountMin = 2;//队伍中鱼数量的最小值
//            s.teamCountMax = 5;//队伍中鱼数量的最大值
//            s.intervalFrameMin = 5;//队伍刷鱼的间隔时间最小值
//            s.intervalFrameMax = 10;//队伍刷鱼的间隔时间最大值
//            break;
//    }
};


function StaticData(){};
StaticData.fishDatas = new Array();
StaticData.getResetTeamIntervalFrame = function(side){
    if(side == 2){
        return EMath.getRandomClose(100,150);//上边出现的队伍，刷新时间
    }
    else{
        return EMath.getRandomClose(60,90);//两边出现的队伍，刷新时间
    }
}

StaticData.sprDataBullet = null;
//StaticData.sprDataNet = null;
StaticData.sprDataCoin = null;

StaticData.init = function(){
    for(var i = 0; i < 5; i++){
        StaticData.fishDatas.push(new FishStaticData(i));
    }
    StaticData.sprDataBullet = Engine.createSpriteData("bullet",getWeaponSpxData);
//    StaticData.sprDataNet = Engine.createSpriteData("net",getWeaponSpxData);
    StaticData.sprDataCoin = Engine.createSpriteData("coin",getScoreSpxData);
};
StaticData.getFishBaseSpeed = function(type){//获得鱼的基础速度
    var data = StaticData.fishDatas[type];
    return EMath.getRandomFloat(data.baseSpeedMin,data.baseSpeedMax);
}
StaticData.getFishStartOffset = function(type){//获得鱼的基础速度
    var data = StaticData.fishDatas[type];
    return EMath.getRandomFloat(data.fishStartOffsetMin,data.fishStartOffsetMax);
}
StaticData.getFishSideDistance = function(type){//获得鱼出现的位置，距离边界的尺寸
    return StaticData.fishDatas[type].sideDistance;
}
StaticData.getFishCoinRate = function(type){//获得鱼变成金币的大小比例
    return StaticData.fishDatas[type].coinSizeRate;
}
StaticData.getFishCost = function(type){//获得鱼的价值
    return StaticData.fishDatas[type].cost;
}
StaticData.getFishTeamCount = function(type){//获得指定种类的鱼队伍中的个数
    var data = StaticData.fishDatas[type];
    return EMath.getRandomClose(data.teamCountMin,data.teamCountMax);
}
StaticData.getFishIntervalFrame = function(type){//获得不同种类的鱼刷新的间隔帧数
    var data = StaticData.fishDatas[type];
    return EMath.getRandomClose(data.intervalFrameMin,data.intervalFrameMax);
}
StaticData.getFishType = function(){//得到鱼的类型
    return EMath.getRandomClose(0,4);
}
StaticData.getStartAngle = function(side,type){//得到队伍初始角度
    var angle = EMath.getRandomFloat(-30,30);

    switch(side){
        case 0:
            break;
        case 1:
            angle += 180;
            break;
        case 2:
            angle += 90;
            break;
    }
    return angle;
}
StaticData.getFishMoveFrame = function(type){//得到鱼在当前角度的行走帧数
    return EMath.getRandomClose(5,8);
}
StaticData.getFishNextAngleOffset = function(type){//得到鱼的下个行走角度
    return EMath.getRandomFloat(-2,2);
}

StaticData.getFishSpriteData = function(type){//得到鱼的sprite data
    return StaticData.fishDatas[type].spriteData;
}

StaticData.getFishCircles = function(type){//得到鱼身上的碰撞圆
    return StaticData.fishDatas[type].circleDatas;
}

StaticData.bulletBaseSpeed = 12;//子弹默认速度
StaticData.cannonLength = new Array(25,28,31,35,40,45,50);
StaticData.getCannonLength = function(level){  //炮口和中心点默认距离
    return StaticData.cannonLength[level];
}

StaticData.maxFish = 20;//最大允许出现的鱼的个数

StaticData.destCoinPoint = null;//UI中金币的最终接收点
StaticData.moveCoinBaseSpeed = 15;//金币移动的速度

StaticData.scoreShowNumInterval = 23;//UI中显示分数的数字间隔

StaticData.teamScreenOffsetX = 55;//队伍屏幕位置出现距离屏幕边界的尺寸x
StaticData.teamScreenW = screenW - StaticData.teamScreenOffsetX * 2;//队伍出现在屏幕中心位置的宽度
StaticData.teamScreenOffsetY = 55;//队伍屏幕位置出现距离屏幕边界的尺寸y
StaticData.teamScreenH = screenH - StaticData.teamScreenOffsetY * 2;//队伍出现在屏幕中心位置的宽度


