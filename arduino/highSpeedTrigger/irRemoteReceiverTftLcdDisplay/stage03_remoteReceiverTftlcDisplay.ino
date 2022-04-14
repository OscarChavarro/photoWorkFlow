/*
This code requires to use the library from https://github.com/JoaoLopesF/SPFD5408
Oscar Chavarro, April 10 / 2022
*/

#include <SPFD5408_Adafruit_GFX.h>
#include <SPFD5408_Adafruit_TFTLCD.h>
#include <SPFD5408_TouchScreen.h>
#include <math.h>
#include <string.h>

//#define DECODE_SONY
#include <IRremote.hpp>

// 16bpp: R 5 G 6 B 5
#define BLACK   0x0000
#define BLUE    0x001F
#define GREEN   0x07E0
#define RED     0xF800
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF

#define LCD_CS A3 // Chip Select goes to Analog 3
#define LCD_CD A2 // Command/Data goes to Analog 2
#define LCD_WR A1 // LCD Write goes to Analog 1
#define LCD_RD A0 // LCD Read goes to Analog 0
#define LCD_RESET A4 // Can alternately just connect to Arduino's reset pin

static Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);
static int tickCounter = 0;
static int frameCounter = 0;
static const int RECV_PIN = 22;
static char lastMessage[100] = "None";

void
setup() {
    Serial.begin(115200);
    Serial.println("=== STARTING ===");
    IrReceiver.begin(RECV_PIN, true);
    printActiveIRProtocols(&Serial);
    Serial.println();

    tft.reset();
    tft.begin(0x9341); // SDFP5408
    tft.setRotation(2);
    tft.fillScreen(BLACK);
    display();
}

void
display() {
    int w = tft.width();
    int h = tft.height();
    int x = 0;
    int y = 150;
    tft.fillRect(x, y, w, 50, BLUE);

    tft.setCursor(x + 5, y + 3);
    tft.setTextColor(YELLOW);
    tft.setTextSize(3);
    tft.print("Frame: ");
    tft.println(frameCounter);

    tft.setCursor(x + 5, y + 28 + 6);
    tft.setTextSize(2);
    tft.print(lastMessage);
}

void
loop() {
    if ( IrReceiver.decode() ) {
        IrReceiver.printIRResultShort(&Serial);
        Serial.println(IrReceiver.decodedIRData.command, HEX);
        IrReceiver.resume();

        sprintf(lastMessage, "Command 0x%X", IrReceiver.decodedIRData.command);
        tickCounter++;
    }

    if ( tickCounter > 0 ) {
        tickCounter = 0;
        frameCounter++;
        display();
    }
}
