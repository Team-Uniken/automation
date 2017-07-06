/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "ReactRdnaModule.h"
#import "RCTPushNotificationManager.h"

@implementation AppDelegate
@synthesize apnsDeviceToken;
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ReactRefApp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  [self.window setRootViewController:rootViewController];
  [self.window makeKeyAndVisible];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  //  return YES;
  //  NSURL *jsCodeLocation;
  //    #ifdef React_Dev
  //    jsCodeLocation = [NSURL URLWithString:@"http://10.0.1.86:8081/index.ios.bundle?platform=ios&dev=true"];
  //    #endif
  //    #ifdef React_Dist
  //       jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  //    #endif
  //  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
  //                                                      moduleName:@"ReactRefApp"
  //                                               initialProperties:nil
  //                                                   launchOptions:launchOptions];
  //
  //  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //  UIViewController *rootViewController = [UIViewController new];
  //  rootViewController.view = rootView;
  //  self.window.rootViewController = rootViewController;
  //  [self.window makeKeyAndVisible];
  //
  //
  //  /*
  //   ADDED TO REMOVE LAUNCH WHITE SCREEN FLASH
  //   */
  UIView* launchScreenView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] objectAtIndex:0];
  launchScreenView.frame = self.window.bounds;
  rootView.loadingView = launchScreenView;
  
  
  return YES;
  
  
}


// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  apnsDeviceToken = deviceToken;
  NSLog(@"\n\n%@\n\n",deviceToken);
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  NSLog(@"%@", error);
}

- (void)applicationDidEnterBackground:(UIApplication *)application{
  //self.window.hidden = true;
}
- (void)applicationWillEnterForeground:(UIApplication *)application{
  //self.window.hidden = false;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

//- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
//  [[FBSDKApplicationDelegate sharedInstance] application:application
//                           didFinishLaunchingWithOptions:launchOptions];
//  return YES;
//}

- (void)applicationWillTerminate:(UIApplication *)application{
  [ReactRdnaModule terminateRDNA];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
}

-(void)onDeviceThreat:(NSString*)status{
  UIAlertView *threatAlert = [[UIAlertView alloc]initWithTitle:@"Device is not safe." message:status delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
  [threatAlert show];
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
  exit(0);
}

- (void)alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex {
  exit(0);
}

@end
