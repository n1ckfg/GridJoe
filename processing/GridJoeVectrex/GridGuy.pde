class GridGuy {

  String[] rulesArray = { "NWcorner", "NEcorner", "SWcorner", "SEcorner", "Nrow", "Srow", "Wrow", "Erow" };
  boolean[] switchArray = { false, false, false, false, false, false, false, false };
  color[] fillColorArray = {      
    color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 0, 255), color(50), color(60), color(70), color(80)
  };
  boolean debugColors, strokeLines, hovered, clicked, kaboom;
  color strokeColor, fillColorOrig, fillColor, hoveredColor, clickedColor;
  float posX, posY, guyWidth, guyHeight, chaos;
  String applyRule;
  int delayCountDownOrig, delayCountDown, lifeCountDownOrig, lifeCountDown, respawnCountDownOrig, respawnCountDown;
  int birthTime, alpha;
  float xyscope_spread = 2;
  
  GridGuy(float x, float y, float w, float h, String s, float cc, int dc, int lc, int rc) {          
    birthTime = millis();
    alpha = 255;
    
    fillColorOrig = color(0);
    fillColor = fillColorOrig;
    
    hoveredColor = color(0);
    clickedColor = color(random(21,87));

    hovered = false;
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
    if (dist(target.posX, target.posY, posX, posY) < guyWidth) {
      hovered = true;
      birthTime = millis();
      alpha = 255;
    } else {
      hovered = false;
    }

    if (hovered && target.clicked) mainFire();

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

    if (hovered && !clicked) {
      fillColor = hoveredColor;
    } else if(clicked) {
      fillColor = clickedColor;
    }
    
    if (fillColor != fillColorOrig) {
      alpha -= ((millis() - birthTime)/2);
      drawRect();
      xy.line(posX, posY, posX + random(-xyscope_spread, xyscope_spread), posY + random(-xyscope_spread, xyscope_spread));
      totalPointsCounter++;
    }
  }

  void drawRect() {
    tex.fill(fillColor, alpha);
    tex.rectMode(CENTER);
    tex.rect(posX, posY, guyWidth, guyHeight);
  }
  
  void drawPoint() {
    stroke(fillColor, alpha);
    strokeWeight(guyWidth);
    point(posX, posY);
  }

  void drawEllipse() {
    fill(fillColor, alpha);
    ellipseMode(CENTER);
    ellipse(posX, posY, guyWidth, guyHeight);
  }

}
