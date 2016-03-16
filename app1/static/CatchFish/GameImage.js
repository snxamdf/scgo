/**
 * Created with JetBrains WebStorm.
 * User: Predaking
 * Date: 13-10-30
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */


TRANS_NONE = 0;
TRANS_MIRROR_ROT180 = 1;
TRANS_MIRROR = 2;
TRANS_ROT180 = 3;
TRANS_MIRROR_ROT270 = 4;
TRANS_ROT90 = 5;
TRANS_ROT270 = 6;
TRANS_MIRROR_ROT90 = 7;
TRANS_USE_ACTION_DATA = -1;

function GameImage(image, x, y, w, h) {
    base(this, RenderLayer, []);
    var s = this;
    s.bmp = null;
    s.bakeData = null;
    s.isBmp = true;
    if (image) {
        if (w && h) {
            var bmpData = new LBitmapData(image, x, y, w, h);
            s.bmp = new LBitmap(bmpData);
        }
        else {
            var bmpData = new LBitmapData(image);
            s.bmp = new LBitmap(bmpData);
        }
        s.addChild(s.bmp);
    }
    else {
        if (w && h) {
            s.graphics.drawRect(2, "#000000", [0, 0, w, h]);
            s.bakeData = [x, y, w, h];
        }
        else {
            s.graphics.drawRect(2, "#000000", [0, 0, 10, 10]);
        }
    }
}
p = {
    getWidth: function () {
        if (this.bmp) {
            return this.bmp.width;
        }
        if (this.bakeData) {
            return this.bakeData[2];
        }
        return 0;
    },

    getHeight: function () {
        if (this.bmp) {
            return this.bmp.height;
        }
        if (this.bakeData) {
            return this.bakeData[3];
        }
        return 0;
    },

    scaleImage: function (destW, destH) {
        this.scaleX = destW / this.getWidth();
        this.scaleY = destH / this.getHeight();
    },

    clone: function () {
        var img;
        var s = this;
        if (s.bmp) {
            var bmpData = s.bmp.bitmapData;
            img = new GameImage(bmpData.image, bmpData.x, bmpData.y, bmpData.width, bmpData.height);
        }
        else if (s.bakeData) {
            img = new GameImage(null, s.bakeData[0], s.bakeData[1], s.bakeData[2], s.bakeData[3]);
        }
        else {
            img = new GameImage();
        }
        return img;
    },

    setSpriteModel: function (spm) {
        var s = this;
        s.reset();
        s.removeAllChild();
        s.addChild(spm);
        s.isBmp = false;
    },

    /*
     * 重新设置BMP，只用于spx。
     */
    resetBitmap: function (bitmap) {//!!!!!! bitmap.bitmapData;  is used
        var s = this;
        if (!s.isBmp) {
            s.isBmp = true;
            s.removeAllChild();
            if (s.bmp) {
                s.addChild(s.bmp);
            }
        }
        if (s.bmp) {
            s.bmp.bitmapData = bitmap.bitmapData;
            s.bmp.width = bitmap.width;
            s.bmp.height = bitmap.height;
        }
        else {
            s.die();
            s.bakeData = null;
            s.bmp = new LBitmap(bitmap.bitmapData);
            s.addChild(s.bmp);
        }
    },

    /*
     * 改变BMP的可是区域
     * */
    resetBitmapData: function (x, y, w, h) {
        var s = this;
        if (s.bmp) {
            s.bmp.bitmapData.setProperties(x, y, w, h);
            s.bmp.width = w;
            s.bmp.height = h;
        }
        else {
            s.die();
            s.graphics.drawRect(2, "#000000", [0, 0, w, h]);
            s.bakeData = [x, y, w, h];
        }
    },

    /*
     * 重新设置一个image。
     * */
    resetImage: function (image, x, y, w, h) {
        var s = this;
        if (image == null) {
            return;
        }
        var bmpData;
        if (w && h) {
            bmpData = new LBitmapData(image, x, y, w, h);
        }
        else {
            if (s.bakeData) {
                bmpData = new LBitmapData(image, s.bakeData[0], s.bakeData[1], s.bakeData[2], s.bakeData[3]);
            }
            else {
                bmpData = new LBitmapData(image);
            }
        }
        s.bakeData = null;
        if (s.bmp) {
            s.bmp.bitmapData = bmpData;
            s.bmp.width = bmpData.width;
            s.bmp.height = bmpData.height;
        }
        else {
            s.bmp = new LBitmap(bmpData);
            s.die();
            s.addChild(s.bmp);
        }
    },

    setTransformLeftTop: function (trans) {
        this.transform = trans;
        this.updateTransformLeftTop();
    },

    updateTransformLeftTop: function () {
        var s = this;
        switch (s.transform) {
            case TRANS_NONE:
                s.scaleX = 1;
                s.scaleY = 1;
                s.rotate = 0;
                s.offsetTransX = 0;
                s.offsetTransY = 0;
                break;
            case TRANS_MIRROR_ROT180:
                s.scaleX = 1;
                s.scaleY = -1;
                s.rotate = 0;
                s.offsetTransX = 0;
                s.offsetTransY = s.bmp.height;
                break;
            case TRANS_MIRROR:
                s.scaleX = -1;
                s.scaleY = 1;
                s.rotate = 0;
                s.offsetTransX = s.bmp.width;
                s.offsetTransY = 0;
                break;
            case TRANS_ROT180:
                s.scaleX = 1;
                s.scaleY = 1;
                s.rotate = 180;
                s.offsetTransX = s.bmp.width;
                s.offsetTransY = s.bmp.height;
                break;
            case TRANS_MIRROR_ROT270:
                s.scaleX = -1;
                s.scaleY = 1;
                s.rotate = 270;
                s.offsetTransX = 0;
                s.offsetTransY = 0;
                break;
            case TRANS_ROT90:
                s.scaleX = 1;
                s.scaleY = 1;
                s.rotate = 90;
                s.offsetTransX = s.bmp.width;
                s.offsetTransY = 0;
                break;
            case TRANS_ROT270:
                s.scaleX = 1;
                s.scaleY = 1;
                s.rotate = 270;
                s.offsetTransX = 0;
                s.offsetTransY = s.bmp.height;
                break;
            case TRANS_MIRROR_ROT90:
                s.scaleX = -1;
                s.scaleY = 1;
                s.rotate = 90;
                s.offsetTransX = s.bmp.width;
                s.offsetTransY = s.bmp.height;
                break;
        }
        s.updateCoordinate();
    }


};
for (var k in p)GameImage.prototype[k] = p[k];

function RenderLayer() {
    base(this, LSprite, []);
    var s = this;
    s.mouseChildren = false;
    s.offsetX = 0;
    s.offsetY = 0;
    s.offsetTransX = 0;
    s.offsetTransY = 0;
    s.x = 0;
    s.y = 0;
    s.transform = TRANS_NONE;
}

p = {
    setCoordinate: function (x, y, isUseInt) {
        var s = this;
        s.offsetX = x;
        s.offsetY = y;
        s.updateCoordinate(isUseInt);
    },
    setCoordinateX: function (x, isUseInt) {
        var s = this;
        s.offsetX = x;
        if (isUseInt) {
            s.x = EMath.getInt(s.offsetX + s.offsetTransX);
        }
        else {
            s.x = s.offsetX + s.offsetTransX;
        }
    },
    setCoordinateY: function (y, isUseInt) {
        var s = this;
        s.offsetY = y;
        if (isUseInt) {
            s.y = EMath.getInt(s.offsetY + s.offsetTransY);
        }
        else {
            s.y = s.offsetY + s.offsetTransY;
        }
    },
    moveCoordinate: function (offX, offY, isUseInt) {
        var s = this;
        s.offsetX += offX;
        s.offsetY += offY;
        s.updateCoordinate(isUseInt);
    },
    updateCoordinate: function (isUseInt) {
        var s = this;
        if (isUseInt) {
            s.x = EMath.getInt(s.offsetX + s.offsetTransX);
            s.y = EMath.getInt(s.offsetY + s.offsetTransY);
        }
        else {
            s.x = s.offsetX + s.offsetTransX;
            s.y = s.offsetY + s.offsetTransY;
        }
    },
    reset: function () {
        var s = this;
        s.offsetX = 0;
        s.offsetY = 0;
        s.setTransform(TRANS_NONE);
        s.alpha = 1;
    },
    setRotate: function (angle, x, y) {
        var s = this;
        s.rotate = angle;
        if (!x) {
            x = 0;
        }
        if (!y) {
            y = 0;
        }

        var r = Math.sqrt(x * x + y * y);
        if (r != 0) {
            var detX = -x;
            var asinx = Math.asin(-y / r);
            if (detX < 0) {
                asinx = Math.PI - asinx;
            }
            var paramAngle = (angle * Math.PI / 180) + asinx;
            detX = r * Math.cos(paramAngle);
            s.offsetTransX = x + detX;
            var detY = r * Math.sin(paramAngle);
            s.offsetTransY = y + detY;
            s.updateCoordinate();
        }
    },
    setTransform: function (trans, centerX, centerY) {
        this.transform = trans;
        this.updateTransform(centerX, centerY);
    },
    updateTransform: function (centerX, centerY) {
        var s = this;
        if (!centerX) {
            centerX = 0;
        }
        if (!centerY) {
            centerY = 0;
        }
        switch (s.transform) {
            case TRANS_NONE:
                s.scaleX = 1;
                s.scaleY = 1;
                s.rotate = 0;
                s.offsetTransX = 0;
                s.offsetTransY = 0;
                break;
            case TRANS_MIRROR_ROT180:
                s.scaleX = 1;
                s.scaleY = -1;
                s.rotate = 0;
                s.offsetTransX = 0;
                s.offsetTransY = centerY + centerY;
                break;
            case TRANS_MIRROR:
                s.scaleX = -1;
                s.scaleY = 1;
                s.rotate = 0;
                s.offsetTransX = centerX + centerX;
                s.offsetTransY = 0;
                break;
            case TRANS_ROT180:
                s.scaleX = 1;
                s.scaleY = 1;
                s.rotate = 180;
                s.offsetTransX = centerX + centerX;
                s.offsetTransY = centerY + centerY;
                break;
            case TRANS_MIRROR_ROT270:
                s.scaleX = -1;
                s.scaleY = 1;
                s.rotate = 270;
                s.offsetTransX = centerX - centerY;
                s.offsetTransY = centerY - centerX;
                break;
            case TRANS_ROT90:
                s.scaleX = 1;
                s.scaleY = 1;
                s.rotate = 90;
                s.offsetTransX = centerX + centerY;
                s.offsetTransY = centerY - centerX;
                break;
            case TRANS_ROT270:
                s.scaleX = 1;
                s.scaleY = 1;
                s.rotate = 270;
                s.offsetTransX = centerX - centerY;
                s.offsetTransY = centerX + centerY;
                break;
            case TRANS_MIRROR_ROT90:
                s.scaleX = -1;
                s.scaleY = 1;
                s.rotate = 90;
                s.offsetTransX = centerX + centerY;
                s.offsetTransY = centerX + centerY;
                break;
        }
        s.updateCoordinate();
    }
};
for (var k in p)RenderLayer.prototype[k] = p[k];

















