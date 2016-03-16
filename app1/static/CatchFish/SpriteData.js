/**
 * Created with JetBrains WebStorm.
 * User: Predaking
 * Date: 13-11-8
 * Time: 下午5:11
 * To change this template use File | Settings | File Templates.
 */

function SpriteData(image,data){
    var s = this;
    s.tiles = new Array();
    s.frames = new Array();
    s.actions = new Array();
    s.load(image,data);
}

SpriteData.prototype = {
    load:function(img,d){
        var s = this;
        var i = 0;
        s.name = d[i++];
        s.tileCount = d[i++];
        s.hasTileMask = (d[i++] == 1)?true:false;
        if(!img){
            trace(s.name+" image error.");
        }
        for(var j = 0; j < s.tileCount; j++){
            var x = d[i++];
            var y = d[i++];
            var w = d[i++];
            var h = d[i++];
            var mask = s.hasTileMask?(d[i++]):0;
            tile = new Tile(j,img,x,y,w,h,mask);
            s.tiles.push(tile);
        }
        s.frameCount = d[i++];
        for(var j = 0; j < s.frameCount; j++){
            var frm = new Frame(j);
            i = frm.init(d,i);
            s.frames.push(frm);
        }
        s.actionCount = d[i++];
        for(var j = 0; j < s.actionCount; j++){
            var act = new Action(j);
            i = act.init(d,i);
            s.actions.push(act);
        }
    },

    getFrameId:function(actId,sqeId){
        var s = this;
        if(LGlobal.traceDebug){
            if(actId >= s.actionCount){
                trace(s.name+" has error in getFrameId.get act id is "+actId+" >= action count: " + s.actionCount);
                return -1;
            }
        }
        return s.actions[actId].getFrameId(sqeId);
    },

    getAction:function(actId){
        var s = this;
        if(LGlobal.traceDebug){
            if(actId >= s.actionCount){
                trace(s.name+" has error in getAction.get act id is "+actId+" >= action count: " + s.actionCount);
                return null;
            }
        }
        return s.actions[actId];
    },

    getRect:function(frmId,rectId){
        var s = this;
        var rect = s.frames[frmId].frmRects[rectId];
        return rect.clone();
    },

    getPoint:function(frmId,pointId){
        var s = this;
        var rect = s.frames[frmId].frmPoints[pointId];
        return rect.clone();
    }
};


function Action(id){
    var s = this;
    s.id = id;
    s.squences = new Array();
    s.offsetPoints = null;
}
Action.prototype = {
    init:function(d,i){
        var s = this;
        s.squenceCount = d[i++];
        s.hasOffsetPoint = (d[i++] == 1)?true:false;
        s.actionTransform = d[i++];
        for(var j = 0; j < s.squenceCount; j++){
            s.squences.push(d[i++]);
        }
        if(s.hasOffsetPoint){
            s.offsetPoints = new Array();
            for(var j = 0; j < s.squenceCount; j++){
                var x = d[i++];
                var y = d[i++];
                s.offsetPoints.push(new LPoint(x,y));
            }
        }
        return i;
    },

    getFrameId:function(sqeId){
        var s = this;
        if(LGlobal.traceDebug){
            if(sqeId >= s.squenceCount){
                trace(s.name+" has error.get squence id is "+sqeId+" >= squence count: " + s.squenceCount);
                return -1;
            }
        }
        return s.squences[sqeId];
    },

    getActionOffsetPoint:function(sqeId){
        var s = this;
        if(s.hasOffsetPoint){
            return s.offsetPoints[sqeId];
        }
        return null;
    }
}

function Frame(id){
    var s = this;
    s.id = id;
    s.frmTiles = new Array();
    s.frmRects = new Array();
    s.frmPoints = new Array();
}

Frame.prototype = {
    init:function(d,i){
        var s = this;
        s.tileCount = d[i++];
        s.rectCount = d[i++];
        s.pointCount = d[i++];
        s.mask = d[i++];
        s.left = d[i++];
        s.top = d[i++];
        s.bottom = d[i++];
        s.right = d[i++];
        for(var j = 0; j < s.tileCount; j++){
            var tileId = d[i++];
            var tileOffsetX = d[i++];
            var tileOffsetY = d[i++];
            var tileTrans = d[i++];
            var frmTile = new FrameTileData(tileId,tileOffsetX,tileOffsetY,tileTrans);
            s.frmTiles.push(frmTile);
        }
        for(var j = 0; j < s.rectCount; j++){
            var x = d[i++];
            var y = d[i++];
            var w = d[i++];
            var h = d[i++];
            var rect = new LRectangle(x,y,w,h);
            s.frmRects.push(rect);
        }
        for(var j = 0; j < s.pointCount; j++){
            var x = d[i++];
            var y = d[i++];
            var point = new LPoint(x,y);
            s.frmPoints.push(point);
        }
        return i;
    },

    setFrameToRenderLayer:function(rl,tiles,swapTiles){
        var s = this;
        var ary = rl.childList;
        var len = ary.length;
        var i = 0;
        if(swapTiles){
            for(var j = 0; j < s.tileCount; j++){
                var ft = s.frmTiles[j];
                var img;
                if(i >= len){
                    img = new GameImage();
                    rl.addChild(img);
                    len = ary.length;
                }
                else{
                    img = ary[i];
                }
                img.visible = true;
                if(typeof swapTiles[ft.tileId] != UNDEFINED){
                    var spm = swapTiles[ft.tileId];
                    img.setSpriteModel(spm);
                    var tileBmp = tiles[ft.tileId].bmp;
                    var tx,ty;
                    if(ft.tileTransform > 3){
                        tx = ((ft.tileTransform & 0x1) > 0)?ft.tileOffsetX+tileBmp.height:ft.tileOffsetX;
                        ty = ((ft.tileTransform & 0x2) > 0)?ft.tileOffsetY+tileBmp.width:ft.tileOffsetY;
                    } else{
                        tx = ((ft.tileTransform & 0x2) > 0)?ft.tileOffsetX+tileBmp.width:ft.tileOffsetX;
                        ty = ((ft.tileTransform & 0x1) > 0)?ft.tileOffsetY+tileBmp.height:ft.tileOffsetY;
                    }
                    spm.setActionTransform(ft.tileTransform);
                    spm.setCoordinate(tx,ty);
                } else{
                    img.resetBitmap(tiles[ft.tileId].bmp);
                    img.setTransformLeftTop(ft.tileTransform);
                    img.setCoordinate(ft.tileOffsetX,ft.tileOffsetY);
                }
                i++;
            }
        }
        else{
            for(var j = 0; j < s.tileCount; j++){
                var ft = s.frmTiles[j];
                var img;
                if(i >= len){
                    img = new GameImage();
                    rl.addChild(img);
                    len = ary.length;
                }
                else{
                    img = ary[i];
                }
                img.visible = true;
                img.resetBitmap(tiles[ft.tileId].bmp);
                img.setTransformLeftTop(ft.tileTransform);
                img.setCoordinate(ft.tileOffsetX,ft.tileOffsetY);
                i++;
            }
        }
        if(i < len){
            for(var j = i; j < len; j++){
                ary[j].visible = false;
            }
        }
    }

}

function Tile(id,image,x,y,w,h,mask){
    var s = this;
    s.id = id;
    var bmpData = new LBitmapData(image,x,y,w,h);
    s.bmp = new LBitmap(bmpData);
    s.mask = mask;
}

function FrameTileData(id,x,y,tf){
    var s = this;
    s.tileId = id;
    s.tileOffsetX = x;
    s.tileOffsetY = y;
    s.tileTransform = tf;
}
