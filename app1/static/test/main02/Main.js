var loadingLayer;
var backLayer;
var wallLayer;
var bird,centerlayer;
var bitmap,slingshotJoin;
var imglist = {};
var imgData = new Array(
		{name:"bird1",path:"./images/bird1.png"},
		{name:"slingshot1",path:"./images/slingshot1.png"},
		{name:"slingshot2",path:"./images/slingshot2.png"},
		{name:"pig1",path:"./images/pig1.png"},
		{name:"stage01",path:"./images/stage01.png"},
		{name:"stage02",path:"./images/stage02.png"},
		{name:"stage03",path:"./images/stage03.png"},
		{name:"stage04",path:"./images/stage04.png"}
		);
var startX,startY;
function main(){
	backLayer = new LSprite();	
	addChild(backLayer);	
	
	loadingLayer = new LoadingSample3();
	backLayer.addChild(loadingLayer);	
	LLoadManage.load(
		imgData,
		function(progress){
			loadingLayer.setProgress(progress);
		},
		function(result){
			imglist = result;
			backLayer.removeChild(loadingLayer);
			loadingLayer = null;
			gameInit();
		}
	);
}
function gameInit(event){
	LGlobal.box2d = new LBox2d();
	var back = new LSprite();
	back.alpha = 0.1;
	backLayer.addChild(back);
	back.graphics.drawRect(1,"#ffffff",[0, 0, 1600, 480]);
	
	wallLayer = new LSprite();
	wallLayer.y = 480;
	backLayer.addChild(wallLayer);
	wallLayer.addBodyPolygon(1600,10,0);
	backLayer.graphics.drawRect(1,"#ffffff",[0, 475, 1600, 5],true,"#000000");
	
	bitmap = new LBitmap(new LBitmapData(imglist["slingshot1"]));
	bitmap.x = 215;
	bitmap.y = 290;
	backLayer.addChild(bitmap);
	
	bird = new LSprite();
	bird.name = "bird01";
	backLayer.addChild(bird);
	bitmap = new LBitmap(new LBitmapData(imglist["bird1"]));
	bird.addChild(bitmap);
	
	bitmap = new LBitmap(new LBitmapData(imglist["slingshot2"]));
	bitmap.x = 190;
	bitmap.y = 290;
	backLayer.addChild(bitmap);
	
	setStage("stage03",1070,430,0,10);
	setStage("stage01",995,300,90,1);
	setStage("stage01",1140,300,90,1);
	setStage("stage02",1070,200,0,1.5);
	setStage("stage04",1090,200,0,2);
	var pig = new Pig();
	pig.x = 1150;
	pig.y = 400;
	backLayer.addChild(pig);
	
	backLayer.x = LGlobal.width - 1600;
	LGlobal.box2d.synchronous();
	
	LTweenLite.to(backLayer,1,
		{ 
			x:0,
			delay:2,
			onUpdate:function(){
				LGlobal.box2d.synchronous();
			},
			onComplete:run,
			ease:Sine.easeIn
		}
	);
}
function run(){
	bird.rotate = 0;
	bird.x = 300;
	bird.y = 430;
	bird.yspeed = -5;
	LTweenLite.to(bird,1,
		{ 
			x:200,
			yspeed:5,
			delay:1,
			rotate:-360,
			onUpdate:function(){
				bird.y += bird.yspeed;
			},
			onComplete:function(){
				start();
			},
			ease:Sine.easeIn
		}
	);
}

function downStart(event){
	if(event.offsetX > bird.x && event.offsetX < bird.x + bird.getWidth() && 
		event.offsetY > bird.y && event.offsetY < bird.y + bird.getHeight()){
		backLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,downStart);
		backLayer.addEventListener(LMouseEvent.MOUSE_MOVE,downMove);
		backLayer.addEventListener(LMouseEvent.MOUSE_UP,downOver);
	}
}
function downOver(event){
	backLayer.removeEventListener(LMouseEvent.MOUSE_UP,downOver);
	backLayer.removeEventListener(LMouseEvent.MOUSE_MOVE,downMove);
	
	var startX2 = bird.x + bird.getWidth()*0.5;
	var startY2 = bird.y + bird.getHeight()*0.5;
	var r = Math.sqrt(Math.pow((startX - startX2),2)+Math.pow((startY - startY2),2));
	var angle = Math.atan2(startY2 - startY,startX2 - startX);
	
	bird.addBodyCircle(bird.getWidth()*0.5,bird.getHeight()*0.5,bird.getWidth()*0.5,1,.5,.4,.5);
	var force = 7;
	var vec = new LGlobal.box2d.b2Vec2(-force*r*Math.cos(angle),-force*r*Math.sin(angle));
	bird.box2dBody.ApplyForce(vec, bird.box2dBody.GetWorldCenter());
	
	backLayer.addEventListener(LEvent.ENTER_FRAME,onframe);
}
function downMove(event){
	var r = Math.sqrt(Math.pow((startX - event.selfX),2)+Math.pow((startY - event.selfY),2));
	if(r > 100)r = 100;
	var angle = Math.atan2(event.selfY - startY,event.selfX - startX);
	bird.x = Math.cos(angle) * r + startX - bird.getWidth()*0.5;
	bird.y = Math.sin(angle) * r + startY - bird.getHeight()*0.5;
}
function start(){
	bird.x = 200,bird.y = 320;
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,downStart);
	startX = bird.x + bird.getWidth()*0.5;
	startY = bird.y + bird.getHeight()*0.5;
}
function onframe(){
	backLayer.x = LGlobal.width*0.5 - (bird.x + bird.getWidth()*0.5);	
	if(backLayer.x > 0){
		backLayer.x=0;
	}else if(backLayer.x < LGlobal.width - 1600){
		backLayer.x = LGlobal.width - 1600;
	}
	LGlobal.box2d.synchronous();
	if(bird && (bird.x < -bird.getWidth() || bird.x > backLayer.getWidth())){
		backLayer.removeChild(bird);
		bird = null;
	}
}
function setStage(img,x,y,rotate,m){
	var stageLayer = new LSprite();
	backLayer.addChild(stageLayer);
	var bitmap = new LBitmap(new LBitmapData(imglist[img]));
	stageLayer.addChild(bitmap);
	stageLayer.x = x;
	stageLayer.y = y;
	stageLayer.addBodyPolygon(bitmap.getWidth(),bitmap.getHeight(),1,m,.4,.2);
	if(rotate != 0)stageLayer.setRotate(rotate*Math.PI/180);
}
