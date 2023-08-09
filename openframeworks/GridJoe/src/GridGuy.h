#pragma once
#include "ofMain.h"

class GridGuy {
    
    public:
        GridGuy(float x, float y, float w, float h, string s, float cc, int dc, int lc, int rc);
        void run(float &x, float &y, bool &b);
        void update(float &x, float &y, bool &b);
        void mainFire();
        void draw();
        void drawPoint();
        void drawEllipse();
        void drawRect();
        
        vector<string> rulesArray = { "NWcorner", "NEcorner", "SWcorner", "SEcorner", "Nrow", "Srow", "Wrow", "Erow" };
        vector<bool> switchArray = { false, false, false, false, false, false, false, false };

        bool hovered, clicked, kaboom;
        ofColor strokeColor, fillColorOrig, fillColor, hoveredColor, clickedColor;
        float posX, posY, guyWidth, guyHeight, chaos;
        string applyRule;
        int delayCountDownOrig, delayCountDown, lifeCountDownOrig, lifeCountDown, respawnCountDownOrig, respawnCountDown;
        int birthTime, alpha;
            
};
