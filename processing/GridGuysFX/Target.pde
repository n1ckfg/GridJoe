class Target {
  float posX, posY, targetX, targetY;
  int minDist;
  float speedMin = 0.01;
  float speedMax = 0.05;
  float speed;
  boolean clicked;
  float clickOdds = 0.1;
  float chooseOdds = 0.01;
  int markTime = 0;
  int timeInterval = 200;
  
  Target() {
    posX = width/2;
    posY = width/2;
    minDist = 5;
    clicked = false;
    
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
    
    targetX = lerp(posX, random(0, width), 0.5);
    targetY = lerp(posY, random(0, height), 0.5);
    
    speed = random(speedMin, speedMax);
    float r = random(1);
    if (r < clickOdds) clicked = !clicked;
    if (r < chooseOdds) resetAll();
  }
  
}
