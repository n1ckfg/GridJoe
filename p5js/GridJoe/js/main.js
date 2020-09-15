"use strict";

// ---     MAIN CONTROLS     ---
// if you want to avoid chain reactions, try 0, 20, 100, 0.2
let delayCounter = 0;    // int, delays start of spread
let lifeCounter = 20;    // int, how long spread lasts
let respawnCounter = 50; // int, how long until retrigger
let globalChaos = 0.3;    // float, 0 = min, 1 = max
// -------------------------
let choose = 0;    // int
let maxChoices = 7;    // int
let numFrames = 50;    // int
let renderCounterMax = 1000;    // int
// ----
let pixelSize = 5;    // int
let sW = 640;    // int
let sH = 480;    // int
let fps = 60;    // int

let numColumns, numRows;    // int
let guyWidth, guyHeight, startX, startY;    // float
GridGuy[][] mainGrid;
let setRules = "";    // string
let odds_X_Yplus1, odds_Xminus1_Y, odds_X_Yminus1, odds_Xplus1_Y, odds_Xplus1_Yplus1, odds_Xminus1_YminuX1, odds_Xplus1_Yminus1, odds_Xminus1_Yplus1;    // float

let target;    // Target

function setup() {
    createCanvas(sW, sH);
    
    noCursor();

    frameRate(fps);

    pixelOddsSetup();
    initGlobals();
    
    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numColumns; x++) {
            rulesInit(x, y);
            guysInit(x, y);
        }
    }
    
    target = new Target();
    
    bloomSetup();
    opticalFlowSetup();
}

function draw() {
    target.run();
    if (target.armResetAll) {
        resetAll();
        target.armResetAll = false;
    }
    
    beginDraw();
    blendMode(NORMAL);
    background(0);
    blendMode(ADD);
    
    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numColumns; x++) {
            let loc = x + (y * numColumns);

            rulesHandler(x, y);
            mainGrid[x][y].run();
        }
    }
    endDraw();
    
    opticalFlowDraw();
    bloomDraw();
    
    surface.setTitle("" + frameRate);
}

function keyPressed() {
    resetAll();
}

function initGlobals() {
    numColumns = sW / pixelSize;
    numRows = sH / pixelSize;

    guyWidth = sW / numColumns;
    guyHeight = sH / numRows;

    startX = guyWidth / 2;
    startY = guyHeight / 2;

    // make mainGrid a 2D array
    mainGrid = new GridGuy[numColumns][numRows];
}

function rulesHandler(let x, let y) {
    boolean[] sw = mainGrid[x][y].switchArray;
    if (sw[0] || sw[1] || sw[2] || sw[3] || sw[4] || sw[5] || sw[6] || sw[7]) return;

    if (mainGrid[x][y].clicked) {
        //these are direction probabilities
        mainGrid[x][y + 1].kaboom = diceHandler(1, odds_X_Yplus1);
        mainGrid[x - 1][y].kaboom = diceHandler(1, odds_Xminus1_Y);
        mainGrid[x][y - 1].kaboom = diceHandler(1, odds_X_Yminus1);
        mainGrid[x + 1][y].kaboom = diceHandler(1, odds_Xplus1_Y);
        mainGrid[x + 1][y + 1].kaboom = diceHandler(1, odds_Xplus1_Yplus1);
        mainGrid[x - 1][y - 1].kaboom = diceHandler(1, odds_Xminus1_YminuX1);
        mainGrid[x + 1][y - 1].kaboom = diceHandler(1, odds_Xplus1_Yminus1);
        mainGrid[x - 1][y + 1].kaboom = diceHandler(1, odds_Xminus1_Yplus1);
    }
}

function diceHandler(let v1, let v2) { 
    let rollDice = random(v1);  // float
    return rollDice < v2;
}

function rulesInit(let x, let y) {
    setRules = "";
    if (x == 0 && y == 0) {
        setRules = "NWcorner";
    } else if (x == numColumns - 1 && y == 0) {
        setRules = "NEcorner";
    } else if (x == 0 && y == numRows - 1) {
        setRules = "SWcorner";
    } else if (x == numColumns - 1 && y == numRows - 1) {
        setRules = "SEcorner";
    } else if (y == 0) {
        setRules = "Nrow";
    } else if (y == numRows - 1) {
        setRules = "Srow";
    } else if (x == 0) {
        setRules = "Wrow";
    } else if (x == numColumns - 1) {
        setRules = "Erow";
    }
}

function guysInit(let x, let y) { 
    mainGrid[x][y] = new GridGuy(startX, startY, guyWidth, guyHeight, setRules, globalChaos, delayCounter, lifeCounter, respawnCounter);
    if (startX < width - guyWidth) {
        startX += guyWidth;
    } else {
        startX = guyWidth / 2;
        startY += guyHeight;
    }
    println("init " + x + " " + y);
}

function resetAll() {
    startX = 0;
    startY = 0;
    //currentFrame = 0;
    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numColumns; x++) {
            mainGrid[x][y].hovered = false;
            mainGrid[x][y].clicked = false;
            //mainGrid[x][y].kaboom = false;
            mainGrid[x][y].delayCountDown = mainGrid[x][y].delayCountDownOrig;
            mainGrid[x][y].lifeCountDown = mainGrid[x][y].lifeCountDownOrig;
            mainGrid[x][y].respawnCountDown = mainGrid[x][y].respawnCountDownOrig;
            mainGrid[x][y].fillColor = mainGrid[x][y].fillColorOrig;
        }
    }
    
    pixelOddsSetup();
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

float[] randomValues = new float[8];

function pixelOddsSetup() {
    // temp
    for (let i = 0; i < randomValues.length; i++) {
        randomValues[i] = random(1);
    }

    choose = int(random(maxChoices));
    println("choose: " + choose);
    
    switch (choose) {
    case 0: 
        // 0. CROSS | OK
        //delayCounter = 4;
        odds_Xminus1_YminuX1 = 0;//randomValues[0]; // x-1 y-1
        odds_X_Yminus1 = 0.5;//randomValues[1]; // x y-1
        odds_Xplus1_Yminus1 = 0;//randomValues[2]; // x+1 y-1
        odds_Xminus1_Y = 0.5;//randomValues[3]; // x-1 y
        odds_Xplus1_Y = 0.5;//randomValues[4]; // x+1 y
        odds_Xminus1_Yplus1 = 0;//randomValues[5]; // x-1 y+1
        odds_X_Yplus1 = 0.5;//randomValues[6]; // x y+1
        odds_Xplus1_Yplus1 = 0;//randomValues[7]; // x+1 y+1        
        break;
    case 1:
        // 1. WOT | ?
        //delayCounter = 4;
        odds_Xminus1_YminuX1 = randomValues[0]; // x-1 y-1
        odds_X_Yminus1 = 1;//randomValues[1]; // x y-1
        odds_Xplus1_Yminus1 = 1;//randomValues[2]; // x+1 y-1
        odds_Xminus1_Y = randomValues[3]; // x-1 y
        odds_Xplus1_Y = 0;//randomValues[4]; // x+1 y
        odds_Xminus1_Yplus1 = 1;//randomValues[5]; // x-1 y+1
        odds_X_Yplus1 = 0;//randomValues[6]; // x y+1
        odds_Xplus1_Yplus1 = randomValues[7]; // x+1 y+1
        break;
    case 2: 
        // 2. OCEAN | OK
        //delayCounter = 4;
        odds_Xminus1_YminuX1 = 0;//randomValues[0]; // x-1 y-1
        odds_X_Yminus1 = 0;//randomValues[1]; // x y-1
        odds_Xplus1_Yminus1 = 0.1 * randomValues[2]; // x+1 y-1
        odds_Xminus1_Y = randomValues[3]; // x-1 y
        odds_Xplus1_Y = randomValues[4]; // x+1 y
        odds_Xminus1_Yplus1 = 0.1 * randomValues[5]; // x-1 y+1
        odds_X_Yplus1 = 0;//randomValues[6]; // x y+1
        odds_Xplus1_Yplus1 = 0;//randomValues[7]; // x+1 y+1 
        break;
    case 3: 
        // 3. MOUNTAINS
        //delayCounter = 4;
        odds_Xminus1_YminuX1 = 0;//randomValues[0]; // x-1 y-1
        odds_X_Yminus1 = 0.1;//randomValues[1]; // x y-1
        odds_Xplus1_Yminus1 = 0;//randomValues[2]; // x+1 y-1
        odds_Xminus1_Y = 0;//randomValues[3]; // x-1 y
        odds_Xplus1_Y = 0;//randomValues[4]; // x+1 y
        odds_Xminus1_Yplus1 = randomValues[5]; // x-1 y+1
        odds_X_Yplus1 = 0.5;//randomValues[6]; // x y+1
        odds_Xplus1_Yplus1 = randomValues[7]; // x+1 y+1    
        break;
    case 4: 
        // 4. DROPS
        //delayCounter = 4;
        odds_Xminus1_YminuX1 = 0;//randomValues[0]; // x-1 y-1
        odds_X_Yminus1 = 0;//randomValues[1]; // x y-1
        odds_Xplus1_Yminus1 = 0;//randomValues[2]; // x+1 y-1
        odds_Xminus1_Y = 0;//randomValues[3]; // x-1 y
        odds_Xplus1_Y = 0;//randomValues[4]; // x+1 y
        odds_Xminus1_Yplus1 = 0.1 * randomValues[5]; // x-1 y+1
        odds_X_Yplus1 = 1;//randomValues[6]; // x y+1
        odds_Xplus1_Yplus1 = 0.1 * randomValues[7]; // x+1 y+1    
        break;
    case 5: 
        // 5. DROPS_REVERSE
        //delayCounter = 4;
        odds_Xminus1_YminuX1 = 0.1 * randomValues[0]; // x-1 y-1
        odds_X_Yminus1 = 1;//randomValues[1]; // x y-1
        odds_Xplus1_Yminus1 = 0.1 * randomValues[2]; // x+1 y-1
        odds_Xminus1_Y = 0;//randomValues[3]; // x-1 y
        odds_Xplus1_Y = 0;//randomValues[4]; // x+1 y
        odds_Xminus1_Yplus1 = 0; //randomValues[5]; // x-1 y+1
        odds_X_Yplus1 = 0;//randomValues[6]; // x y+1
        odds_Xplus1_Yplus1 = 0; //randomValues[7]; // x+1 y+1    
        break;
    case 6:
        // 6. ALL RANDOM
        //delayCounter = 4;
        odds_Xminus1_YminuX1 = randomValues[0]; // x-1 y-1
        odds_X_Yminus1 = randomValues[1]; // x y-1
        odds_Xplus1_Yminus1 = randomValues[2]; // x+1 y-1
        odds_Xminus1_Y = randomValues[3]; // x-1 y
        odds_Xplus1_Y = randomValues[4]; // x+1 y
        odds_Xminus1_Yplus1 = randomValues[5]; // x-1 y+1
        odds_X_Yplus1 = randomValues[6]; // x y+1
        odds_Xplus1_Yplus1 = randomValues[7]; // x+1 y+1
        break;
    }
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

class Target {

    constructor() {
        this.speedMin = 0.01;  // float
        this.speedMax = 0.05;  // float
        this.speed;  // float
        this.clickOdds = 0.1;  // float
        this.chooseOdds = 0.01;  // float
        this.markTime = 0;  // int
        this.timeInterval = 200;  // int
    
        this.posX = width/2;  // float
        this.posY = height/2;  // float
        this.targetX;  // float
        this.targetY;  // float
        this.minDist = 5;  // int
        this.clicked = false;
        this.armResetAll = false;
        
        this.pickTarget();
    }

    run() {
        this.posX = lerp(this.posX, this.targetX, this.speed);
        this.posY = lerp(this.posY, this.targetY, this.speed);
        
        if (millis() > this.markTime + this.timeInterval || dist(this.posX, this.posY, this.targetX, this.targetY) < this.minDist) {
            this.pickTarget();
        }
    }
    
    pickTarget() {
        this.markTime = millis();
        
        this.targetX = lerp(this.posX, random(0, width), 0.5);
        this.targetY = lerp(this.posY, random(0, height), 0.5);
        
        this.speed = random(this.speedMin, this.speedMax);
        let r = random(1);
        if (r < this.clickOdds) this.clicked = !this.clicked;
        if (r < this.chooseOdds) this.armResetAll = true;
    }

}

class GridGuy {

    String[] rulesArray = { "NWcorner", "NEcorner", "SWcorner", "SEcorner", "Nrow", "Srow", "Wrow", "Erow" };    // string array
    boolean[] switchArray = { false, false, false, false, false, false, false, false };    // bool array
    color[] fillColorArray = {    // color array     
        color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 0, 255), color(50), color(60), color(70), color(80)
    };
    let debugColors, strokeLines, hovered, clicked, kaboom;    // bool
    let strokeColor, fillColorOrig, fillColor, hoveredColor, clickedColor;    // color
    let posX, posY, guyWidth, guyHeight, chaos;    // float
    let applyRule;    // string
    let delayCountDownOrig, delayCountDown, lifeCountDownOrig, lifeCountDown, respawnCountDownOrig, respawnCountDown;    // int
    let birthTime, alpha;    // int
    
    constructor(x, y, w, h, s, cc, dc, lc, rc) {    // float, float, float, float, string, float, int, int, let                
        birthTime = millis();
        alpha = 255;
        
        fillColorOrig = color(0);
        fillColor = fillColorOrig;
        
        hoveredColor = color(0);
        clickedColor = color(random(21,87));

        hovered = false;
        clicked = false;
        kaboom = false;

        posX = x;
        posY = y;
        guyWidth = w;
        guyHeight = h;
        applyRule = s;

        chaos = abs(1.0 - cc);
        delayCountDownOrig = int(random(dc * chaos, dc));
        delayCountDown = delayCountDownOrig;
        lifeCountDownOrig = int(random(lc * chaos, lc));
        lifeCountDown = lifeCountDownOrig;
        respawnCountDownOrig = int(random(rc * chaos, rc));
        respawnCountDown = respawnCountDownOrig;
        
        for (let i = 0; i < rulesArray.length; i++) {
            if (applyRule == rulesArray[i]) {
                switchArray[i] = true;
            }
        }

        //strokeLines = true;
    }

    run() {
        update();
        draw();
    }

    update() {
        if (dist(target.posX, target.posY, posX, posY) < guyWidth) {
            hovered = true;
            birthTime = millis();
            alpha = 255;
        } else {
            hovered = false;
        }

        if (hovered && target.clicked) mainFire();

        if (kaboom) {
            alpha = 255;
            birthTime = millis();
        
            if (delayCountDown>0) {
                delayCountDown--;
            } else {
                kaboom = false;
                clicked = true;
                delayCountDown = delayCountDownOrig;
            }
        }

        if (clicked) {
            if (lifeCountDown > 0) {
                lifeCountDown--;
            } else {
                clicked = false;
            }
        }

        if (lifeCountDown == 0 && respawnCountDown > 0) {
            respawnCountDown--;
        } 
        else if (respawnCountDown == 0) {
            lifeCountDown = lifeCountDownOrig;
            respawnCountDown = respawnCountDownOrig;
        }
    }

    mainFire() {
        clicked = true;
        kaboom = false;
        delayCountDown = delayCountDownOrig;
        lifeCountDown = lifeCountDownOrig;
        respawnCountDown = respawnCountDownOrig;
    }

    draw() {
        fillColor = fillColorOrig;
        noStroke();

        if (hovered && !clicked) {
            fillColor = hoveredColor;
        } else if(clicked) {
            fillColor = clickedColor;
        }

        alpha -= ((millis() - birthTime)/2);
        drawRect();
    }

    drawRect() {
        fill(fillColor, alpha);
        rectMode(CENTER);
        rect(posX, posY, guyWidth, guyHeight);
    }
    
    drawPoint() {
        stroke(fillColor, alpha);
        strokeWeight(guyWidth);
        point(posX, posY);
    }

    drawEllipse() {
        fill(fillColor, alpha);
        ellipseMode(CENTER);
        ellipse(posX, posY, guyWidth, guyHeight);
    }

}

// --    END