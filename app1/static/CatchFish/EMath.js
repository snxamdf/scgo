/**
 * Created with JetBrains WebStorm.
 * User: Predaking
 * Date: 13-11-15
 * Time: 下午11:02
 * To change this template use File | Settings | File Templates.
 */


var Engine = function(){};
Engine.createSpriteData = function(name,dataFunc){
    return  new SpriteData(imglist[name],dataFunc(name));
}

Engine.createSpriteModel = function(name,dataFunc,actId,sqeId){
    return  new SpriteModel(new SpriteData(imglist[name],dataFunc(name)),actId,sqeId);
}

var EMath = function (){throw "EMath cannot be instantiated";};
EMath.getAbs = function(value){
    if(value < 0){
        return -value;
    }
    return value;
}
EMath.getInt = function(value){
    return Math.floor(value);
};

EMath.getRandomClose = function(a,b){
    return Math.floor(Math.random()*(b+1-a) + a);
};

EMath.getRandomOpen = function(a,b){
    return Math.floor(Math.random()*(b-a) + a);
};

EMath.getRandomFloat = function(a,b){
    return Math.random()*(b-a) + a;
}

EMath.formatAngle = function(angle){
    if(angle < 0){
        while((angle += 360) < 0);
    }
    else
    if(angle >= 360){
        while((angle -= 360) >= 360);
    }
    return angle;
}

EMath.getAngleInterval = function(srcAngle,destAngle){
    var intervalAngle = EMath.formatAngle(destAngle - srcAngle);
    if(intervalAngle > 180){
        return intervalAngle - 360;
    }
    else{
        return intervalAngle;
    }
}

EMath.rotateAngle = function(srcAngle,destAngle,step){
    var intervalAngle = EMath.getAngleInterval(srcAngle,destAngle);
    if(intervalAngle > 0){
        srcAngle += step;
        intervalAngle = EMath.getAngleInterval(srcAngle,destAngle);
        if(intervalAngle > 0){
            return srcAngle;
        }
        else{
            return destAngle;
        }
    }
    else
    if(intervalAngle < 0){
        srcAngle -= step;
        intervalAngle = EMath.getAngleInterval(srcAngle,destAngle);
        if(intervalAngle < 0){
            return srcAngle;
        }
        else{
            return destAngle;
        }
    } else if(intervalAngle == 0){
        return null;
    }
}
EMath.getScaleValue = function(srcMin,srcMax,srcCur,destMin,destMax){
    if(srcCur <= srcMin){
        return destMin;
    }
    if(srcCur >= srcMax){
        return destMax
    }
    return (srcCur - srcMin)/(srcMax - srcMin)*(destMax - destMin)+destMin;
}


EMath.getAngle = function(pStart,pEnd,r){
    var detX = pEnd.x - pStart.x;
    var detY = pEnd.y - pStart.y;
    if(!r){
        r = Math.sqrt(detX * detX + detY * detY);
    }
    if(r != 0){
        var asinx = Math.asin(detY/r);
        if(detX < 0){
            asinx = Math.PI - asinx;
        }
        return asinx * 180 / Math.PI;
    }
    return 0;
}

EMath.sin = function(angle){
    return Math.sin(angle * Math.PI / 180);
}
EMath.cos = function(angle){
    return Math.cos(angle * Math.PI / 180);
}

EMath.getDistance = function(p0,p1){
    var dx = p0.x - p1.x;
    var dy = p0.y - p1.y;
    return Math.sqrt(dx*dx+dy*dy);
}

EMath.getPointRotateCoordinate = function(pSrc,pCenter,angle){
    var detX = pSrc.x - pCenter.x;
    var detY = pSrc.y - pCenter.y;
    var r = Math.sqrt(detX * detX + detY * detY);
    if(r != 0){
        var asinx = Math.asin(detY/r);
        if(detX < 0){
            asinx = Math.PI - asinx;
        }
        var paramAngle = (angle * Math.PI / 180) + asinx;
        var pDest = new LPoint(pCenter.x + r * Math.cos(paramAngle),pCenter.y + r * Math.sin(paramAngle));
        return pDest;
    }
    return pSrc.clone();
}






function Circle(x,y,r){
    var s = this;
    s.x = x;
    s.y = y;
    s.r = r;
}
Circle.prototype = {
    draw:function(layer,clr,x,y){
        var s = this;
        if(x && y){
            layer.graphics.drawArc(2,clr,[s.x + x, s.y + y, s.r,0, 2 * Math.PI]);
        }
        else{
            layer.graphics.drawArc(2,clr,[s.x, s.y, s.r,0, 2 * Math.PI]);
        }
    },
    resetCoordinate:function(x,y){
        var s = this;
        s.x = x;
        s.y = y;
    },
    offset:function(x,y){
        var s = this;
        s.x += x;
        s.y += y;
    },
    clone:function(){
        var s = this;
        return new Circle(s.x, s.y, s.r);
    },
    isHitOtherCircle:function(otherCircle){
        var s = this;
        var rSum = s.r + otherCircle.r;
        var dtx = EMath.getAbs(s.x - otherCircle.x);
        if(dtx > rSum){
            return false;
        }
        var dty = EMath.getAbs(s.y - otherCircle.y);
        if(dty > rSum){
            return false;
        }
        return dtx * dtx + dty * dty <= rSum * rSum;
    }

};

function ButtonManager(layer){
    var s = this;
    s.init(layer);
}

ButtonManager.prototype = {
    init:function(layer){
        var s = this;
        s.buttonList = new Array();
        s.layer = layer;
    },
    addButton:function(spd,btnUpId,x,y,clickFunc){
        var s = this;
        var button = new EButton(spd,btnUpId,x,y,clickFunc);
        s.layer.addChild(button);
        s.buttonList.push(button);
    },
    mouseDown:function(){
        var s = this;
        var x = LGlobal.offsetX;
        var y = LGlobal.offsetY;
        var len = s.buttonList.length;
        if(s.curButton){
            s.curButton.setState(EButton.STATE_UP);
        }
        s.curButton = null;
        for(var i = 0; i < len; i++){
            if(s.buttonList[i].isMouseIn(x,y)){
                s.curButton = s.buttonList[i];
                s.curButton.setState(EButton.STATE_DOWN);
                return true;
            }
        }
        return false;
    },
    mouseUp:function(){
        var s = this;
        if(s.curButton){
            s.curButton.setState(EButton.STATE_UP);
            if(s.curButton.isMouseIn(LGlobal.offsetX,LGlobal.offsetY)){
                s.curButton.clickFunction();
            }
            return true;
        }
        return false;

    }


};

EButton.STATE_UP = 0;
EButton.STATE_DOWN = 1;
EButton.STATE_DISABLE = 2;
function EButton(spd,btnUpId,x,y,clickFunc){
    var s = this;
    base(s,SpriteModel,[spd,btnUpId,0]);
    s.setCoordinate(x,y);
    s.upId= btnUpId;
    s.clickFunction = clickFunc;
    s.state = EButton.STATE_UP;
}

p = {
    setState:function(state){
        var s = this;
        s.state = state;
        s.setAction(s.upId + state);
    },
    isMouseIn:function(x,y){
        var s = this;
        var rect = s.getRect(0);
        rect.offset(s.offsetX, s.offsetY);
        return rect.contains(x,y);
    }
}
for(var k in p)EButton.prototype[k]=p[k];
