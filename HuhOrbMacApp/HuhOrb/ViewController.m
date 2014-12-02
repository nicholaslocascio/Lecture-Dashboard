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

- (void)viewDidLoad {
    [super viewDidLoad];
    self.statusLabel.stringValue = @"Not connected";

    // Do any additional setup after loading the view.
    
    [NSTimer scheduledTimerWithTimeInterval:2.0
                                     target:self
                                   selector:@selector(updateSession)
                                   userInfo:nil
                                    repeats:YES];
}
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
            self.errorLabel.stringValue = @"";
        }
        
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"Error: %@", error);
        self.errorLabel.stringValue = error.localizedDescription;
    }];
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

@end
