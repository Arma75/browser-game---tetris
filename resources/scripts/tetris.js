function Tetris(context, horizontalCount, verticalCount) {
    this.setBoard = function(horizontalCount, verticalCount) {
        this.horizontalCount = typeof horizontalCount == "number"? horizontalCount : 0;
        this.verticalCount = typeof verticalCount == "number"? verticalCount : 0;

        this.stage = Array.from({length: this.verticalCount}, () => Array(this.horizontalCount).fill(0));
    }

    this.drawBoard = function() {
        if( this.context ) {
            let w = this.context.canvas.width / this.horizontalCount;
            let h = this.context.canvas.height / this.verticalCount;

            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            for( let y = 0; y < this.verticalCount; y++ ) {
                for( let x = 0; x < this.horizontalCount; x++ ) {
                    if( this.stage[y][x] ) {
                        this.drawBlock(x, y, w, h, this.blockColor);
                    }
                }
            }
        }
    }

    this.shakeBoard = function(duration, iterations) {
        if( this.context ) {
            this.context.canvas.animate([
                { left: "0%", transform: "translate(0, 0)" },
                { left: "10%", transform: "translate(-5px, 5px)" },
                { left: "30%", transform: "translate(-5px, 5px)" },
                { left: "50%", transform: "translate(-5px, 5px)" },
                { left: "70%", transform: "translate(-5px, 5px)" },
                { left: "90%", transform: "translate(-5px, 5px)" },
                { left: "20%", transform: "translate(5px, -5px)" },
                { left: "40%", transform: "translate(5px, -5px)" },
                { left: "60%", transform: "translate(5px, -5px)" },
                { left: "80%", transform: "translate(5px, -5px)" },
                { left: "100%", transform: "translate(0, 0)" },
            ],
            {
                duration: typeof duration == "number"? duration : 200
                , easing: "ease-in-out"
                , iterations: iterations
            });

            if( typeof iterations == "number" ) {
                navigator.vibrate(duration * iterations);
            } else {
                navigator.vibrate(duration);
            }
        }
    }

    this.drawBlock = function(x, y, width, height, color) {
        if( this.context ) {
            this.context.fillStyle = color;
            this.context.fillRect(x * width, y * height, width, height);
        }
    }

    this.initFallingBlock = function(blockType) {
        let mid = this.horizontalCount / 2 | 0;

        if( blockType == this.SQUARE_BLOCK_TYPE ) {
            this.fallingBlock = [[-0.5 + mid, -1.5], [-1 + mid, -2], [0 + mid, -2], [-1 + mid, -1], [0 + mid, -1]];
        } else if( blockType == this.STARAIT_BLOCK_TYPE ) {
            this.fallingBlock = [[0.5 + mid, -2.5], [0 + mid, -4], [0 + mid, -3], [0 + mid, -2], [0 + mid, -1]];
        } else if( blockType == this.Z_BLOCK_TYPE ) {
            this.fallingBlock = [[0 + mid, -2], [-1 + mid, -2], [0 + mid, -2], [0 + mid, -1], [1 + mid, -1]];
        } else if( blockType == this.S_BLOCK_TYPE ) {
            this.fallingBlock = [[0 + mid, -2], [0 + mid, -2], [1 + mid, -2], [-1 + mid, -1], [0 + mid, -1]];
        } else if( blockType == this.J_BLOCK_TYPE ) {
            this.fallingBlock = [[0 + mid, -2], [-1 + mid, -2], [0 + mid, -2], [1 + mid, -2], [1 + mid, -1]];
        } else if( blockType == this.L_BLOCK_TYPE ) {
            this.fallingBlock = [[0 + mid, -2], [-1 + mid, -2], [0 + mid, -2], [1 + mid, -2], [-1 + mid, -1]];
        } else {
            this.fallingBlock = [[0 + mid, -2], [-1 + mid, -1], [0 + mid, -1], [1 + mid, -1], [0 + mid, -2]];
        }
    }

    this.moveFallingBlock = function(mx, my) {
        let nextFallingBlock = [...this.fallingBlock].map(pos => [pos[0] + mx, pos[1] + my]);

        if( !this.isCrash(nextFallingBlock.slice(1)) && !this.isEscape(nextFallingBlock.slice(1)) ) {
            this.fallingBlock = nextFallingBlock;
            return true;
        } else {
            return false;
        }
    }

    this.rotateFallingBlock = function() {
        let nextFallingBlock = [...this.fallingBlock];
        nextFallingBlock = nextFallingBlock.map((pos, i) => {
            if( i < 1 ) {
                return pos;
            } else {
                return [-pos[1] + nextFallingBlock[0][1] + nextFallingBlock[0][0], pos[0] - nextFallingBlock[0][0] + nextFallingBlock[0][1]]
            }
        });

        if( !this.isCrash(nextFallingBlock.slice(1)) && !this.isEscape(nextFallingBlock.slice(1)) ) {
            this.fallingBlock = nextFallingBlock;
            return true;
        } else {
            return false;
        }
    }

    this.drawFallingBlock = function() {
        let w = this.context.canvas.width / this.horizontalCount;
        let h = this.context.canvas.height / this.verticalCount;

        this.fallingBlock.map((pos, i) => {
            if( i > 0 ) {
                this.drawBlock(pos[0], pos[1], w, h, this.blockColor);
            }
        });
    }

    this.stackFallingBlock = function() {
        this.fallingBlock.map((pos, i) => {
            if( i > 0 && this.stage[pos[1]] ) {
                this.stage[pos[1]][pos[0]] = 1;
            }
        });
    }

    this.setBlockColor = function(color) {
        this.blockColor = color;
    }

    this.removeLine = function(y) {
        for( let i = y; i > 0; i-- ) {
            this.stage[i] = this.stage[i - 1];
        }
        this.stage[0] = Array(this.horizontalCount).fill(0);
    }

    this.clearFulledLines = function() {
        for( let y = 0; y < this.verticalCount; y++ ) {
            if( this.isFulledLine(y) ) {
                this.removeLine(y);
            }
        }
    }

    this.getFulledLineCount = function() {
        let count = 0;
        for( let y = 0; y < this.verticalCount; y++ ) {
            if( this.isFulledLine(y) ) {
                count++;
            }
        }

        return count;
    }

    this.isCrash = function(block) {
        return block.filter(pos => this.stage[pos[1]] && this.stage[pos[1]][pos[0]] == 1).length;
    }

    this.isEscape = function(block) {
        return block.filter(pos => pos[0] < 0 || pos[0] >= this.horizontalCount || pos[1] >= this.verticalCount).length;
    }

    this.isOver = function() {
        return this.fallingBlock.filter(pos => pos[1] < 0).length;
    }

    this.isFulledLine = function(y) {
        return !this.stage[y].includes(0);
    }

    this.SQUARE_BLOCK_TYPE = 0, this.STARAIT_BLOCK_TYPE = 1, this.Z_BLOCK_TYPE = 2, this.S_BLOCK_TYPE = 3, this.J_BLOCK_TYPE = 4, this.L_BLOCK_TYPE = 5, this.T_BLOCK_TYPE = 6;

    this.context = typeof context == "object"? context : null;
    this.horizontalCount;
    this.verticalCount;
    this.stage;
    this.fallingBlock;
    this.blockColor = "#081821";

    this.setBoard(horizontalCount, verticalCount);
}