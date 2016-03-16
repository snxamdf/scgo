$(function(){
	"use strict";
	var tetris={
		keyboard:{left:0,up:0,right:0,down:0,space:0},
		canva:{row:0,grid:0},
		nextShape:{randomNum:0,shapeArray:[]},
		nowShape:{randomNum:0,shapeArray:[]}
	};
	tetris.keyboard.left=37;
	tetris.keyboard.up=38;
	tetris.keyboard.right=39;
	tetris.keyboard.down=40;
	tetris.keyboard.space=32;
	tetris.canva.row=18;
	tetris.canva.grid=18;
	tetris.autoSleep=500;
	tetris.shapeArrayIndex=0;//默认开始从哪个数组
	
	tetris.objects=new Array();//画布数组对象
	tetris.nextobjects=new Array();//展示一下个数组对象
	tetris.objectsLength=0;//画布数组对象 长度
	tetris.autoGridIndexs=[];//当前画布移动的对象坐标
	
	tetris.keyboardExecute=true;
	
	tetris.obj=function(){//获得对象
		return $("#canvasLeft");
	};
	
	tetris.canvas=function(x,y,array,obj,clas){//生成格
		var sum=0;
		for(var j=0;j<x;j++){//行
			for(var i=0;i<y;i++){//格
				var div=$("<div/>");
				div.addClass(clas);
				div.html("&nbsp;");
				div.attr({id:j+"_"+i});
				if(i==0){
					div.attr("place","first");//当前行第一个
				}else if(i==y-1){
					div.attr("place","last");//当前行最后一个
				}else{
					div.attr("place","centre");//当前行中间区域
				}
				div.css("height","30px");
				obj.append(div);
				if(array!=null){
					array.push(div);
				}
			}
			var div=$("<div/>");
			div.addClass("gridClean");
			obj.append(div);
		}
		tetris.objectsLength=tetris.objects.length;
	};
	tetris.canvas(tetris.canva.row,tetris.canva.grid,tetris.objects,$("#canvasLeft"),"gridLeft");//生成格
	tetris.canvas(6,6,tetris.nextobjects,$("#next"),"gridRight");//生成格下一个
	
	tetris.isMaxLeft=function(){//判断下次移动的位置是不是最左边或是已停止的格 gridLeftColorStop
		var resBool=true;
		for(var i=0;i<tetris.autoGridIndexs.length;i++){
			var index=tetris.autoGridIndexs[i];
			var o=tetris.objects[index];
			var id=o.attr("id");
			var rowAndGrid=id.split("_");
			var gridIndex=rowAndGrid[1]-1;
			var grid=tetris.objects[tetris.getGridXY(rowAndGrid[0],gridIndex)];
			var stop=grid.attr("class");
			if(gridIndex<0||stop=="gridLeftColorStop"){
				resBool=false;
				return ;
			}
		}
		return resBool;
	};
	
	tetris.isMaxRight=function(){//判断下次移动的位置是不是最右边或是已停止的格 gridLeftColorStop
		var resBool=true;
		for(var i=0;i<tetris.autoGridIndexs.length;i++){
			var index=tetris.autoGridIndexs[i];
			var o=tetris.objects[index];
			var id=o.attr("id");
			var rowAndGrid=id.split("_");
			var gridIndex=rowAndGrid[1]-0+1;
			var grid=tetris.objects[tetris.getGridXY(rowAndGrid[0],gridIndex)];
			var stop=grid.attr("class");
			if(gridIndex>=tetris.canva.grid||stop=="gridLeftColorStop"){
				resBool=false;
				return ;
			}
		}
		return resBool;
	};
	
	tetris.isMaxBottom=function(){//判断下次移动的位置是不是最下边或是已停止的格 gridLeftColorStop
		var resBool=true;
		for(var i=0;i<tetris.autoGridIndexs.length;i++){
			var index=tetris.autoGridIndexs[i];
			var o=tetris.objects[index];
			var id=o.attr("id");
			var rowAndGrid=id.split("_");
			var gridRow=rowAndGrid[0]-0+1;
			if(gridRow>=tetris.canva.row){
				resBool=false;
				return resBool;
			}
			var grid=tetris.objects[tetris.getGridXY(gridRow,rowAndGrid[1])];
			var stop=grid.attr("class");
			if(stop=="gridLeftColorStop"){
				resBool=false;
				return ;
			}
		}
		return resBool;
	};
	
	tetris.randomNum=function(){//随机生成一个数字
		var randomNum = Math.random()*7;
		randomNum=parseInt(randomNum,10);
		return randomNum;
	};
		
	tetris.genNextShape=function(){//获取下一个形状
		if(tetris.nowShape.shapeArray.length==0){
			var randomNum=tetris.randomNum();//获得随机数
			var shapeArray=tetris.shapeArray(tetris.shapeArrayIndex)[randomNum];//获得二维数组图形
			tetris.nowShape.randomNum=randomNum;
			tetris.nowShape.shapeArray=shapeArray;
		}else{
			tetris.nowShape.randomNum=tetris.nextShape.randomNum;
			tetris.nowShape.shapeArray=tetris.nextShape.shapeArray;
		}
		var randomNum=tetris.randomNum();//获得随机数
		var shapeArray=tetris.shapeArray(tetris.shapeArrayIndex)[randomNum];//获得二维数组图形
		tetris.nextShape.randomNum=randomNum;
		tetris.nextShape.shapeArray=shapeArray;
	};
	
	tetris.resetGridColorByStop=function(){//删除带颜色的Grid
		for(var i=0;i<tetris.autoGridIndexs.length;i++){
			var index=tetris.autoGridIndexs[i];
			var gridObjs=tetris.objects[index];
			gridObjs.removeClass("gridLeftColor");
			gridObjs.addClass("gridLeftColorStop");
		}
	};
	
	tetris.removeGridColor=function(){//删除带颜色的Grid
		var gridObjs=$(".gridLeftColor");
		gridObjs.removeClass("gridLeftColor");
		gridObjs.addClass("gridLeft");
	};
	
	tetris.checkGrid=function(){//检查下一个是否为结束
		for(var i=0;i<tetris.autoGridIndexs.length;i++){
			var index=tetris.autoGridIndexs[i];
			var o=tetris.objects[index];
			var id=o.attr("id");
			var rowAndGrid=id.split("_");
			var xy=tetris.getGridXY(rowAndGrid[0]+1,rowAndGrid[1]+1);
			if(xy>=tetris.objectsLength){
				return false;
			}
			var grid=tetris.objects[tetris.getGridXY(rowAndGrid[0]+1,rowAndGrid[1]+1)];
			if(grid.attr("class")=="gridLeftColorStop"){
				return true;
			}
		}
		return false;
	};
	
	tetris.timeId=0;//时间id
	
	tetris.startRow=-1;//起始行
	tetris.startGrid=tetris.canva.grid/2-1;//起始列
	tetris.nowStartRow=0;//当前行
	tetris.nowStartGrid=0;//当前列
	tetris.arrayIndex=0;//旋转图形标识 0~3
	
	tetris.clearTime=function(){//清除时间监控
		clearInterval(tetris.timeId);
	};
	
	tetris.run=true;
	tetris.dispose=function(){//处理形状
		if(tetris.checkGrid()){
			tetris.run=false;
			tetris.stop();
			tetris.lose();
			return;
		}
		if(tetris.run){
			tetris.arrayIndex=0;
			var tmpStartGrid=tetris.startGrid;//存放格起始位置
			tetris.genNextShape();
			tetris.next();
			tetris.nowStartRow=tetris.startRow;
			tetris.nowStartGrid=tetris.startGrid;
			tetris.startAuto();
		}
	};
	
	tetris.next=function(){//展示下一个图形
		var gridObjs=$(".gridRightColor");
		gridObjs.removeClass("gridRightColor");
		gridObjs.addClass("gridRight");
		var startRow=1;
		var startGrid=0;
		var tmpStartGrid=startGrid;
		var shapeArray=tetris.nextShape.shapeArray;//获得二维数组图形
		for(var i=1;i<=shapeArray.length;i++){
			startGrid++;
			if(shapeArray[i-1]==1){
				var xy=tetris.getNextGridXY(startRow,startGrid);
				var grid=tetris.nextobjects[xy];
				grid.removeClass("gridRight");
				grid.addClass("gridRightColor");
			}
			if(i%4==0){
				startRow++;
				startGrid=tmpStartGrid;
			}
		}
	};
	
	tetris.startAuto=function(){//自动执行
		var oldAutoTime=0;
		tetris.timeId=setInterval(function(){
			var date=new Date();
			tetris.keyleftbool=true;
			tetris.auto();
			tetris.nowStartRow++;
		},tetris.autoSleep);
	};
	
	tetris.getNextGridXY=function(x,y){
		var r=x*6+(y-0);
		return r;
	};
	
	tetris.getGridXY=function(x,y){
		var r=x*tetris.canva.grid+(y-0);
		return r;
	};
	
	tetris.auto=function(){//自动下移
		setTimeout(function(){
			var startRow=tetris.nowStartRow;
			if(startRow<tetris.canva.row){
				var startGrid=tetris.nowStartGrid;
				var shapeArray=tetris.nowShape.shapeArray;//获得二维数组图形
				tetris.removeGridColor();
				var tmpStartGrid=startGrid;//存放格起始位置
				var autoGridIndexs=0;
				for(var i=1;i<=shapeArray.length;i++){
					startGrid++;
					if(shapeArray[i-1]==1){
						var xy=tetris.getGridXY(startRow,startGrid);
						var grid=tetris.objects[xy];
						grid.removeClass("gridLeft");
						grid.addClass("gridLeftColor");
						tetris.autoGridIndexs[autoGridIndexs]=xy;
						autoGridIndexs++;
					}
					if(i%4==0){
						startRow++;
						startGrid=tmpStartGrid;
					}
				}
			}
			if(!tetris.isMaxBottom()&&tetris.keyboardExecute){//判断是否到低部或遇到停止的grid
				tetris.clearTime();
				tetris.keyboardExecute=false;
				setTimeout(function(){
					setTimeout(function(){
						tetris.resetGridColorByStop();
						setTimeout(function(){
							tetris.eliminate();
							setTimeout(function(){
								tetris.dispose();
								tetris.keyboardExecute=true;
							},1);
						},1);
					},1);
				},150);
			}
		},1);
	};
	
	tetris.lose=function(){
		if(tetris.run==false){
			$("#lose").show();
		}
	};
	
	tetris.score=0;
	tetris.eliminate=function(){//消除
		var rows = new Array();
		for(var i=0;i<tetris.autoGridIndexs.length;i++){
			var index=tetris.autoGridIndexs[i];
			var o=tetris.objects[index];
			var id=o.attr("id");
			var strs=id.split("_");
			rows.push(strs[0]);
		}
		rows=tetris.unique(rows);//去重获得行
		for(var i=0;i<rows.length;i++){
			var bool=true;
			for(var j=0;j<tetris.canva.grid;j++){
				var grid=tetris.objects[tetris.getGridXY(rows[i],j)];
				var clas=grid.attr("class");
				if(clas=="gridLeft"){
					bool=false;
					break;
				}
			}
			var pid=0;
			if(bool){//当前行可以消除
				for(var j=0;j<tetris.canva.grid;j++){
					var grid=tetris.objects[tetris.getGridXY(rows[i],j)];
					grid.removeClass("gridLeftColorStop");
					grid.addClass("gridLeft");
					if(j==0){
						pid=grid.attr("id");
					}
				}
				tetris.score=tetris.score+i;
			}
			tetris.eliminateMove(pid);//消除后移动
		}
		$("#score").html(tetris.score);
	};
	
	tetris.eliminateMove=function(pid){//消除后移动
		if(pid!=0){
			var id=pid;
			var str=id.split("_");
			var row=str[0];
			var grid=str[1];
			var xy=tetris.getGridXY(row,grid);
			for(var i=xy;i>=0;i--){
				var o=tetris.objects[i];
				var stop=o.attr("class");
				if(stop=="gridLeftColorStop"){
					o.removeClass("gridLeftColorStop");
					o.addClass("gridLeft");
					var tid=o.attr("id");
					var tstr=tid.split("_");
					var trow=tstr[0]-0+1;
					var tgrid=tstr[1];
					var txy=tetris.getGridXY(trow,tgrid);
					var to=tetris.objects[txy];
					to.removeClass("gridLeft");
					to.addClass("gridLeftColorStop");
				}
			}
		}
	};
	
	tetris.unique=function(arr){//数组去重
		var result = [], hash = {};
	    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
	        if (!hash[elem]) {
	            result.push(elem);
	            hash[elem] = true;
	        }
	    }
	    return result;
	};
	
	tetris.keyLeft=function(){//左
		if(tetris.isMaxLeft()&&tetris.keyboardExecute){
			for(var i=0;i<tetris.autoGridIndexs.length;i++){
				var index=tetris.autoGridIndexs[i];
				var o=tetris.objects[index];
				var id=o.attr("id");
				var rowAndGrid=id.split("_");
				var gridIndex=rowAndGrid[1]-1;
				var newGrid=tetris.objects[tetris.getGridXY(rowAndGrid[0],gridIndex)];
				newGrid.addClass("gridLeftColor");
				o.removeClass("gridLeftColor");
				o.addClass("gridLeft");
			}
			tetris.nowStartGrid=tetris.nowStartGrid-1;
			tetris.auto();//立即执行一次
		}
	};
	
	tetris.keyRight=function(){//右
		if(tetris.isMaxRight()&&tetris.keyboardExecute){			
			for(var i=tetris.autoGridIndexs.length-1;i>=0;i--){
				var index=tetris.autoGridIndexs[i];
				var o=tetris.objects[index];
				var id=o.attr("id");
				var rowAndGrid=id.split("_");
				var gridIndex=rowAndGrid[1]-0+1;
				var newGrid=tetris.objects[tetris.getGridXY(rowAndGrid[0],gridIndex)];
				newGrid.addClass("gridLeftColor");
				o.removeClass("gridLeftColor");
				o.addClass("gridLeft");
			}
			tetris.nowStartGrid=tetris.nowStartGrid+1;
			tetris.auto();//立即执行一次
		}
	};
	
	tetris.oldTime=0;
	tetris.keyTime=function(){//两次按键时间间隔
		var date=new Date();
		var time=date.getTime();
		if(tetris.oldTime==0){
			tetris.oldTime=time;
		}
		var diff=time-tetris.oldTime;
		tetris.oldTime=time;
		if(diff<300){
			return true;
		}
		return false;
	};
	
	tetris.keyDown=function(){//下 快速执行一次
		if(tetris.keyboardExecute){
			tetris.nowStartRow++;
			tetris.auto();
		}
	};
	
	tetris.keyUp=function(){//上 旋转
		if(tetris.keyboardExecute){
			tetris.arrayIndex++;
			if(tetris.arrayIndex>3){
				tetris.arrayIndex=0;
			}
			var arrays=tetris.shapeArray(tetris.arrayIndex);
			var shapeArray=arrays[tetris.nowShape.randomNum];
			tetris.nowShape.shapeArray=shapeArray;
			//tetris.rotating();//旋转边界控制
			tetris.auto();
		}
	};
	
	tetris.rotating=function(){//旋转边界判断控制		
		var left=tetris.isMaxLeft();//判断现在是左边
		var right=tetris.isMaxRight();//判断现在是右边
		if(left){
			tetris.nowStartGrid++;
			tetris.nowStartGrid++;
		}else if(right){
			tetris.nowStartGrid--;
		}
	};
	
	tetris.keySpace=function(){//空格
		if(tetris.keyboardExecute){
			tetris.clearTime();
			tetris.timeId=setInterval(function(){
				tetris.keyleftbool=true;
				tetris.auto();
				tetris.nowStartRow++;
			},5);
		}
	};
	
	tetris.listeningKeyDown=function(){
		$(document).keydown(function(event){
			switch(event.keyCode){
				case 37:
					if(tetris.run)
						tetris.keyLeft();
				break;
				case 38:
					if(tetris.run)
						tetris.keyUp();
				break;
				case 39:
					if(tetris.run)
						tetris.keyRight();
				break;
				case 40:
					if(tetris.run)
						tetris.keyDown();
				break;
				case 32:
					if(tetris.run)
						tetris.keySpace();
				break;
			}
		});
	};
	
	tetris.stop=function(){
		clearInterval(tetris.timeId);
		$("input[type='button']").blur();
	};
	
	tetris.start=function(){//开始
		tetris.run=true;
		tetris.initArrays();//加载图形
		tetris.removeGridColor();//删除所有color
		tetris.clearTime();//清除自动执行
		tetris.dispose();//生成形状并启动自动执行
		tetris.listeningKeyDown();//监听键盘
		$("input[type='button']").blur();//让所有button标签失去焦点
	};
	tetris.ayyays=[[[]]];
	tetris.initArrays=function(){
		var l = [
		    [
			1, 1, 1, 1, 
			0, 0, 0, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			1, 1, 0, 0, 
			1, 1, 0, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			0, 0, 1, 0, 
			1, 1, 1, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			0, 1, 0, 0, 
			1, 1, 1, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			1, 0, 0, 0, 
			1, 1, 1, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			1, 1, 0, 0, 
			0, 1, 1, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			0, 1, 1, 0, 
			1, 1, 0, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			]
		];
		var u = [
		    [
			0, 0, 1, 0, 
			0, 0, 1, 0, 
			0, 0, 1, 0, 
			0, 0, 1, 0
			], 
			l[1],
		    [
			0, 1, 0, 0, 
			0, 1, 0, 0, 
			0, 1, 1, 0, 
			0, 0, 0, 0
			],
		    [
			1, 0, 0, 0, 
			1, 1, 0, 0, 
			1, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			1, 1, 0, 0, 
			1, 0, 0, 0, 
			1, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			0, 1, 0, 0, 
			1, 1, 0, 0, 
			1, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			1, 0, 0, 0, 
			1, 1, 0, 0, 
			0, 1, 0, 0, 
			0, 0, 0, 0
			]
		];
		var r = [
			l[0], 
			l[1],
		    [
			1, 1, 1, 0, 
			1, 0, 0, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			1, 1, 1, 0, 
			0, 1, 0, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			],
		    [
			1, 1, 1, 0, 
			0, 0, 1, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0
			], l[5], l[6]
		];
		var b = [u[0], u[1],
		    [
			1, 1, 0, 0, 
			0, 1, 0, 0, 
			0, 1, 0, 0, 
			0, 0, 0, 0
			],
		    [
			0, 0, 1, 0, 
			0, 1, 1, 0, 
			0, 0, 1, 0, 
			0, 0, 0, 0
			],
		    [
			0, 1, 0, 0, 
			0, 1, 0, 0, 
			1, 1, 0, 0, 
			0, 0, 0, 0
			], u[5], u[6]
		];
		var t = [
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		];
		var a = [l, u, r, b, t];
		tetris.ayyays=a;
	};
	
	tetris.shapeArray=function(i){//数组
		return tetris.ayyays[i];
	};
	
	$("#start").click(function(){
		tetris.start();//开始
	});
	
	$("#stop").click(function(){//停止or继续
		tetris.stop();
		var o=$(this);
		if(o.attr("stat")=="start"){
			$(this).val("继续");
			o.attr("stat","stop");
		}else if(o.attr("stat")=="stop"){
			$(this).val("停止");
			if(tetris.run){
				tetris.startAuto();
			}
			o.attr("stat","start");
		}
	});
});




















