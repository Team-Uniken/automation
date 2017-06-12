//
//  ReactRdnaModule.h
//  ReactReferenceApp1
//
//  Created by Sudarshan on 3/29/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "RDNA.h"

@interface ReactRdnaModule : RCTEventEmitter<RCTBridgeModule,RDNACallbacks>
+(void)terminateRDNA;
@end
