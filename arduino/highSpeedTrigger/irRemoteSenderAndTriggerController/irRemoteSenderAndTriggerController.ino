/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

//= Manual configuration ===============================================

// true: uses laser detector, false: uses photoresistor
boolean useLaserModule = true;

#define IR_SEND_PIN 13
#define PHOTORESISTOR_INPUT_PIN A0
#define LASER_MODULE_INPUT_PIN 2

//======================================================================

#define DECODE_SONY

#include <IRremote.hpp>
#include <string.h>

#define DELAY_MILLISECONDS 10

int sensorValue = 0;
int laserModuleValue = 0;

int prevValue = 0;
int deltaValue;
int tokenCount = 0;
int currentTime = 0;
int deltaTimeForDetections = 10000;

void
setup() {
    Serial.begin(115200);
    Serial.println("");
    Serial.println("==== SENSOR TEST ====");
    pinMode(IR_SEND_PIN, OUTPUT);
    IrSender.begin(IR_SEND_PIN);
}

void
sendShutterCommand() {
    for ( int i = 0; i < 2; i++ ) {
        IrSender.sendSony(0x1E3A, 0x2D, 1, SIRCS_20_PROTOCOL); 
        delay(100);     
    }
}

void
printValuesTrigger(boolean trigger) {
    if ( !trigger ) {
        return;
    }
    Serial.println("T");
}

void
updateSensors() {
    if ( useLaserModule ) {
        prevValue = laserModuleValue;
        laserModuleValue = digitalRead(LASER_MODULE_INPUT_PIN);
        deltaValue = laserModuleValue - prevValue;
    } else {
        prevValue = sensorValue;
        sensorValue = analogRead(PHOTORESISTOR_INPUT_PIN);
        deltaValue = sensorValue - prevValue;
    }  
}

boolean
triggerLogicPhotoresistor() {
    static int prevDetectionTime = 0;
    if ( deltaValue < 10 ) {
        return false;
    }

    int deltaTime = currentTime - prevDetectionTime;
    prevDetectionTime = currentTime;

    if ( deltaTime < 3 * DELAY_MILLISECONDS ) {
        return false;
    }
    
    return true;
}

boolean
triggerLogicLaserModule() {
    static int prevDetectionTime = 0;
    if ( deltaValue < 1 ) {
        return false;
    }

    int deltaTime = currentTime - prevDetectionTime;
    prevDetectionTime = currentTime;

    if ( deltaTime < 3 * DELAY_MILLISECONDS ) {
        return false;
    }
    
    return true;
}

boolean
triggerLogic() {
    if ( useLaserModule ) {
        return triggerLogicLaserModule();
    } else {
        return triggerLogicPhotoresistor();
    }
}

void
updateTime() {
    currentTime += DELAY_MILLISECONDS;
    if ( currentTime > 36000 ) {
        currentTime = 0;
    }
}

void
loop() {
    delay(DELAY_MILLISECONDS);
    updateTime();

    updateSensors();
    boolean trigger = triggerLogic();

    printValuesTrigger(trigger);
    if ( trigger ) {
        sendShutterCommand();
    }    
}
