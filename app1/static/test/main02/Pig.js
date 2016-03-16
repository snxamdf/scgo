function Pig(){
	base(this,LSprite,[]);
	var self = this;
	var bitmap = new LBitmap(new LBitmapData(imglist["pig1"]));
	self.addChild(bitmap);
	self.addBodyCircle(bitmap.getWidth()*0.5,bitmap.getHeight()*0.5,bitmap.getWidth()*0.5,1,.5,.4,.5);
}