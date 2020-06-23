class GridGuy {

  String[] rulesArray = { "NWcorner", "NEcorner", "SWcorner", "SEcorner", "Nrow", "Srow", "Wrow", "Erow" };
  boolean[] switchArray = { false, false, false, false, false, false, false, false };
  boolean clicked, kaboom;
  color fillColorOrig, fillColor, clickedColor;
  float posX, posY, guyWidth, guyHeight, chaos;
  String applyRule;
  int delayCountDownOrig, delayCountDown, lifeCountDownOrig, lifeCountDown, respawnCountDownOrig, respawnCountDown;
  int birthTime, alpha;
  
  GridGuy(float x, float y, float w, float h, String s, float cc, int dc, int lc, int rc) {          
    birthTime = millis();
    alpha = 255;
    
    fillColorOrig = color(0);
    fillColor = fillColorOrig;
    
    clickedColor = color(random(21,87));

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
    
    for (int i = 0; i < rulesArray.length; i++) {
      if (applyRule == rulesArray[i]) {
        switchArray[i] = true;
      }
    }

    //strokeLines = true;
  }

  void run() {
    update();
    draw();
  }

  void update() {
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

  void mainFire() {
    clicked = true;
    kaboom = false;
    delayCountDown = delayCountDownOrig;
    lifeCountDown = lifeCountDownOrig;
    respawnCountDown = respawnCountDownOrig;
  }

  void draw() {
    fillColor = fillColorOrig;
    tex.noStroke();

    if(clicked) {
      fillColor = clickedColor;
    }

    alpha -= ((millis() - birthTime)/2);

    tex.fill(fillColor, alpha);
    tex.rect(posX, posY, guyWidth, guyHeight);
  }

}
