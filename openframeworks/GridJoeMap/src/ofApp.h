#pragma once

#include "ofMain.h"
#include "ofxXmlSettings.h"
#include "GridGuy.h"
#include "Target.h"

class ofApp : public ofBaseApp {

	public:
		void setup();
		void update();
		void draw();
		void keyPressed(int key);
    
        void initGlobals();
        void rulesHandler(int x, int y);
        bool diceHandler(float v1, float v2);
        void rulesInit(int x, int y);
        void guysInit(int x, int y);
        void resetAll();
        void pixelOddsSetup();
 
        ofShader shader;
        ofPlanePrimitive plane;
        ofFbo fbo;
        ofxXmlSettings settings;
        
        //---   MAIN CONTROLS   ---
        //if you want to avoid chain reactions, try 0, 20, 100, 0.2
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
        int pixelSize;
        int sW = 720;
        int sH = 480;
        int fps = 30;

        int numColumns, numRows;
        float guyWidth, guyHeight, startX, startY;
        vector<vector<GridGuy>> mainGrid;
        string setRules = "";
        float odds_X_Yplus1, odds_Xminus1_Y, odds_X_Yminus1, odds_Xplus1_Y, odds_Xplus1_Yplus1, odds_Xminus1_YminuX1, odds_Xplus1_Yminus1, odds_Xminus1_Yplus1;
        vector<float> randomValues = { 0, 0, 0, 0, 0, 0, 0, 0 };
            
        Target target;

};
