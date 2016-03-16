window.requestAnimFrame = (function(){
 return  window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     || 
         function(/* function */ callback, /* DOMElement */ element){
           window.setTimeout(callback, 1000 / 60);
         };
})();
$(document).ready(function(){
	var mac1=function(){
		var canvas=null,
		context=null,
		angle=0;
		function resetCanvas(){
			canvas=document.getElementById("jb51");
			context=canvas.getContext("2d");
		}
		function gea(){
			context.save();
			try{
				//清除画布
				context.clearRect(0, 0, canvas.width, canvas.height);
				//设置原点
				context.translate(canvas.width * 0.5, canvas.height * 0.5);
				//旋转角度
				context.rotate(angle);
				//设置填充颜色
				//context.fillStyle = "#000";
				//绘制矩形
				context.strokeRect(-30, -30, 60, 60);
				context.scale(2,2);
				context.strokeRect(-30, -30, 60, 60);
				angle += 0.01 * Math.PI;
			}
			finally{
				context.restore();
			}
		}
		resetCanvas();
		
		var animate=function(){
			requestAnimFrame( animate );
			gea();
		}
		animate();
	}
	//mac1();
	
	
	var mc0=function(){
		
		var Bubble=function(x,y,rad,rownum,context){
			this.index;
			this.x=x;
			this.y=y;
			this.rad=rad;
			this.ctx=context;
			this.objects=[];
			var circle=function(){
				this.x;
				this.y;
				this.rad;
				this.state;
				this.move=function(){
					
				};
			}
			var m=rownum,row=1;
			this.create=function(i){
				this.ctx.beginPath();
				//this.ctx.fillStyle = "rgb(20,20,200)";
				this.ctx.arc(this.x,this.y,this.rad,0,2*Math.PI);
				this.ctx.fillText(i,this.x-5,this.y);
		    	this.ctx.closePath();
				this.ctx.stroke();
		    	//this.ctx.fill();
				if(i%m==0){
					row++
					this.y=(this.y+this.rad*2-this.rad/4);
					if(row%2==0){
						this.x=x*2;
						m+=rownum-1;
					}else{
						this.x=x;
						m+=rownum;
					}
				}else{
					this.x=this.x+this.rad*2;
				}
				var cir=new circle();
				cir.x=this.x;
				cir.y=this.y;
				cir.rad=this.rad;
				cir.state=0;
				this.objects[i-1]=cir;
			};
			return this;
		}
		
		var myCanvas=document.getElementById("myCanvas");
		var ctx=myCanvas.getContext("2d");
		var obj=new Bubble(20,20,20,15,ctx);
		for(var i=1;i<=50;i++){
			obj.create(i);
		}
		var os=obj.objects;
		console.log(os[0].x,os[0].y);
	}
	//mc0();
	
	var mac2=function(){
		var i=0;
		var canv=document.getElementById("myCanvas1");
		var ctx=canv.getContext("2d");
		var mc1=function(){
			ctx.save();
			try{
				ctx.clearRect(0, 0, canv.width, canv.height);
				ctx.translate(canv.width * 0.5, canv.height * 0.5);
				ctx.rotate(i);
				ctx.strokeRect(-10, -10, 20, 20);
				ctx.scale(2,2);
				ctx.strokeRect(-10, -10, 20, 20);
				ctx.scale(2,2);
				ctx.strokeRect(-10, -10, 20, 20);
				i += 0.01 * Math.PI;
			} finally{
				ctx.restore();
			}
		}
		var animate=function(){
			requestAnimFrame( animate );
			mc1();
		}
		animate();
	};
	//mac2();
	
	var mac3=function(){
		var canvas, context, toggle;
		init();
		animate();
		function init() {
		    canvas = document.createElement('canvas');
		    canvas.width = 300;
		    canvas.height = 300;
		    context = canvas.getContext('2d');
		    document.body.appendChild(canvas);
		}
		function animate() {
		    requestAnimFrame(animate);
		    draw();
		}
		function draw() {
		    var time = new Date().getTime() * 0.002;
		    var x = Math.sin( time ) * 120 + 140;
		    var y = Math.cos( time * 0.9 ) *120 + 140;
		    toggle = !toggle;
		    context.fillStyle = toggle ? 'rgb(200,200,20)' :  'rgb(20,20,200)';
		    context.beginPath();
		    context.arc(x, y, 10, 0, Math.PI * 2, false);
		    context.closePath();
		    context.fill();
		}
	}
	//mac3();
	
	var mac4=function(){
		var list=[];
	    var currentC;
	    var _e={};
	    var cricle = function(x,y,r){
	        this.x=x;
	        this.y=y;
	        this.r=r;
	        this.isCurrent=false;
	        this.drawC=function(ctx,x,y){
	            ctx.save();
	            ctx.beginPath();
	            ctx.moveTo(this.x,this.y-this.r);
	            ctx.arc(this.x,this.y,this.r,2*Math.PI,0,true);
	            if ((x && y && ctx.isPointInPath(x, y) && !currentC )||this.isCurrent) {
                    ctx.fillStyle = '#ff0000';
                    currentC=this;
                    this.isCurrent=true;
	            }else{
	                ctx.fillStyle = '#999999';
	            }
	            ctx.fill();
	        }
	    }
		
		var line=function(x0,y0,x1,y1){
            this.x0;
			this.y0;
			this.x1;
			this.y1;
			this.drawL=function(ctx){
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(this.x0,this.y0);
				ctx.lineTo(this.x1,this.y1);
				ctx.stroke();
			}
		}
		
	    function draw(){
	        var canvas = document.getElementById('tutorial');
	        if (canvas.getContext){
	            var ctx = canvas.getContext('2d');
	            for(var i=0;i<10;i++){
	                var c=new cricle(20*i,20*i,5*i);
	                c.drawC(ctx);
	                list.push(c);
	            }
	        }
	    }
	     
	    function reDraw(e){
	        e=e||event;
	        var canvas = document.getElementById('tutorial');
	        var x = e.clientX - canvas.offsetLeft;
	        var y = e.clientY - canvas.offsetTop;
	 
	        canvas.width = canvas.width;
	        if (canvas.getContext){
	            var ctx = canvas.getContext('2d');
	            for(var i=0;i<list.length;i++){
	                var c=list[i];
	                c.drawC(ctx,x,y);
	            }
	        }
	    }
	     
	    function show(e){
	        e=e||event;
	        var canvas = document.getElementById('tutorial');
	        var ctx = canvas.getContext('2d');
	        var x = e.clientX - canvas.offsetLeft;
	        var y = e.clientY - canvas.offsetTop;

	        if(currentC){
	            currentC.x=parseInt(x+(x-currentC.x)/5);
	            currentC.y=parseInt(y+(y-currentC.y)/5);
	        }
	        _e=e;
	    }
	 
	    window.onload=function(){
	        var canvas = document.getElementById('tutorial');
	        draw();
	        canvas.onmousedown=function(e){
	            e=e||event;
	            var x = e.clientX - canvas.offsetLeft;
	            var y = e.clientY - canvas.offsetTop;
	            if(currentC)
	                currentC.isCurrent=false;
	            currentC=null;
	            reDraw(e);
	            _e=e;
	            var showTimer=setInterval(function(e){
	                reDraw(e);
	            },10,_e);
	            canvas.onmousemove=show;
	 
	            document.onmouseup=function(){
	                if(currentC)
	                    currentC.isCurrent=false;
	                currentC=null;
	                canvas.onmousemove=null;
	                clearInterval(showTimer);
	            }
	        }
	    }
	}
	mac4();
});
	