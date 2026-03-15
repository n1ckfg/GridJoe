"use strict";

// ---     MAIN CONTROLS     ---
let delayCounter = 20;
let lifeCounter = 20;
let respawnCounter = 50;
let globalChaos = 0.3;
// -------------------------
let choose = 0;
let maxChoices = 7;
let sW = 640;
let sH = 480;
let fps = 60;

// Shader resources
let simulationShader;
let renderShader;
let stateA, stateB;
let currentState = 0;

// Offscreen buffer for simulation output
let simOutput;

// Target (autonomous cursor)
let target;

// Propagation odds: NW, N, NE, W, E, SW, S, SE
let odds = [0, 0.5, 0, 0.5, 0.5, 0, 0.5, 0];

// Pattern presets
const patterns = [
    { odds: [0, 0.5, 0, 0.5, 0.5, 0, 0.5, 0], randomize: [] },
    { odds: [null, 1, 1, null, 0, 1, 0, null], randomize: [0, 3, 7] },
    { odds: [0, 0, null, null, null, null, 0, 0], randomize: [2, 3, 4, 5], scale: [1, 1, 0.1, 1, 1, 0.1, 1, 1] },
    { odds: [0, 0.1, 0, 0, 0, null, 0.5, null], randomize: [5, 7] },
    { odds: [0, 0, 0, 0, 0, null, 1, null], randomize: [5, 7], scale: [1, 1, 1, 1, 1, 0.1, 1, 0.1] },
    { odds: [null, 1, null, 0, 0, 0, 0, 0], randomize: [0, 2], scale: [0.1, 1, 0.1, 1, 1, 1, 1, 1] },
    { odds: [null, null, null, null, null, null, null, null], randomize: [0,1,2,3,4,5,6,7] }
];

function preload() {
    simulationShader = loadShader('shaders/passthrough.vert', 'shaders/simulation.frag');
    renderShader = loadShader('shaders/passthrough.vert', 'shaders/render.frag');
}

function setup() {
    createCanvas(sW, sH, WEBGL);
    pixelDensity(1);
    noCursor();
    frameRate(fps);
    noStroke();

    // 2D buffers for state (works as texture source)
    stateA = createGraphics(sW, sH);
    stateB = createGraphics(sW, sH);
    stateA.pixelDensity(1);
    stateB.pixelDensity(1);
    stateA.background(0);
    stateB.background(0);

    // WEBGL buffer for simulation output (for capturing)
    simOutput = createGraphics(sW, sH, WEBGL);
    simOutput.pixelDensity(1);
    simOutput.noStroke();

    target = new Target();
    setupPattern();

    console.log("GridJoe GPU initialized");
}

function setupPattern() {
    choose = int(random(maxChoices));
    console.log("Pattern:", choose);

    let pattern = patterns[choose];
    for (let i = 0; i < 8; i++) {
        if (pattern.odds[i] === null || pattern.randomize.includes(i)) {
            let val = random(1);
            if (pattern.scale && pattern.scale[i]) {
                val *= pattern.scale[i];
            }
            odds[i] = val;
        } else {
            odds[i] = pattern.odds[i];
        }
    }
}

function draw() {
    target.run();
    if (target.armResetAll) {
        resetAll();
        target.armResetAll = false;
    }

    let readBuf = currentState === 0 ? stateA : stateB;
    let writeBuf = currentState === 0 ? stateB : stateA;

    // Step 1: Run simulation shader to offscreen buffer
    simOutput.shader(simulationShader);
    simulationShader.setUniform('u_state', readBuf);
    simulationShader.setUniform('u_resolution', [sW, sH]);
    simulationShader.setUniform('u_target', [target.posX, target.posY]);
    simulationShader.setUniform('u_targetClicked', target.clicked ? 1.0 : 0.0);
    simulationShader.setUniform('u_time', millis() / 1000.0);
    simulationShader.setUniform('u_deltaTime', deltaTime / 1000.0);
    simulationShader.setUniform('u_oddsNW', odds[0]);
    simulationShader.setUniform('u_oddsN', odds[1]);
    simulationShader.setUniform('u_oddsNE', odds[2]);
    simulationShader.setUniform('u_oddsW', odds[3]);
    simulationShader.setUniform('u_oddsE', odds[4]);
    simulationShader.setUniform('u_oddsSW', odds[5]);
    simulationShader.setUniform('u_oddsS', odds[6]);
    simulationShader.setUniform('u_oddsSE', odds[7]);
    simulationShader.setUniform('u_delayFrames', delayCounter);
    simulationShader.setUniform('u_lifeFrames', lifeCounter);
    simulationShader.setUniform('u_respawnFrames', respawnCounter);
    simulationShader.setUniform('u_chaos', globalChaos);
    simOutput.rect(-sW/2, -sH/2, sW, sH);

    // Step 2: Copy simulation output to 2D write buffer (state preservation)
    writeBuf.image(simOutput, 0, 0);

    // Swap buffers
    currentState = 1 - currentState;

    // Step 3: Render to screen using the render shader
    background(0);
    shader(renderShader);
    renderShader.setUniform('u_state', writeBuf);
    renderShader.setUniform('u_resolution', [sW, sH]);
    renderShader.setUniform('u_time', millis() / 1000.0);
    rect(-sW/2, -sH/2, sW, sH);
    resetShader();
}

function keyPressed() {
    resetAll();
}

function resetAll() {
    stateA.background(0);
    stateB.background(0);
    setupPattern();
}

// Target class
class Target {
    constructor() {
        this.speedMin = 0.01;
        this.speedMax = 0.05;
        this.speed = 0.03;
        this.clickOdds = 0.1;
        this.chooseOdds = 0.01;
        this.markTime = 0;
        this.timeInterval = 200;
        this.posX = 0;
        this.posY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.minDist = 5;
        this.clicked = false;
        this.armResetAll = false;
        this.pickTarget();
    }

    run() {
        this.posX = lerp(this.posX, this.targetX, this.speed);
        this.posY = lerp(this.posY, this.targetY, this.speed);
        if (millis() > this.markTime + this.timeInterval ||
            dist(this.posX, this.posY, this.targetX, this.targetY) < this.minDist) {
            this.pickTarget();
        }
    }

    pickTarget() {
        this.markTime = millis();
        this.targetX = lerp(this.posX, random(-sW/2, sW/2), 0.5);
        this.targetY = lerp(this.posY, random(-sH/2, sH/2), 0.5);
        this.speed = random(this.speedMin, this.speedMax);
        let r = random(1);
        if (r < this.clickOdds) this.clicked = !this.clicked;
        if (r < this.chooseOdds) this.armResetAll = true;
    }
}
