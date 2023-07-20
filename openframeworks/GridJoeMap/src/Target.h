#pragma once
#include "ofMain.h"

class Target {
    
    public:
        Target();
        void run();
        void pickTarget();
    
        float posX, posY, targetX, targetY;
        int minDist;
        float speedMin, speedMax, speed;
        bool clicked, armResetAll;
        float clickOdds, chooseOdds;
        int markTime, timeInterval;
    
};
