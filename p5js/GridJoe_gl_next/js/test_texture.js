"use strict";

let sW = 640;
let sH = 480;
let texShader;
let testGraphics;

let targetX = 0;
let targetY = 0;
let destX = 100;
let destY = 100;

function preload() {
    texShader = loadShader('shaders/passthrough.vert', 'shaders/texture_test.frag');
}

function setup() {
    createCanvas(sW, sH, WEBGL);
    pixelDensity(1);
    noStroke();

    // Create a 2D graphics buffer with some content
    testGraphics = createGraphics(sW, sH);
    testGraphics.pixelDensity(1);
    testGraphics.background(0);

    // Draw some test pattern
    testGraphics.noStroke();
    for (let i = 0; i < 20; i++) {
        testGraphics.fill(random(255), random(255), random(255));
        testGraphics.ellipse(random(sW), random(sH), 50, 50);
    }

    console.log("Texture test - should show colored circles and red dot");
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
    shader(texShader);
    texShader.setUniform('u_tex', testGraphics);
    texShader.setUniform('u_resolution', [sW, sH]);
    texShader.setUniform('u_target', [targetX, targetY]);
    rect(-sW/2, -sH/2, sW, sH);
    resetShader();
}
