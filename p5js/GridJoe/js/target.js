"use strict";

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
