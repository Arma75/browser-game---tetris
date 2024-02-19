const STAGE_WIDTH = 12, STAGE_HEIGHT = 12;
const BLOCK_SIZE = 40;
const TOP_POINT_STORAGE_KEY = "TTRS_POINT";

let tetris;
let topPoint;
let currentPoint;

window.onload = () => {
    let gameLoop;
    let buttonLoop;

    updateSquareSize(document.getElementsByClassName("content")[0]);

    topPoint = new CircularNumber(document.querySelector(".top-point-container .circular-num-set"));
    topPoint.init();
    currentPoint = new CircularNumber(document.querySelector(".current-point-container .circular-num-set"));
    currentPoint.init();
    topPoint.setNumber(getTopPoint());

    let canvas = document.getElementsByClassName("stage")[0];
    canvas.width = STAGE_WIDTH * BLOCK_SIZE;
    canvas.height = STAGE_HEIGHT * BLOCK_SIZE;

    tetris = new Tetris(canvas.getContext("2d"));
    init();

    let buttons = [[37, leftButton], [38, rotationButton], [39, rightButton], [40, downButton]];
    let buttonMap = new Map(buttons);

    document.onkeydown = e => {
        if( gameLoop ) {
            if( e.keyCode == 40 ) {
                if( !tetris.moveFallingBlock(0, 1) ) {
                    if( tetris.isOver() ) {
                        tetris.shakeBoard(60, 12);
                        clearInterval(gameLoop);
                        gameLoop = null;
                        stageCover.style.display = "flex";

                        if( topPoint.num < currentPoint.num ) {
                            setTopPoint(currentPoint.num);
                            topPoint.setNumber(getTopPoint());
                        }
                    } else {
                        tetris.stackFallingBlock();
                        tetris.shakeBoard(100, tetris.getFulledLineCount());
                        currentPoint.setNumber(currentPoint.num + tetris.getFulledLineCount() * STAGE_WIDTH);
                        tetris.initFallingBlock(Math.random() * 8 | 0);
                        tetris.clearFulledLines();
                    }
                }
            } else if( e.keyCode == 37 ) {
                tetris.moveFallingBlock(-1, 0);
            } else if( e.keyCode == 39 ) {
                tetris.moveFallingBlock(1, 0);
            } else if( e.keyCode == 38 ) {
                tetris.rotateFallingBlock();
            }
            if( e.key ) {
                pushButton(buttonMap.get(e.keyCode));
            }
    
            tetris.drawBoard();
            tetris.drawFallingBlock();
        } else {
            if( e.keyCode == 32 ) {
                stageCover.click();
            }
        }
    };
    
    document.onkeyup = e => {
        clearInterval(buttonLoop);
        buttonLoop = null;
        pullButton(buttonMap.get(e.keyCode))
    };

    buttons.forEach(button => {
        if( isMobile() ) {
            button[1].ontouchstart = () => {
                if( !buttonLoop ) {
                    document.dispatchEvent(new KeyboardEvent("keydown", {keyCode: button[0], key: "MouseEvent"}));
                    buttonLoop = setInterval(() => {
                        document.dispatchEvent(new KeyboardEvent("keydown", {keyCode: button[0], key: "MouseEvent"}));
                    }, 80);
                }
            };
        } else {
            button[1].onmousedown = () => {
                if( !buttonLoop ) {
                    document.dispatchEvent(new KeyboardEvent("keydown", {keyCode: button[0], key: "MouseEvent"}));
                    buttonLoop = setInterval(() => {
                        document.dispatchEvent(new KeyboardEvent("keydown", {keyCode: button[0], key: "MouseEvent"}));
                    }, 80);
                }
            };
        }
    });
    
    if( isMobile() ) {
        document.ontouchend = () => {
            buttons.forEach(button => document.dispatchEvent(new KeyboardEvent("keyup", {keyCode: button[0], key: "MouseEvent"})));
        };
    } else {
        document.onmouseup = () => {
            buttons.forEach(button => document.dispatchEvent(new KeyboardEvent("keyup", {keyCode: button[0], key: "MouseEvent"})));
        };
    }

    stageCover.onclick = () => {
        stageCover.style.display = "none";

        if( !gameLoop ) {
            init();
            
            gameLoop = setInterval(() => {
                document.dispatchEvent(new KeyboardEvent("keydown", {keyCode: 40}));
            }, 1000);
        }
    }
}
window.onresize = () => updateSquareSize(document.getElementsByClassName("content")[0]);

function init() {
    tetris.setBoard(STAGE_WIDTH, STAGE_HEIGHT);
    tetris.initFallingBlock(Math.random() * 8 | 0);
    tetris.drawBoard();
    tetris.drawFallingBlock();
    currentPoint.setNumber(0);
}

function updateSquareSize(elem) {
    if( isMobile() ) {
        elem.style.width = `calc((100vmin - 96px) * 4 / 5)`;
        elem.style.height = `100vmin`;
    } else {
        const scale = window.devicePixelRatio * 70;
        elem.style.width = `calc((${scale}vmin - 96px) * 4 / 5)`;
        elem.style.height = `${scale}vmin`;
    }
}

function pushButton(btnElem) {
    if( btnElem ) {
        btnElem.classList.add("pushed");
    }
}

function pullButton(btnElem) {
    if( btnElem ) {
        btnElem.classList.remove("pushed");
    }
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function setTopPoint(point) {
    window.localStorage.setItem(TOP_POINT_STORAGE_KEY, point);
}

function getTopPoint() {
    let value = window.localStorage.getItem(TOP_POINT_STORAGE_KEY);
    return value? value : 0;
}