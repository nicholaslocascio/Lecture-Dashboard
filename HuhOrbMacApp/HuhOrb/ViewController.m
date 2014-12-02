//
//  ViewController.m
//  HuhOrb
//
//  Created by Nick Locascio on 12/1/14.
//  Copyright (c) 2014 Wanna Koala. All rights reserved.
//

#import "ViewController.h"
#import <AFNetworking.h>

@implementation ViewController


- (IBAction)didSelect:(id)sender {
}

- (void)updateSession {
    NSString *sessionId = [self.sessionInput stringValue];
    if (!sessionId || [sessionId isEqualToString:@""]) {
        return;
    }
    
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    NSString *host = @"http://ld-kulpreet.rhcloud.com/";
    NSString *urlPath = [NSString stringWithFormat:@"api/session/?id=%@", sessionId];
    NSString *url = [NSString stringWithFormat: @"%@%@", host, urlPath];
    [manager GET:url parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSLog(@"JSON: %@", responseObject);
        if (!responseObject) {
            self.errorLabel.stringValue = @"Unknown Error";
        } else {
            [self updateStatusWithData: responseObject];
            [self updateOrbColorWithData: responseObject];
            self.errorLabel.stringValue = @"";
        }
        
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"Error: %@", error);
        self.errorLabel.stringValue = error.localizedDescription;
    }];
}

- (void)updateOrbColorWithData:(id)data {
    NSArray *scores = data[@"scores"];
    if (!scores || [scores count] < 1) {
        return;
    }
    NSDictionary *score = scores.lastObject;
    NSString *totalString = score[@"total"];
    NSString *confusedString = score[@"confused"];
    CGFloat total = [totalString floatValue];
    CGFloat confused = [confusedString floatValue];
    CGFloat ratio = (1.0f-confused/total);
    int percentage = (int)(ratio*100);
    NSString *percentageString = [NSString stringWithFormat:@"%i", percentage];

    // send the text to the Arduino
    [self writeString: percentageString];
}

- (IBAction)didSubmit:(id)sender {
    NSString *sessionId = [self.sessionInput stringValue];
    if (!sessionId) {
        sessionId = @"te";
    }
    [self updateSession];
}

- (void)updateStatusWithData:(id)responseObject {
    self.statusLabel.stringValue = [NSString stringWithFormat:@"Connected to class: %@ with lecturer: %@",
                                    responseObject[@"className"], responseObject[@"lecturerName"]];
    
}

- (void)setRepresentedObject:(id)representedObject {
    [super setRepresentedObject:representedObject];

    // Update the view, if already loaded.
}

//


// executes after everything in the xib/nib is initiallized
- (void)awakeFromNib {
    // we don't have a serial port open yet
    serialFileDescriptor = -1;
    readThreadRunning = FALSE;
    
    // first thing is to refresh the serial port list
    [self refreshSerialList:@"Select a Serial Port"];
    
    self.statusLabel.stringValue = @"Not connected";
    
    // Do any additional setup after loading the view.
    
    [NSTimer scheduledTimerWithTimeInterval:1
                                     target:self
                                   selector:@selector(updateSession)
                                   userInfo:nil
                                    repeats:YES];
    
}

// open the serial port
//   - nil is returned on success
//   - an error message is returned otherwise
- (NSString *) openSerialPort: (NSString *)serialPortFile baud: (speed_t)baudRate {
    int success;
    
    // close the port if it is already open
    if (serialFileDescriptor != -1) {
        close(serialFileDescriptor);
        serialFileDescriptor = -1;
        
        // wait for the reading thread to die
        while(readThreadRunning);
        
        // re-opening the same port REALLY fast will fail spectacularly... better to sleep a sec
        sleep(0.5);
    }
    
    // c-string path to serial-port file
    const char *bsdPath = [serialPortFile cStringUsingEncoding:NSUTF8StringEncoding];
    
    // Hold the original termios attributes we are setting
    struct termios options;
    
    // receive latency ( in microseconds )
    unsigned long mics = 3;
    
    // error message string
    NSMutableString *errorMessage = nil;
    
    // open the port
    //     O_NONBLOCK causes the port to open without any delay (we'll block with another call)
    serialFileDescriptor = open(bsdPath, O_RDWR | O_NOCTTY | O_NONBLOCK );
    
    if (serialFileDescriptor == -1) {
        // check if the port opened correctly
        errorMessage = @"Error: couldn't open serial port";
    } else {
        // TIOCEXCL causes blocking of non-root processes on this serial-port
        success = ioctl(serialFileDescriptor, TIOCEXCL);
        if ( success == -1) {
            errorMessage = @"Error: couldn't obtain lock on serial port";
        } else {
            success = fcntl(serialFileDescriptor, F_SETFL, 0);
            if ( success == -1) {
                // clear the O_NONBLOCK flag; all calls from here on out are blocking for non-root processes
                errorMessage = @"Error: couldn't obtain lock on serial port";
            } else {
                // Get the current options and save them so we can restore the default settings later.
                success = tcgetattr(serialFileDescriptor, &gOriginalTTYAttrs);
                if ( success == -1) {
                    errorMessage = @"Error: couldn't get serial attributes";
                } else {
                    // copy the old termios settings into the current
                    //   you want to do this so that you get all the control characters assigned
                    options = gOriginalTTYAttrs;
                    
                    /*
                     cfmakeraw(&options) is equivilent to:
                     options->c_iflag &= ~(IGNBRK | BRKINT | PARMRK | ISTRIP | INLCR | IGNCR | ICRNL | IXON);
                     options->c_oflag &= ~OPOST;
                     options->c_lflag &= ~(ECHO | ECHONL | ICANON | ISIG | IEXTEN);
                     options->c_cflag &= ~(CSIZE | PARENB);
                     options->c_cflag |= CS8;
                     */
                    cfmakeraw(&options);
                    
                    // set tty attributes (raw-mode in this case)
                    success = tcsetattr(serialFileDescriptor, TCSANOW, &options);
                    if ( success == -1) {
                        errorMessage = @"Error: coudln't set serial attributes";
                    } else {
                        // Set baud rate (any arbitrary baud rate can be set this way)
                        success = ioctl(serialFileDescriptor, IOSSIOSPEED, &baudRate);
                        if ( success == -1) {
                            errorMessage = @"Error: Baud Rate out of bounds";
                        } else {
                            // Set the receive latency (a.k.a. don't wait to buffer data)
                            success = ioctl(serialFileDescriptor, IOSSDATALAT, &mics);
                            if ( success == -1) {
                                errorMessage = @"Error: coudln't set serial latency";
                            }
                        }
                    }
                }
            }
        }
    }
    
    // make sure the port is closed if a problem happens
    if ((serialFileDescriptor != -1) && (errorMessage != nil)) {
        close(serialFileDescriptor);
        serialFileDescriptor = -1;
    }
    
    return errorMessage;
}

- (void) refreshSerialList: (NSString *) selectedText {
    io_object_t serialPort;
    io_iterator_t serialPortIterator;
    
    // remove everything from the pull down list
    [serialListPullDown removeAllItems];
    
    // ask for all the serial ports
    IOServiceGetMatchingServices(kIOMasterPortDefault, IOServiceMatching(kIOSerialBSDServiceValue), &serialPortIterator);
    
    // loop through all the serial ports and add them to the array
    while (serialPort = IOIteratorNext(serialPortIterator)) {
        [serialListPullDown addItemWithTitle:
         (__bridge NSString*)IORegistryEntryCreateCFProperty(serialPort, CFSTR(kIOCalloutDeviceKey),  kCFAllocatorDefault, 0)];
        IOObjectRelease(serialPort);
    }
    
    // add the selected text to the top
    [serialListPullDown insertItemWithTitle:selectedText atIndex:0];
    [serialListPullDown selectItemAtIndex:0];
    
    IOObjectRelease(serialPortIterator);
}

// send a string to the serial port
- (void) writeString: (NSString *) str {
    if(serialFileDescriptor!=-1) {
        write(serialFileDescriptor, [str cStringUsingEncoding:NSUTF8StringEncoding], [str length]);
    } else {
        // make sure the user knows they should select a serial port
        self.errorLabel.stringValue = @"ERROR:  Select a Serial Port from the pull-down menu";
    }
}

// send a byte to the serial port
- (void) writeByte: (uint8_t *) val {
    if(serialFileDescriptor!=-1) {
        write(serialFileDescriptor, val, 1);
    } else {
        // make sure the user knows they should select a serial port
        self.errorLabel.stringValue = @"\n ERROR:  Select a Serial Port from the pull-down menu\n";
    }
}

// action sent when serial port selected
- (IBAction) serialPortSelected: (id) cntrl {
    // open the serial port
    NSString *error = [self openSerialPort: [serialListPullDown titleOfSelectedItem] baud:9600];
    
    if(error!=nil) {
        [self refreshSerialList:error];
        self.errorLabel.stringValue = error;
    } else {
        [self refreshSerialList:[serialListPullDown titleOfSelectedItem]];
        [self performSelectorInBackground:@selector(incomingTextUpdateThread:) withObject:[NSThread currentThread]];
    }
}

// action from refresh button 
- (IBAction) refreshAction: (id) cntrl {
    [self refreshSerialList:@"Select a Serial Port"];
    
    // close serial port if open
    if (serialFileDescriptor != -1) {
        close(serialFileDescriptor);
        serialFileDescriptor = -1;
    }
}

// action from the reset button
- (IBAction) resetButton: (NSButton *) btn {
    // set and clear DTR to reset an arduino
    struct timespec interval = {0,100000000}, remainder;
    if(serialFileDescriptor!=-1) {
        ioctl(serialFileDescriptor, TIOCSDTR);
        nanosleep(&interval, &remainder); // wait 0.1 seconds
        ioctl(serialFileDescriptor, TIOCCDTR);
    }
}

@end
