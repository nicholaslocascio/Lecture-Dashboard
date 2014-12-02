//
//  ViewController.h
//  HuhOrb
//
//  Created by Nick Locascio on 12/1/14.
//  Copyright (c) 2014 Wanna Koala. All rights reserved.
//

#import <Cocoa/Cocoa.h>

#include <IOKit/IOKitLib.h>
#include <IOKit/serial/IOSerialKeys.h>
#include <IOKit/IOBSD.h>
#include <IOKit/serial/ioss.h>
#include <sys/ioctl.h>

@interface ViewController : NSViewController {
    int serialFileDescriptor; // file handle to the serial port
    struct termios gOriginalTTYAttrs; // Hold the original termios attributes so we can reset them on quit ( best practice )
    bool readThreadRunning;
    NSTextStorage *storage;
    IBOutlet NSPopUpButton *serialListPullDown;

}

@property (weak) IBOutlet NSTextField *statusLabel;
@property (weak) IBOutlet NSTextField *sessionInput;
@property (weak) IBOutlet NSTextField *errorLabel;


- (NSString *) openSerialPort: (NSString *)serialPortFile baud: (speed_t)baudRate;
- (void)appendToIncomingText: (id) text;
- (void)incomingTextUpdateThread: (NSThread *) parentThread;
- (void) refreshSerialList: (NSString *) selectedText;
- (void) writeString: (NSString *) str;
- (void) writeByte: (uint8_t *) val;
- (IBAction) serialPortSelected: (id) cntrl;
- (IBAction) refreshAction: (id) cntrl;

@end

