/**
 * Main
 * */
//设定游戏速度，屏幕大小，回调函数
//init(500,"mylegend",480,800,main);
var screenW = 800;
var screenH = 480;
init(30, "mylegend", screenW, screenH, main);


/**层变量*/
//显示进度条所用层
var loadingLayer;
//游戏最底层
var gameInstance;
/**数组变量*/
//图片path数组
var imgData = new Array();
//读取完的图片数组
var imglist = {};

var buttonManager;


function main() {
    initLoading();
}

function initLoading() {
    //准备读取图片
    imgData.push({name: "back", path: "./images/back.png"});
    imgData.push({name: "fish0", path: "./images/fish/fish0.png"});

    imgData.push({name: "game_ui", path: "./images/ui/game_ui.png"});
    imgData.push({name: "cannon", path: "./images/ui/cannon.png"});
    imgData.push({name: "btn", path: "./images/ui/btn.png"});

    imgData.push({name: "bullet", path: "./images/weapon/bullet.png"});

    imgData.push({name: "coin", path: "./images/score/coin.png"});
    imgData.push({name: "num_big", path: "./images/score/num_big.png"});
    imgData.push({name: "num_small", path: "./images/score/num_small.png"});

    imgData.push({type: "js", path: "./js/engine/GameImage.js"});
    imgData.push({type: "js", path: "./js/engine/SpriteData.js"});
    imgData.push({type: "js", path: "./js/engine/SpriteModel.js"});
    imgData.push({type: "js", path: "./js/engine/EMath.js"});

    imgData.push({type: "js", path: "./js/fish.js"});
    imgData.push({type: "js", path: "./js/ui.js"});
    imgData.push({type: "js", path: "./js/weapon.js"});
    imgData.push({type: "js", path: "./js/score.js"});

    imgData.push({type: "js", path: "./js/GameData.js"});
    imgData.push({type: "js", path: "./js/Game.js"});
    imgData.push({type: "js", path: "./js/FishManager.js"});
    imgData.push({type: "js", path: "./js/PlayerManager.js"});

    loadingLayer = new LoadingSample4();
    addChild(loadingLayer);
    LLoadManage.load(
        imgData,
        function (progress) {
            loadingLayer.setProgress(progress);
        },
        function (result) {
            imglist = result;
            removeChild(loadingLayer);
            loadingLayer = null;
            StaticData.init();
            gameInit();
        }
    );
}

function gameInit(event) {
    //游戏底层实例化
    gameInstance = new Game();
    addChild(gameInstance);
    gameInstance.initGame();
    gameInstance.addEventListener(LMouseEvent.MOUSE_DOWN, onMouseDown);
    gameInstance.addEventListener(LMouseEvent.MOUSE_UP, onMouseUp);
    gameInstance.addEventListener(LEvent.ENTER_FRAME, onFrameUpdate);
}


function onFrameUpdate() {
    gameInstance.updateGame();
}

var isTouch = false;
function onMouseDown(event) {
    isTouch = true;
    if (buttonManager) {
        if (buttonManager.mouseDown()) {
            return;
        }
    }
    gameInstance.onMouseDown(event);
}

function onMouseUp(event) {
    isTouch = false;
    if (buttonManager) {
        if (buttonManager.mouseUp()) {
            return;
        }
    }
    gameInstance.onMouseUp(event);
}

function setButtonManager(btnMgr) {
    buttonManager = btnMgr;
}

function clearButtonManager() {
    buttonManager = null;
}