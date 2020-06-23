#include "GridGuy.h"

GridGuy::GridGuy(float x, float y, float w, float h, string s, float cc, int dc, int lc, int rc) {
    birthTime = ofGetElapsedTimeMillis();
    alpha = 255;
    
    fillColorOrig = ofColor(0);
    fillColor = fillColorOrig;
    
    clickedColor = ofColor(255);

    clicked = false;
    kaboom = false;

    posX = x;
    posY = y;
    guyWidth = w;
    guyHeight = h;
    applyRule = s;

    chaos = abs(1.0 - cc);
    delayCountDownOrig = int(ofRandom(dc * chaos, dc));
    delayCountDown = delayCountDownOrig;
    lifeCountDownOrig = int(ofRandom(lc * chaos, lc));
    lifeCountDown = lifeCountDownOrig;
    respawnCountDownOrig = int(ofRandom(rc * chaos, rc));
    respawnCountDown = respawnCountDownOrig;
    
    for (int i = 0; i < rulesArray.size(); i++) {
        if (applyRule == rulesArray[i]) {
            switchArray[i] = true;
        }
    }
}

void GridGuy::run() {
    update();
    draw();
}

void GridGuy::update() {
    if (kaboom) {
        alpha = 255;
        birthTime = ofGetElapsedTimeMillis();
    
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

void GridGuy::mainFire() {
    clicked = true;
    kaboom = false;
    delayCountDown = delayCountDownOrig;
    lifeCountDown = lifeCountDownOrig;
    respawnCountDown = respawnCountDownOrig;
}

void GridGuy::draw() {
    fillColor = fillColorOrig;

    if (clicked) {
        fillColor = clickedColor;
    }

    alpha -= ((ofGetElapsedTimeMillis() - birthTime)/2);
    drawRect();
}

void GridGuy::drawRect() {
    ofSetColor(fillColor, alpha);
    ofDrawRectangle(posX, posY, guyWidth, guyHeight);
}

void GridGuy::drawPoint() {
    ofSetColor(fillColor, alpha);
    ofSetLineWidth(guyWidth);
    ofPoint(posX, posY);
}

void GridGuy::drawEllipse() {
    ofSetColor(fillColor, alpha);
    ofDrawEllipse(posX, posY, guyWidth, guyHeight);
}



