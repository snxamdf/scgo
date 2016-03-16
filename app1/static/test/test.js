(function(){
	if(LGlobal.canTouch){
		LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
		LSystem.screen(LStage.FULL_SCREEN);
	}
	console.log(LGlobal.stageScale);
	console.log(LStage.FULL_SCREEN);

	LInit(30,"legend",920,480,main);

	var loadingLayer;
	var backLayer;
	var graphicsMap;
	var loadIndex = 0;
	var imglist = {};
	var imgData = new Array({name:"n1",path:"/static/test/f0.png"},{name:"b0",path:"/static/test/00.png"},{name:"b1",path:"/static/test/f0.png"},{name:"b10",path:"/static/test/ff.png"});

	function main(){
		loadingLayer = new LoadingSample1();
		addChild(loadingLayer);
		LLoadManage.load(
			imgData,
			function(progress){
				loadingLayer.setProgress(progress);
			},
			function(result){
				//console.log(result)
				imglist = result;
				removeChild(loadingLayer);
				loadingLayer = null;
				gameInit();
			}
		);
	}
	function gameInit(){
		backLayer = new LSprite();
		backLayer.graphics.drawRect(1,"black",[0, 0, 320, 480],true,"#cccccc");
		addChild(backLayer);
		var title = new LTextField();
		title.x = 100;
		title.y = 100;
		title.size = 14;
		title.text = "tetris";
		backLayer.addChild(title);
		//console.log(backLayer.graphics);
		var startBtn = addButton("start",110,30,40,5);
		startBtn.x = 80;
		startBtn.y = 300;
		backLayer.addChild(startBtn);
		startBtn.addEventListener(LMouseEvent.MOUSE_DOWN, toStart);
	}
	function addButton(lbl,w,h,x,y){
		var up = new LSprite();
		up.graphics.drawRect(1,"black",[0, 0, w, h],true,"#999999");
		var txt = new LTextField();
		txt.x = x;
		txt.y = y;
		txt.text = lbl;
		up.addChild(txt);

		var over = new LSprite();
		over.graphics.drawRect(1,"black",[0, 0, w, h],true,"#cccccc");
		var txt1 = new LTextField();
		txt1.x = x;
		txt1.y = y;
		txt1.text = lbl;
		over.addChild(txt1);

		var btn = new LButton(up,over);
		return btn;
	}
	function toStart(){
        backLayer.removeAllChild();
        backLayer.die();

		var startBtn = addButton("add",110,30,40,5);
		startBtn.x = 800;
		startBtn.y = 300;
		backLayer.addChild(startBtn);
		startBtn.addEventListener(LMouseEvent.MOUSE_DOWN, add);

		LGlobal.setDebug(true);
	    //LGlobal.box2d = new LBox2d([0,0]);
		LGlobal.box2d = new LBox2d();

		add();

		var wallLayer = new LSprite();
	    wallLayer.x = 400;
	    wallLayer.y = 0;
	    wallLayer.addBodyPolygon(800,1,0);
	    backLayer.addChild(wallLayer);

		wallLayer = new LSprite();
	    wallLayer.x = 0;
	    wallLayer.y = 0;
	    wallLayer.addBodyPolygon(1,800,0);
	    backLayer.addChild(wallLayer);


		wallLayer = new LSprite();
	    wallLayer.x = 400;
	    wallLayer.y = 400;
	    wallLayer.addBodyPolygon(800,1,0);
	    backLayer.addChild(wallLayer);


		wallLayer = new LSprite();
	    wallLayer.x = 800;
	    wallLayer.y = 200;
	    wallLayer.addBodyPolygon(1,400,0);
	    backLayer.addChild(wallLayer);
	}
	function add(){
	    var stageLayer = new LSprite();
	    addChild(stageLayer);
		var child1 = new LSprite();
		child1.x = 100;
		child1.y = 100;
        var bitmap = new LBitmap(new LBitmapData(imglist["n1"]));
		child1.addBodyCircle(bitmap.getWidth()*0.5,bitmap.getHeight()*0.5,bitmap.getWidth()*0.5,1,5,0.4,0.13);
		child1.setBodyMouseJoint(true);
        child1.addChild(bitmap);

		stageLayer.addChild(child1);
	}
})();