//
//  ActiveShieldSDKLib.h
//  ActiveShieldSDKLib
//
//  Created by Beruh Yayehyirad on 6/5/17.
//
//

#import <UIKit/UIKit.h>

#import <Foundation/Foundation.h>
#import <NetworkExtension/NetworkExtension.h>

NS_ASSUME_NONNULL_BEGIN

//! Project version number for ActiveShieldSDK.
FOUNDATION_EXPORT double ActiveShieldSDKVersionNumber;

//! Project version string for ActiveShieldSDK.
FOUNDATION_EXPORT const unsigned char ActiveShieldSDKVersionString[];


//----------------------------------------------------------------------------------------//
// BMNetworkID
//----------------------------------------------------------------------------------------//

#pragma mark - BMNetworkId

typedef enum : NSUInteger
{
    BMNetworkTypeNone = 0,
    BMNetworkTypeWiFi,
    BMNetworkTypeCellular,  // WWAN
} BMNetworkType;



// immutable
@interface BMNetworkId : NSObject <NSCopying, NSCoding>

@property (nonatomic, readonly) BMNetworkType networkType;
@property (nonatomic, copy, nullable, readonly) NSString *identifier;     // Cellular mobileNetworkCode / WiFi BSSID
@property (nonatomic, copy, nullable, readonly) NSString *friendlyId;     // Cellular carrierName / WiFi SSID
@property (nonatomic, readonly) BOOL secure;
@property (nonatomic, readonly) double signalStrength;

+ (instancetype __nonnull) currentNetworkId;
+ (instancetype __nonnull) networkIdFromHotspot:(NEHotspotNetwork  * __nonnull )hotspot;

- (BOOL) isEqualToNetworkId:(BMNetworkId *__nullable)otherNetId;

#define BMNetIdEqual(l, r)  __BMObjEqualTemplate(l, r, BMNetworkId, isEqualToNetworkId)

@end

//----------------------------------------------------------------------------------------//
// Primitives
//----------------------------------------------------------------------------------------//

#pragma mark - Primitives

typedef enum : NSUInteger
{
    ASWorkspacePolicyEnforcerActionNone = 0,        // do nothing
    ASWorkspacePolicyEnforcerActionWarn,            // warn user
    ASWorkspacePolicyEnforcerActionPrevent,         // prevent user from using the device until the threat is gone
    ASWorkspacePolicyEnforcerActionDisconnect       // disconnect from wifi when possible
    
} ASWorkspacePolicyEnforcerAction;

typedef enum : NSUInteger {
    ASWorkspacePolicyThreatSeverityLow = 0,
    ASWorkspacePolicyThreatSeverityMedium,
    ASWorkspacePolicyThreatSeverityHigh,
} ASWorkspacePolicyThreatSeverity;


//----------------------------------------------------------------------------------------//
// ASSecurityThreat
//----------------------------------------------------------------------------------------//

#pragma mark - ASSecurityThreat

__BEGIN_DECLS

@class CLLocation;
@class BMNetworkEndpoint;

typedef enum : NSUInteger
{
    ASSecurityThreatCategoryNone = 0,
    ASSecurityThreatCategoryApp,        // malicious, trojanized, vulnerable ... apps
    ASSecurityThreatCategoryNetwork,    // MitM ...
    ASSecurityThreatCategorySystem,     // device integrity compromised, vulnerable OS version ...
    
} ASSecurityThreatCategory;

typedef ASSecurityThreatCategory ASSecurityThreatGenus;
typedef NSUInteger ASSecurityThreatSpecies;
typedef NSUInteger ASSecurityThreatCode;        // genus + (species << 8). unique for a genus, species pair (flat threat type identifier)


static inline ASSecurityThreatCode ASSecurityFlatThreatCode(ASSecurityThreatGenus g, ASSecurityThreatSpecies s) { return g + (s << 8); }


// immutable
@interface ASSecurityThreat : NSObject <NSCopying, NSMutableCopying>

@property (nonatomic, readonly) ASSecurityThreatGenus genus;
@property (nonatomic, readonly) ASSecurityThreatSpecies species;
@property (nonatomic, readonly) ASSecurityThreatCode threatCode;
@property (nonatomic, readonly) NSString *threatId;

@property (nonatomic, readonly) double severity;    // 0.0 - 1.0 (1.0 meaning the worst)

@property (nonatomic, copy, readonly) NSArray <NSString *> *implicatedApps;
@property (nonatomic, copy, readonly) NSArray <BMNetworkId *> *implicatedNetworks;
@property (nonatomic, copy, readonly) NSArray <BMNetworkEndpoint *> *implicatedHosts;
@property (nonatomic, copy, readonly) NSArray <NSString *> *implicatedSigners;

// should always be non-nil. used for calculating hash and a nil value may degrade performance of hash based
// collection objects.
@property (nonatomic, copy, readonly) NSDate* detectionTimestamp;
@property (nonatomic, copy, readonly) CLLocation* detectionGeoLocation;

- (BOOL) isEqualToSecurityThreatIgnoringTimestamp:(ASSecurityThreat *)otherThreat;  // WARNING: Also ignores geo-location
- (BOOL) isEqualToSecurityThreat:(ASSecurityThreat *)otherThreat;

@property (nonatomic, readonly) NSString * longDescription;
@property (nonatomic, readonly) NSString * defaultLongDescription;

@property (nonatomic, readonly) NSString * shortDescription;
@property (nonatomic, readonly) NSString * defaultShortDescription;

@property (nonatomic, readonly) NSString * defaultTinyDescription;
@property (nonatomic, readonly) NSString * tinyDescription;
@property (nonatomic, readonly) NSString * localizedTinyDescription;

@property (nonatomic, readonly) NSString * detailedDescription;
@property (nonatomic, readonly) NSString * defaultDetailedDescription;

@property (nonatomic, readonly) NSString * title;

@property (nonatomic, readonly) NSString * eventType;
@property (nonatomic, readonly) NSString * defaultEventType;

@property (nonatomic, readonly) ASWorkspacePolicyEnforcerAction action;
@property (nonatomic, readonly) ASWorkspacePolicyEnforcerAction defaultAction;

@property (nonatomic, readonly) NSMutableDictionary *forensicsInfo;

@property (nonatomic, readonly) NSTimeInterval enforcementInterval;

@property (nonatomic, readonly) BOOL isUserSuppressible;
@property (nonatomic, readonly) NSTimeInterval suppressionInterval;     // negative values

@property (nonatomic, readonly) double defaultSeverity;

@property (nonatomic, readonly) NSString *severityString;

@property (nonatomic, readonly) NSString *extraAction;

@property (nonatomic, readonly) BOOL sim;

@property (nonatomic, readonly) BOOL visible;

- (NSString *) prepareForDisplay:(NSString *) str;

@end


@interface ASMutableSecurityThreat : ASSecurityThreat

@property (nonatomic, readwrite) ASSecurityThreatGenus genus;
@property (nonatomic, readwrite) ASSecurityThreatSpecies species;

@property (nonatomic, readwrite) double severity;

@property (nonatomic, copy, readwrite) NSArray <NSString *> *implicatedApps;
@property (nonatomic, copy, readwrite) NSArray <BMNetworkId *> *implicatedNetworks;
@property (nonatomic, copy, readwrite) NSArray <BMNetworkEndpoint *> *implicatedHosts;
@property (nonatomic, copy, readwrite) NSArray <NSString *> *implicatedSigners;

@property (nonatomic, readwrite) NSMutableDictionary *forensicsInfo;

@property (nonatomic, copy, readwrite) NSDate *detectionTimestamp;
@property (nonatomic, copy, readwrite) CLLocation* detectionGeoLocation;

@end


//----------------------------------------------------------------------------------------//
// Threat Species
//----------------------------------------------------------------------------------------//

#pragma mark Threat Species

static NSUInteger const ASSecurityThreatNone = 0;

// App Security
enum : ASSecurityThreatSpecies
{
    ASAppSecurityThreatRepackagedApp = ASSecurityThreatNone + 1,
    ASAppSecurityThreatMaliciousApp,                      // built using a malicious (repackaged) version of Xcode
    ASAppSecurityThreatUnknownSourceApp,
    ASAppSecurityThreatEnterpriseBlacklistedApp = 100
};


// Network Security
enum : ASSecurityThreatSpecies
{
    ASNetSecurityThreatMitM = ASSecurityThreatNone + 1,     // Man-in-the-Middle present
    ASNetSecurityThreatRogueNetwork,            // connected to a rogue network (that pretends to be a trusted network)
    ASNetSecurityThreatRogueAccessPoint,        // connected to a hotspot with hardware generally used for hacking (eg. Pineapple)
    ASNetSecurityThreatMaliciousHost,           // remote host is known / suspected to be malicious
    ASNetSecurityThreatCaptivePortal,
    ASNetSecurityThreatPortScan,
    ASNetSecurityThreatSSLStrip,
    ASNetSecurityThreatContentManipulation,
    
    ASNetSecurityThreatEnterpriseBlacklistedNetwork = 100,        // cellular network / WiFi SSID is blacklisted
    ASNetSecurityThreatEnterpriseBlacklistedAccessPoint,          // WiFi BSSID is blacklisted
    ASNetSecurityThreatEnterpriseBlacklistedHost                  // remote host is blocked
};


// System Security
enum : ASSecurityThreatSpecies
{
    ASSysSecurityThreatIntegrityCompromised = ASSecurityThreatNone + 1,     // Jailbroken, OS Modified
    ASSysSecurityThreatOSOutdated,
    ASSysSecurityThreatPasscodeMissing,
    ASSysEventAgentCrashed,
    ASSysEventAgentClosed,
};

//----------------------------------------------------------------------------------------//
// Security check options
//----------------------------------------------------------------------------------------//

#pragma mark - Security check options

typedef struct
{
    BOOL networkThreats;
    BOOL appThreats;
    BOOL systemThreats;
}
ASSecurityCheckOptions;

ASSecurityCheckOptions ASSecurityCheckOptionsMake(BOOL includeNetworkThreats, BOOL includeAppThreats, BOOL includeSystemThreats);



//----------------------------------------------------------------------------------------//
// ActiveShield
//----------------------------------------------------------------------------------------//

#pragma mark - ActiveShield

@interface ActiveShield : NSObject

+ (instancetype) sharedInstance;

typedef void (^ASSecurityCheckCallback_t)(NSArray<ASSecurityThreat *> * discoveredThreats, NSArray<NSError*>* errors);

- (void) performSecurityCheckWithOptions: (ASSecurityCheckOptions)options andCompletion:(ASSecurityCheckCallback_t)callback;

- (void) startMonitoringWithOptions:(ASSecurityCheckOptions)options;

- (void) stopMonitoring;

typedef void (^ASMonitorObserverCallback_t)(NSArray<ASSecurityThreat *> * discoveredThreats, NSArray<NSError*>* errors);

- (void) addObserverWithCallback:(ASMonitorObserverCallback_t)callback;


@end

NS_ASSUME_NONNULL_END
