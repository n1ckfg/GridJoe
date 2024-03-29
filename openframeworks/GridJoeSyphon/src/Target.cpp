#include "Target.h"
#include "ofApp.h"

Target::Target(int w, int h) {
    sW = w;
    sH = h;
    
    speedMin = 0.01;
    speedMax = 0.05;
    clickOdds = 0.1;
    chooseOdds = 0.01;
    markTime = 0;
    timeInterval = 200;

    posX = sW/2;
    posY = sH/2;
    minDist = 5;
    clicked = false;
    armResetAll = false;
    
    pickTarget();
}

void Target::run() {
    posX = ofLerp(posX, targetX, speed);
    posY = ofLerp(posY, targetY, speed);

    if (ofGetElapsedTimeMillis() > markTime + timeInterval || ofDist(posX, posY, targetX, targetY) < minDist) {
      pickTarget();
    }
}

void Target::pickTarget() {
    markTime = ofGetElapsedTimeMillis();

    targetX = ofLerp(posX, ofRandom(0, sW), 0.5);
    targetY = ofLerp(posY, ofRandom(0, sH), 0.5);

    speed = ofRandom(speedMin, speedMax);
    float r = ofRandom(1);
    if (r < clickOdds) clicked = !clicked;
    if (r < chooseOdds) armResetAll = true;
}
  
