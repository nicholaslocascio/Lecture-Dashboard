#include "LPD8806.h"
#include "SPI.h"


/*****************************************************************************/

// Number of RGB LEDs in strand:
int nLEDs = 4;

// Chose 2 pins for output; can be any valid output pins:
int dataPin  = 2;
int clockPin = 3;


// First parameter is the number of LEDs in the strand.  The LED strips
// are 32 LEDs per meter but you can extend or cut the strip.  Next two
// parameters are SPI data and clock pins:
LPD8806 strip = LPD8806(nLEDs, dataPin, clockPin);

//Called when Arduino starts, sets color to red to start, 
//Will only stay red if no data comes over USB, indicating a problem
void setup() {
  //Set baud rate for data
  Serial.begin(9600);
  randomSeed(analogRead(0));
  // Start up the LED strip
  strip.begin();

  // Update the strip, to start they are all 'off'
  strip.show();

  uint8_t* rgb = getRGBForScore(0);
  setColor(rgb[0], rgb[1], rgb[2], 30);
}

//Called continuously to update LED colors
void loop() {
         

         if (Serial.available() > 0) {
                // read the incoming byte:
                int incomingData = Serial.parseInt();

                //Convert to percentage score
                float score = ((float)incomingData)/100;
                uint8_t* rgb = getRGBForScore(score);
                setColor(rgb[0], rgb[1], rgb[2], 30);    
        }
}

uint8_t* getRGBForScore(float score)
{
  //Using score^3 as our scaling factor made the corresponding colors feel right
  uint8_t r=0x7F * (1 - (score*score*score));
  uint8_t g= 0x7F * (score*score*score);
  uint8_t b= 0;
  uint8_t rgb[3];
  rgb[0] = r;
  rgb[1] = g;
  rgb[2] = b;
  return &rgb[0];
}


void setColor(int r, int g, int b, uint8_t wait){
  // Start by turning all pixels off:
    for(int i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, 0);
    }


    uint32_t c = strip.Color(r, g, b);
    //Set all leds to be color c
    for(int i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, c);
    }

    delay(wait);
    strip.show();
}

