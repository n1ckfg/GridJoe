"use strict";

let sW = 640;
let sH = 480;

let simShader;
let debugShader;
let bufferA, bufferB;
let currentBuffer = 0;

let target;

function preload() {
    // Use simple simulation shader for testing
    simShader = loadShader('shaders/passthrough.vert', 'shaders/simple_sim.frag');
    debugShader = loadShader('shaders/passthrough.vert', 'shaders/debug.frag');
}

function setup() {
    createCanvas(sW, sH, WEBGL);
    pixelDensity(1);
    noStroke();

    bufferA = createGraphics(sW, sH, WEBGL);
    bufferB = createGraphics(sW, sH, WEBGL);
    bufferA.pixelDensity(1);
    bufferB.pixelDensity(1);
    bufferA.noStroke();
    bufferB.noStroke();
    bufferA.background(0);
    bufferB.background(0);

    target = {
        posX: 0,
        posY: 0,
        targetX: 100,
        targetY: 100,
        speed: 0.03,
        clicked: true
    };

    console.log("Debug setup complete - using simple_sim shader");
}

function draw() {
    // Move target
    target.posX = lerp(target.posX, target.targetX, target.speed);
    target.posY = lerp(target.posY, target.targetY, target.speed);
    if (dist(target.posX, target.posY, target.targetX, target.targetY) < 5) {
        target.targetX = random(-sW/2, sW/2);
        target.targetY = random(-sH/2, sH/2);
    }

    let readBuf = currentBuffer === 0 ? bufferA : bufferB;
    let writeBuf = currentBuffer === 0 ? bufferB : bufferA;

    // Simulation pass with minimal uniforms
    writeBuf.shader(simShader);
    simShader.setUniform('u_state', readBuf);
    simShader.setUniform('u_resolution', [sW, sH]);
    simShader.setUniform('u_target', [target.posX, target.posY]);
    simShader.setUniform('u_targetClicked', 1.0);
    simShader.setUniform('u_time', millis() / 1000.0);
    writeBuf.rect(-sW/2, -sH/2, sW, sH);

    currentBuffer = 1 - currentBuffer;

    // Debug render
    background(0);
    shader(debugShader);
    debugShader.setUniform('u_state', writeBuf);
    debugShader.setUniform('u_resolution', [sW, sH]);
    debugShader.setUniform('u_target', [target.posX, target.posY]);
    debugShader.setUniform('u_time', millis() / 1000.0);
    rect(-sW/2, -sH/2, sW, sH);
    resetShader();
}

function keyPressed() {
    bufferA.background(0);
    bufferB.background(0);
    console.log("Reset");
}
