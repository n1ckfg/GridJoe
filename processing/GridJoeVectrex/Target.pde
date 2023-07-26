class Target {
  
  float posX, posY, targetX, targetY;
  int minDist;
  float speedMin, speedMax, speed;
  boolean clicked;
  float clickOdds, chooseOdds;
  int markTime, timeInterval;
  boolean armResetAll;

  Target() {
    speedMin = 0.01;
    speedMax = 0.05;
    clickOdds = 0.1;
    chooseOdds = 0.01;
    markTime = 0;
    timeInterval = 200;
  
    posX = tex.width/2;
    posY = tex.height/2;
    minDist = 5;
    clicked = false;
    armResetAll = false;
    
    pickTarget();
  }

  void run() {
    posX = lerp(posX, targetX, speed);
    posY = lerp(posY, targetY, speed);
    
    if (millis() > markTime + timeInterval || dist(posX, posY, targetX, targetY) < minDist) {
      pickTarget();
    }
  }
  
  void pickTarget() {
    markTime = millis();
    
    targetX = lerp(posX, random(0, tex.width), 0.5);
    targetY = lerp(posY, random(0, tex.height), 0.5);
    
    speed = random(speedMin, speedMax);
    float r = random(1);
    if (r < clickOdds) clicked = !clicked;
    if (r < chooseOdds) armResetAll = true;
  }
  
}
