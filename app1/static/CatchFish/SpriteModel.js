/**
 * Created with JetBrains WebStorm.
 * User: Predaking
 * Date: 13-11-12
 * Time: 上午11:30
 * To change this template use File | Settings | File Templates.
 */
function SpriteModel(spriteData,actId,sqeId){
    base(this,RenderLayer,[]);
    var s = this;
    s.renderLayer = new RenderLayer();
    s.sprData = spriteData;
    s.curFrm = null;
    s.addChild(s.renderLayer);
    s.curAct = null;
    s.squenceID = 0;
    s.curScale = 1;
    s.swapTiles = null;
    s.swapIds = null;
    if(!actId){
        actId = 0;
    }
    s.setAction(actId,sqeId);
}

p = {
    removeAllSwapTiles:function(){
        var s = this;
        s.removeChild(s.renderLayer);
        s.renderLayer = new RenderLayer();
        s.addChild(s.renderLayer);
        s.swapTiles = null;
        s.swapIds = null;
        s.curFrm = null;
        s.setCurrentFrame();
    },

    nextFrameSwapTiles:function(){
        var s = this;
        if(s.swapIds){
            for(var i = 0; i < s.swapIds.length; i++){
                s.swapTiles[s.swapIds[i]].nextFrame();
            }
        }
    },

    setSwapTilesAction:function(tileID,actId){
        var s = this;
        var spm = s.swapTiles[tileID];
        spm.setAction(actId);
    },

    /**
     * @param ary [tileid,spd,action id]
     */
    setSwapTiles:function(ary){
        var s = this;
        if(LGlobal.traceDebug){
            if(ary.length == 0 || ary.length % 3 != 0){
                return;
            }
        }
        var len = ary.length;
        if(!s.swapTiles){
            s.swapTiles = new Array();
        }
        if(!s.swapIds){
            s.swapIds = new Array();
        }
        for(var i = 0; i < len; ){
            var id = ary[i++];
            var spd = ary[i++];
            var actId = ary[i++];
            if(typeof s.swapTiles[id] == UNDEFINED){
                s.swapIds.push(id);
            }
            var spm = new SpriteModel(spd);
            spm.setAction(actId);
            s.swapTiles[id] = spm;
        }
        s.curFrm = null;
        s.setCurrentFrame();
    },

    setActionTransform:function(trans){
        this.renderLayer.setTransform(trans);
    },

    setActionScale:function(scale){
        var s = this;
        s.curScale = scale;
        s.scaleX = scale;
        s.scaleY = scale;
    },

    setActionRotate:function(angle,rx,ry){
        this.setRotate(angle,rx,ry);
    },

    removeActionRotate:function(){
        var s = this;
        s.rotate = 0;
        s.offsetTransX = 0;
        s.offsetTransY = 0;
        s.updateCoordinate();
    },

    getRect:function(rectId){
        var s = this;
        if(s.curFrm){
            if(rectId < s.curFrm.rectCount){
                var rect = s.curFrm.frmRects[rectId];
                var x,y,w,h;
                if(s.renderLayer.transform > 3){
                    w = rect.height;
                    h = rect.width;
                    x = ((s.renderLayer.transform & 0x1) > 0) ? -(rect.y + w) : rect.y;
                    y = ((s.renderLayer.transform & 0x2) > 0) ? -(rect.x + h) : rect.x;// y
                }
                else{
                    h = rect.height;
                    w = rect.width;
                    x = ((s.renderLayer.transform & 0x2) > 0) ? -(rect.x + w) : rect.x;// x
                    y = ((s.renderLayer.transform & 0x1) > 0) ? -(rect.y + h) : rect.y;// y
                }
                if(s.curScale == 1){
                    return new LRectangle(x,y,w,h);
                }
                else{
                    return new LRectangle(x* s.curScale,y* s.curScale,w* s.curScale,h* s.curScale);
                }
            }
        }
        trace(s.sprData.name+ " rect not find. act:"+ s.curActId);
        return null;
    },

    getPoint:function(pointId){
        var s = this;
        if(s.curFrm){
            if(pointId < s.curFrm.pointCount){
                var point = s.curFrm.frmPoints[pointId];
                var x,y;
                if(s.renderLayer.transform > 3){
                    x = ((s.renderLayer.transform & 0x1) > 0) ? -point.y : point.y;
                    y = ((s.renderLayer.transform & 0x2) > 0) ? -point.x : point.x;// y
                }
                else{
                    x = ((s.renderLayer.transform & 0x2) > 0) ? -point.x : point.x;// x
                    y = ((s.renderLayer.transform & 0x1) > 0) ? -point.y : point.y;// y

                }
                if(s.curScale == 1){
                    return new LPoint(x,y);
                }
                else{
                    return new LPoint(x* s.curScale,y* s.curScale);
                }
            }
        }
        trace(s.sprData.name+ " point not find. act:"+ s.curActId);
        return null;
    },

    getActionCount:function(){
        return this.sprData.actionCount;
    },

    setAction:function(actionId,sqeId){
        var s = this;
        s.curActId = actionId;
        if(sqeId){
            s.squenceID = sqeId;
        }
        else{
            s.squenceID = 0;
        }
        s.curAct = s.sprData.getAction(actionId);
        if(!s.curAct.hasOffsetPoint){
            s.renderLayer.setCoordinate(0,0);
        }
        s.setCurrentFrame();
    },

    nextFrame:function(){
        var s = this;
        if(++s.squenceID >= s.curAct.squenceCount){
            s.squenceID = 0;
        }
        s.setCurrentFrame();
    },

    nextFrameNoLoop:function(){
        var s = this;
        if(s.squenceID < s.curAct.squenceCount - 1){
            s.squenceID++;
            s.setCurrentFrame();
            return false;
        }
        else{
            return true;
        }
    },

    setCurrentFrame:function(){
        var s = this;
        if(s.curFrm){
            var prevFrm = s.curFrm;
            s.curFrm = s.sprData.frames[s.curAct.getFrameId(s.squenceID)];
            if(prevFrm.id != s.curFrm.id){
                s.curFrm.setFrameToRenderLayer(s.renderLayer, s.sprData.tiles, s.swapTiles);
            }
        }
        else{
            s.curFrm = s.sprData.frames[s.curAct.getFrameId(s.squenceID)];
            s.curFrm.setFrameToRenderLayer(s.renderLayer, s.sprData.tiles, s.swapTiles);
        }

        if(s.curAct.hasOffsetPoint){
            var point = s.curAct.getActionOffsetPoint(s.squenceID);
            s.renderLayer.setCoordinate(point.x,point.y);
        }
    }

};
for(var k in p)SpriteModel.prototype[k]=p[k];


























