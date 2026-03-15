"use strict";

let sW = 640;
let sH = 480;
let minimalShader;

let targetX = 0;
let targetY = 0;
let destX = 100;
let destY = 100;

function preload() {
    minimalShader = loadShader('shaders/passthrough.vert', 'shaders/minimal.frag');
}

function setup() {
    createCanvas(sW, sH, WEBGL);
    pixelDensity(1);
    noStroke();
    console.log("Minimal test - should show gradient and red dot");
}

function draw() {
    // Move target
    targetX = lerp(targetX, destX, 0.03);
    targetY = lerp(targetY, destY, 0.03);
    if (dist(targetX, targetY, destX, destY) < 5) {
        destX = random(-sW/2, sW/2);
        destY = random(-sH/2, sH/2);
    }

    background(0);
    shader(minimalShader);
    minimalShader.setUniform('u_resolution', [sW, sH]);
    minimalShader.setUniform('u_target', [targetX, targetY]);
    minimalShader.setUniform('u_time', millis() / 1000.0);
    rect(-sW/2, -sH/2, sW, sH);
    resetShader();
}
