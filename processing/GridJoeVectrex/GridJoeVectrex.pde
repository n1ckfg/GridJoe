import ddf.minim.*; // minim req to gen audio
import xyscope.*;   // import XYscope
XYscope xy;         // create XYscope instance

//---   MAIN CONTROLS   ---
// if you want to avoid chain reactions, try 0, 20, 100, 0.2
int delayCounter = 0;  // delays start of spread
int lifeCounter = 20;  // how long spread lasts
int respawnCounter = 50; // how long until retrigger
float globalChaos = 0.3;  // 0 = min, 1 = max
//-------------------------
int choose = 0;
int maxChoices = 7;
int numFrames = 50;
int renderCounterMax = 1000;
//----
int pixelSize = 8;
int sW = 512;
int sH = 512;
int fps = 60;
int totalPointsCounter = 0;
int totalPointsClearLimit = 100; // It's bad for the Vectrex hardware to clear the screen and not immediately redraw.

int numColumns, numRows;
float guyWidth, guyHeight, startX, startY;
GridGuy[][] mainGrid;
String setRules = "";
float odds_X_Yplus1, odds_Xminus1_Y, odds_X_Yminus1, odds_Xplus1_Y, odds_Xplus1_Yplus1, odds_Xminus1_YminuX1, odds_Xplus1_Yminus1, odds_Xminus1_Yplus1;

Target target;
PGraphics tex;

boolean armClearWaves = true;

void initGlobals() {
  numColumns = sW / pixelSize;
  numRows = sH / pixelSize;

  guyWidth = sW / numColumns;
  guyHeight = sH / numRows;

  startX = guyWidth / 2;
  startY = guyHeight / 2;

  // make mainGrid a 2D array
  mainGrid = new GridGuy[numColumns][numRows];
}

void rulesHandler(int x, int y) {
  boolean[] sw = mainGrid[x][y].switchArray;
  if (sw[0] || sw[1] || sw[2] || sw[3] || sw[4] || sw[5] || sw[6] || sw[7]) return;

  if (mainGrid[x][y].clicked) {
    //these are direction probabilities
    mainGrid[x][y + 1].kaboom = diceHandler(1, odds_X_Yplus1);
    mainGrid[x - 1][y].kaboom = diceHandler(1, odds_Xminus1_Y);
    mainGrid[x][y - 1].kaboom = diceHandler(1, odds_X_Yminus1);
    mainGrid[x + 1][y].kaboom = diceHandler(1, odds_Xplus1_Y);
    mainGrid[x + 1][y + 1].kaboom = diceHandler(1, odds_Xplus1_Yplus1);
    mainGrid[x - 1][y - 1].kaboom = diceHandler(1, odds_Xminus1_YminuX1);
    mainGrid[x + 1][y - 1].kaboom = diceHandler(1, odds_Xplus1_Yminus1);
    mainGrid[x - 1][y + 1].kaboom = diceHandler(1, odds_Xminus1_Yplus1);
  }
}

boolean diceHandler(float v1, float v2) { 
  float rollDice = random(v1);
  return rollDice < v2;
}

void rulesInit(int x, int y) {
  setRules = "";
  if (x == 0 && y == 0) {
    setRules = "NWcorner";
  } else if (x == numColumns - 1 && y == 0) {
    setRules = "NEcorner";
  } else if (x == 0 && y == numRows - 1) {
    setRules = "SWcorner";
  } else if (x == numColumns - 1 && y == numRows - 1) {
    setRules = "SEcorner";
  } else if (y == 0) {
    setRules = "Nrow";
  } else if (y == numRows - 1) {
    setRules = "Srow";
  } else if (x == 0) {
    setRules = "Wrow";
  } else if (x == numColumns - 1) {
    setRules = "Erow";
  }
}

void guysInit(int x, int y) { 
  mainGrid[x][y] = new GridGuy(startX, startY, guyWidth, guyHeight, setRules, globalChaos, delayCounter, lifeCounter, respawnCounter);
  if (startX < tex.width - guyWidth) {
    startX += guyWidth;
  } else {
    startX = guyWidth / 2;
    startY += guyHeight;
  }
  println("init " + x + " " + y);
}

void resetAll() {
  startX = 0;
  startY = 0;
  //currentFrame = 0;
  for (int y = 0; y < numRows; y++) {
    for (int x = 0; x < numColumns; x++) {
      mainGrid[x][y].hovered = false;
      mainGrid[x][y].clicked = false;
      //mainGrid[x][y].kaboom = false;
      mainGrid[x][y].delayCountDown = mainGrid[x][y].delayCountDownOrig;
      mainGrid[x][y].lifeCountDown = mainGrid[x][y].lifeCountDownOrig;
      mainGrid[x][y].respawnCountDown = mainGrid[x][y].respawnCountDownOrig;
      mainGrid[x][y].fillColor = mainGrid[x][y].fillColorOrig;
    }
  }
  
  pixelOddsSetup();
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

float[] randomValues = new float[8];

void pixelOddsSetup() {
  // temp
  for (int i = 0; i < randomValues.length; i++) {
    randomValues[i] = random(1);
  }

  choose = int(random(maxChoices));
  println("choose: " + choose);
  
  switch (choose) {
  case 0: 
    // 0. CROSS | OK
    //delayCounter = 4;
    odds_Xminus1_YminuX1 = 0;//randomValues[0]; // x-1 y-1
    odds_X_Yminus1 = 0.5;//randomValues[1]; // x y-1
    odds_Xplus1_Yminus1 = 0;//randomValues[2]; // x+1 y-1
    odds_Xminus1_Y = 0.5;//randomValues[3]; // x-1 y
    odds_Xplus1_Y = 0.5;//randomValues[4]; // x+1 y
    odds_Xminus1_Yplus1 = 0;//randomValues[5]; // x-1 y+1
    odds_X_Yplus1 = 0.5;//randomValues[6]; // x y+1
    odds_Xplus1_Yplus1 = 0;//randomValues[7]; // x+1 y+1    
    break;
  case 1:
    // 1. WOT | ?
    //delayCounter = 4;
    odds_Xminus1_YminuX1 = randomValues[0]; // x-1 y-1
    odds_X_Yminus1 = 1;//randomValues[1]; // x y-1
    odds_Xplus1_Yminus1 = 1;//randomValues[2]; // x+1 y-1
    odds_Xminus1_Y = randomValues[3]; // x-1 y
    odds_Xplus1_Y = 0;//randomValues[4]; // x+1 y
    odds_Xminus1_Yplus1 = 1;//randomValues[5]; // x-1 y+1
    odds_X_Yplus1 = 0;//randomValues[6]; // x y+1
    odds_Xplus1_Yplus1 = randomValues[7]; // x+1 y+1
    break;
  case 2: 
    // 2. OCEAN | OK
    //delayCounter = 4;
    odds_Xminus1_YminuX1 = 0;//randomValues[0]; // x-1 y-1
    odds_X_Yminus1 = 0;//randomValues[1]; // x y-1
    odds_Xplus1_Yminus1 = 0.1 * randomValues[2]; // x+1 y-1
    odds_Xminus1_Y = randomValues[3]; // x-1 y
    odds_Xplus1_Y = randomValues[4]; // x+1 y
    odds_Xminus1_Yplus1 = 0.1 * randomValues[5]; // x-1 y+1
    odds_X_Yplus1 = 0;//randomValues[6]; // x y+1
    odds_Xplus1_Yplus1 = 0;//randomValues[7]; // x+1 y+1 
    break;
  case 3: 
    // 3. MOUNTAINS
    //delayCounter = 4;
    odds_Xminus1_YminuX1 = 0;//randomValues[0]; // x-1 y-1
    odds_X_Yminus1 = 0.1;//randomValues[1]; // x y-1
    odds_Xplus1_Yminus1 = 0;//randomValues[2]; // x+1 y-1
    odds_Xminus1_Y = 0;//randomValues[3]; // x-1 y
    odds_Xplus1_Y = 0;//randomValues[4]; // x+1 y
    odds_Xminus1_Yplus1 = randomValues[5]; // x-1 y+1
    odds_X_Yplus1 = 0.5;//randomValues[6]; // x y+1
    odds_Xplus1_Yplus1 = randomValues[7]; // x+1 y+1  
    break;
  case 4: 
    // 4. DROPS
    //delayCounter = 4;
    odds_Xminus1_YminuX1 = 0;//randomValues[0]; // x-1 y-1
    odds_X_Yminus1 = 0;//randomValues[1]; // x y-1
    odds_Xplus1_Yminus1 = 0;//randomValues[2]; // x+1 y-1
    odds_Xminus1_Y = 0;//randomValues[3]; // x-1 y
    odds_Xplus1_Y = 0;//randomValues[4]; // x+1 y
    odds_Xminus1_Yplus1 = 0.1 * randomValues[5]; // x-1 y+1
    odds_X_Yplus1 = 1;//randomValues[6]; // x y+1
    odds_Xplus1_Yplus1 = 0.1 * randomValues[7]; // x+1 y+1  
    break;
  case 5: 
    // 5. DROPS_REVERSE
    //delayCounter = 4;
    odds_Xminus1_YminuX1 = 0.1 * randomValues[0]; // x-1 y-1
    odds_X_Yminus1 = 1;//randomValues[1]; // x y-1
    odds_Xplus1_Yminus1 = 0.1 * randomValues[2]; // x+1 y-1
    odds_Xminus1_Y = 0;//randomValues[3]; // x-1 y
    odds_Xplus1_Y = 0;//randomValues[4]; // x+1 y
    odds_Xminus1_Yplus1 = 0; //randomValues[5]; // x-1 y+1
    odds_X_Yplus1 = 0;//randomValues[6]; // x y+1
    odds_Xplus1_Yplus1 = 0; //randomValues[7]; // x+1 y+1  
    break;
  case 6:
    // 6. ALL RANDOM
    //delayCounter = 4;
    odds_Xminus1_YminuX1 = randomValues[0]; // x-1 y-1
    odds_X_Yminus1 = randomValues[1]; // x y-1
    odds_Xplus1_Yminus1 = randomValues[2]; // x+1 y-1
    odds_Xminus1_Y = randomValues[3]; // x-1 y
    odds_Xplus1_Y = randomValues[4]; // x+1 y
    odds_Xminus1_Yplus1 = randomValues[5]; // x-1 y+1
    odds_X_Yplus1 = randomValues[6]; // x y+1
    odds_Xplus1_Yplus1 = randomValues[7]; // x+1 y+1
    break;
  }
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

void setup() {
  size(50, 50, P2D);
  surface.setSize(sW, sH);
  
  tex = createGraphics(sW, sH, P2D);
  
  noCursor();

  frameRate(fps);

  pixelOddsSetup();
  initGlobals();
  
  for (int y = 0; y < numRows; y++) {
    for (int x = 0; x < numColumns; x++) {
      rulesInit(x, y);
      guysInit(x, y);
    }
  }
  
  target = new Target();

  xy = new XYscope(this); // define XYscope instance
  //xy.getMixerInfo(); // lists all audio devices
  xy.vectrex(0); // 90 for landscape, 0 for portrait
  xy.ellipseDetail(30); // set detail of vertex ellipse
  /*
   If the SPOT-KILLER MOD was applied (z/brightness is always on),
   this auto sets the brightness (from way turned down) when the sketch runs.
   */
  //xy.z("MOTU 3-4"); // use custom 3rd channel audio device
  //xy.zRange(.5, 0);
}

void draw() {
  totalPointsCounter = 0;
  if (armClearWaves) {
    xy.clearWaves();
    armClearWaves = false;
  }
  
  background(0);
  
  target.run();
  if (target.armResetAll) {
    resetAll();
    target.armResetAll = false;
  }
  
  tex.beginDraw();
  tex.background(0);
  
  for (int y = 0; y < numRows; y++) {
    for (int x = 0; x < numColumns; x++) {
      int loc = x + (y * numColumns);

      rulesHandler(x, y);
      mainGrid[x][y].run();
    }
  }
  tex.endDraw();
  
  imageMode(CENTER);
  image(tex, width/2, height/2);
  surface.setTitle("" + frameRate);

  xy.buildWaves(); // build audio from shapes
  if (totalPointsCounter > totalPointsClearLimit) armClearWaves = true;
}

//--  END
