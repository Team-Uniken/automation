#ifndef __RDNA_API_H__
#define __RDNA_API_H__

#import <Foundation/Foundation.h>
#import <sys/types.h>
#import <CoreLocation/CoreLocation.h>

/*
 @brief Enum RDNAMethodID - These identifiers are used to identify the routine when the StatusUpdate callback routine is invoked.
 */
typedef NS_ENUM(NSInteger, RDNAMethodID) {
  RDNA_METH_NONE = 0,                /* Not a specific method ID */
  RDNA_METH_INITIALIZE,              /* Initialize runtime */
  RDNA_METH_TERMINATE,               /* Terminate runtime */
  RDNA_METH_RESUME,                  /* Resume runtime */
  RDNA_METH_PAUSE,                   /* Pause runtime */
  RDNA_METH_GET_CONFIG,              /* Get config call back method */
  RDNA_METH_CHECK_CHALLENGE,         /* Check challenge call back method */
  RDNA_METH_UPDATE_CHALLENGE,        /* Update user Challenge call back method*/
  RDNA_METH_GET_ALL_CHALLENGES,      /* Get All challenges of user call back method*/
  RDNA_METH_LOGOFF,                  /* Log Off user call back method*/
  RDNA_METH_FORGOT_PASSWORD,         /* Forgot password call back method*/
  RDNA_METH_GET_POST_LOGIN_CHALLENGES,         /* Get Post login challenge callback method*/
  RDNA_METH_GET_DEVICE_DETAILS,                /* Get all registred devices for the user*/
  RDNA_METH_UPDATE_DEVICE_DETAILS,             /* Update device details of the user*/
  RDNA_METH_GET_NOTIFICATIONS,                 /* Get pending notifications from server */
  RDNA_METH_UPDATE_NOTIFICATION,               /* Update notification status to server */
  RDNA_METH_OPEN_HTTP_CONNECTION,              /* Create http rest api tunnel request  */
  
};

typedef NS_ENUM(NSInteger, RDNALoggingLevel) {
  RDNA_NO_LOGS = 0,
  RDNA_LOG_WARN,
  RDNA_LOG_NOTIFY,
  RDNA_LOG_NETWORK,
  RDNA_LOG_DNA,
  RDNA_LOG_DEBUG,
  RDNA_LOG_VERBOSE
};

/*
 @brief Enum RDNAErrorID - This enum specifies all the error codes which RDNA returns back to the client.
 */
typedef NS_ENUM(NSInteger, RDNAErrorID) {
  RDNA_ERR_NONE = 0,                              /* No Error                                             */
  RDNA_ERR_NOT_INITIALIZED,                       /* If core not initialized                              */
  RDNA_ERR_GENERIC_ERROR,                         /* If generic error occured                             */
  RDNA_ERR_INVALID_VERSION,                       /* If invalid SDK Version                               */
  RDNA_ERR_INVALID_ARGS,                          /* If invalid args are passed                           */
  RDNA_ERR_SESSION_EXPIRED,                       /* If session has expired                               */
  RDNA_ERR_PARENT_PROXY_CONNECT_FAILED,           /* If failed to connect to proxy server                 */
  RDNA_ERR_NULL_CALLBACKS,                        /* If Null callback/ptr passed in                       */
  RDNA_ERR_INVALID_HOST,                          /* If Null or empty hostname/IP                         */
  RDNA_ERR_INVALID_PORTNUM,                       /* If Invalid port number                               */
  RDNA_ERR_INVALID_AGENT_INFO,                    /* If agent info is invalid                             */
  RDNA_ERR_FAILED_TO_CONNECT_TO_SERVER,           /* If failed to connect to server                       */
  RDNA_ERR_INVALID_SAVED_CONTEXT,                 /* If Invalid saved context                             */
  RDNA_ERR_INVALID_HTTP_REQUEST,                  /* If Invalid HTTP request                              */
  RDNA_ERR_INVALID_HTTP_RESPONSE,                 /* If Invalid HTTP response                             */
  RDNA_ERR_INVALID_CIPHERSPECS,                   /* If cipherspecs is invalid                            */
  RDNA_ERR_SERVICE_NOT_SUPPORTED,                 /* If service not supported                             */
  RDNA_ERR_FAILED_TO_GET_STREAM_PRIVACYSCOPE,     /* If failed to get stream privacy scope                */
  RDNA_ERR_FAILED_TO_GET_STREAM_TYPE,             /* If failed to get stream type                         */
  RDNA_ERR_FAILED_TO_WRITE_INTO_STREAM,           /* If failed to write into data stream                  */
  RDNA_ERR_FAILED_TO_END_STREAM,                  /* If failed to end stream                              */
  RDNA_ERR_FAILED_TO_DESTROY_STREAM,              /* If failed to destroy stream                          */
  RDNA_ERR_FAILED_TO_INITIALIZE,                  /* If failed to initialize                              */
  RDNA_ERR_FAILED_TO_PAUSERUNTIME,                /* If failed to pause runtime                           */
  RDNA_ERR_FAILED_TO_RESUMERUNTIME,               /* If failed to resume runtime                          */
  RDNA_ERR_FAILED_TO_TERMINATE,                   /* If failed to terminate                               */
  RDNA_ERR_FAILED_TO_GET_CIPHERSALT,              /* If failed to get ciphersalt                          */
  RDNA_ERR_FAILED_TO_GET_CIPHERSPECS,             /* If failed to get cipherspecs                         */
  RDNA_ERR_FAILED_TO_GET_AGENT_ID,                /* If failed to get agent id                            */
  RDNA_ERR_FAILED_TO_GET_SESSION_ID,              /* If failed to get session id                          */
  RDNA_ERR_FAILED_TO_GET_DEVICE_ID,               /* If failed to get device id                           */
  RDNA_ERR_FAILED_TO_GET_SERVICE,                 /* If failed to get service                             */
  RDNA_ERR_FAILED_TO_START_SERVICE,               /* If failed to start service                           */
  RDNA_ERR_FAILED_TO_STOP_SERVICE,                /* If failed to stop service                            */
  RDNA_ERR_FAILED_TO_ENCRYPT_DATA_PACKET,         /* If failed to encrypt data packet                     */
  RDNA_ERR_FAILED_TO_DECRYPT_DATA_PACKET,         /* If failed to decrypt data packet                     */
  RDNA_ERR_FAILED_TO_ENCRYPT_HTTP_REQUEST,        /* If failed to encrypt HTTP request                    */
  RDNA_ERR_FAILED_TO_DECRYPT_HTTP_RESPONSE,       /* If failed to decrypt HTTP response                   */
  RDNA_ERR_FAILED_TO_CREATE_PRIVACY_STREAM,       /* If failed to create privacy stream                   */
  RDNA_ERR_FAILED_TO_CHECK_CHALLENGE,             /* If failed to check challenges                        */
  RDNA_ERR_FAILED_TO_UPDATE_CHALLENGE,            /* If failed to update challenges                       */
  RDNA_ERR_FAILED_TO_GET_CONFIG,                  /* If failed to get config                              */
  RDNA_ERR_FAILED_TO_GET_ALL_CHALLENGES,          /* If failed to get all challenges                      */
  RDNA_ERR_FAILED_TO_LOGOFF,                      /* If failed to log off                                 */
  RDNA_ERR_FAILED_TO_RESET_CHALLENGE,             /* If failed to reset challenge                         */
  RDNA_ERR_FAILED_TO_DO_FORGOT_PASSWORD,          /* If failed to update forgot pass operation            */
  RDNA_ERR_FAILED_TO_GET_POST_LOGIN_CHALLENGES,   /* If failed to get post login challenges               */
  RDNA_ERR_FAILED_TO_GET_REGISTERD_DEVICE_DETAILS,/* If failed to get registered device details           */
  RDNA_ERR_FAILED_TO_UPDATE_DEVICE_DETAILS,       /* If failed to update registered device details        */
  RDNA_ERR_FAILED_TO_GET_NOTIFICATIONS,           /* If failed to get notification from server            */
  RDNA_ERR_FAILED_TO_UPDATE_NOTIFICATION,         /* If failed to update notification to server           */
  RDNA_ERR_FAILED_TO_OPEN_HTTP_CONNECTION,        /* If any failure occurs while openeing http tunnel(api)*/
  RDNA_ERR_SSL_INIT_FAILED,                       /* If SSL init fails*/
  RDNA_ERR_SSL_ACTIVITY_FAILED,                   /* If any error occured during ssl in action*/
  RDNA_ERR_DNS_FAILED,                            /* If domain name resolution failed*/
  RDNA_ERR_NET_DOWN,                              /* If network is down*/
  RDNA_ERR_SOCK_TIMEDOUT,                         /* If connect timeout occured*/
  RDNA_ERR_DNA_INTERNAL,
  //All errors above this are mapped with the internal errors
  
  //Following error codes are local error codes
  RDNA_ERR_INVALID_USER_MR_STATE,                  /* Invalid user state in secure storage */
  RDNA_ERR_NOTF_SIGN_INTERNAL_FAILURE,             /* Failure occurred when signing notification           */
  RDNA_ERR_INVALID_PROXY_CREDS,                    /* System Proxy credentials are invalid                 */
  RDNA_ERR_CONNECTION_TIMEDOUT,                    /* Timeout when connecting to server                    */
  RDNA_ERR_DNS_TIMEDOUT,                           /* Hostname resolution timedout                         */
  RDNA_ERR_RESPONSE_TIMEDOUT,                      /* Timedout when waiting for response from other end    */
  RDNA_ERR_FAILED_TO_PARSE_DEVICES,                /* If parsing the device details failed                 */
  RDNA_ERR_INVALID_CHALLENGE_CONFIG,               /* If there is any mistake in challenge configuration   */
  RDNA_ERR_INVALID_HTTP_API_REQ_URL,               /* If URL in HTTP req is invalid                        */
  RDNA_ERR_NO_MEMORY,
  RDNA_ERR_INVALID_CONTEXT,
  RDNA_ERR_CIPHERTEXT_LENGTH_INVALID,
  RDNA_ERR_CIPHERTEXT_EMPTY,
  RDNA_ERR_PLAINTEXT_EMPTY,
  RDNA_ERR_PLAINTEXT_LENGTH_INVALID,
  RDNA_ERR_USERID_EMPTY,
  RDNA_ERR_CHALLENGE_EMPTY,
  RDNA_ERR_FAILED_TO_SERIALIZE_JSON,
  RDNA_ERR_USECASE_EMPTY,
  RDNA_ERR_INVALID_SERVICE_NAME,
};

/*
 @brief Enum RDNAStreamType - These identifiers are used to identify the privecy stream type
 */
typedef NS_ENUM(NSInteger, RDNAStreamType) {
  RDNA_STREAM_TYPE_ENCRYPT = 0x00, /* a stream for encrypting */
  RDNA_STREAM_TYPE_DECRYPT = 0x01, /* a stream for decrypting */
};

/*
 @brief enum RDNAPortType - These flags specify attributes of the returned access port for the backend service.
 */
typedef NS_ENUM(NSInteger, RDNAPortType) {
  RDNA_PORT_TYPE_PROXY = 0x00,    /* port type is proxy           */
  RDNA_PORT_TYPE_PORTF,           /* port type is port forwarding */
};

/*
 @brief enum RDNAPrivacyScope - These flags specifies which level of key to be used for encryption in data encryption API's.
 */
typedef NS_ENUM(NSInteger, RDNAPrivacyScope) {
  RDNA_PRIVACY_SCOPE_SESSION = 0x01,  /* use session-specific keys */
  RDNA_PRIVACY_SCOPE_DEVICE = 0x02,   /* use device-specific keys  */
  RDNA_PRIVACY_SCOPE_USER = 0x04,     /* use user-specific keys    */
  RDNA_PRIVACY_SCOPE_AGENT = 0x08,    /* use agent-specific keys   */
};

/*
 @brief enum RDNAChallengePromptType - These flags specifies the prompted challenge type, whether the challenge is read only or read-write
 or one way prompt (like password)
 */
typedef NS_ENUM(NSInteger, RDNAChallengePromptType) {
  RDNA_PROMPT_BOOLEAN = 0,                /* Boolean prompt */
  RDNA_PROMPT_ONE_WAY,                    /* One way prompt */
  RDNA_PROMPT_TWO_WAY_READONLY,           /* Two way prompt read-only */
  RDNA_PROMPT_TWO_WAY_READWRITE,          /* Two way prompt read-write */
};


/*
 @brief enum RDNAChallengeStatusCode - These flags error codes occured in MFA flow of advance API-SDK
 */
typedef NS_ENUM(NSInteger, RDNAResponseStatusCode) {
  RDNA_RESP_STATUS_SUCCESS = 0,                                /* Success                                                    */
  RDNA_RESP_STATUS_NO_USER_ID,                                 /* No user Id.                                              */
  RDNA_RESP_STATUS_AUTH_FAILED,                                /* Authentication failed                                     */
  RDNA_RESP_STATUS_SEC_QA_MATCH_FAILED,                        /* Sec QA match failed                                   */
  RDNA_RESP_STATUS_NO_SEC_QA_PRESENT,                          /* No Sec QA present                                  */
  RDNA_RESP_STATUS_PWD_UPDATE_FAILED,                          /* Password update failed                                     */
  RDNA_RESP_STATUS_OTP_MATCH_FAILED,                           /* OTP matching failed                                     */
  RDNA_RESP_STATUS_SECONDARY_SEC_QA_MATCH_FAILED,              /* Secondary Sec QA match failed                            */
  RDNA_RESP_STATUS_ACT_CODE_MATCH_FAILED,                      /* Activation code match failed                               */
  RDNA_RESP_STATUS_ACT_CODE_EXPIRED,                           /* Activation code expired                                   */
  RDNA_RESP_STATUS_PASSWORD_EXPIRED,                           /* Password expired                                        */
  RDNA_RESP_STATUS_OTP_EXPIRED,                                /* OTP expired                                           */
  RDNA_RESP_STATUS_OTP_ALREADY_USED,                           /* OTP already exists                                        */
  RDNA_RESP_STATUS_AUTO_RESET_USER,                            /* Auto reset user                                      */
  RDNA_RESP_STATUS_INTERNAL_SERVER_ERROR,                      /* Internal server error                             */
  RDNA_RESP_STATUS_POST_LOGIN_VERIFY_CREDS_FAILURE,            /* Post login verify credentials failure                 */
  RDNA_RESP_STATUS_DEVICE_UPDATE_FAILED,                       /* Failed to update device                            */
  RDNA_RESP_STATUS_USER_UNENROLLED,                            /* User removed                                    */
  RDNA_RESP_STATUS_INVALID_USE_CASE,                           /* Invalid use case                                 */
  RDNA_RESP_STATUS_USER_LOCKED,                                /* User locked                                        */
  RDNA_RESP_STATUS_PERMANENT_DEVICE_LIMIT_EXCEEDED,            /* Permanent device limit exceeded                      */
  RDNA_RESP_STATUS_CHALLENGE_NOT_FOUND,                        /* Challenge not found                                  */
  RDNA_RESP_STATUS_TOKEN_BASED_AUTH_FAILED,                    /* Token authentication failed                            */
  RDNA_RESP_STATUS_TOKEN_BASED_AUTH_UPDATED,                   /* Token authentication updated                        */
  RDNA_RESP_STATUS_AD_USER_DISABLE,                            /* AD User disabled                                 */
  RDNA_RESP_STATUS_AD_USER_DELETED,                            /* AD User deleted                                     */
  RDNA_RESP_STATUS_USER_DEVICE_NOT_REGISTERED,                 /* User device not register                           */
  RDNA_RESP_STATUS_USER_BLOCKED,                               /* User blocked                                    */
  RDNA_RESP_STATUS_USER_SUSPENDED,                             /* User suspended                                  */
  RDNA_RESP_STATUS_INVALID_CHALLENGE_JSON,                     /* Challenge JSON is invalid                           */
  RDNA_RESP_STATUS_AD_PASSWORD_MISMATCH,                       /* AD password mismatch                              */
  RDNA_RESP_STATUS_DEVICE_VALIDATION_FAILED,                   /* Device validation failed                           */
  RDNA_RESP_STATUS_USER_ALREADY_ACTIVE,                        /* User already active                                  */
  
  RDNA_RESP_STATUS_UNKNOWN_ERROR                              /* Unknown error occured while updating/validating challenges */
};


/*
 @brief enum RDNAIWAAuthStatus - These flags specifies the Integrated windows authentication credential status which will be set by the
 API-Client in getCredentials call back
 */
typedef NS_ENUM(NSInteger, RDNAIWAAuthStatus) {
  RDNA_IWA_AUTH_SUCCESS = 0,
  RDNA_IWA_AUTH_CANCELLED = 1,
  RDNA_IWA_AUTH_DEFERRED = 2
};

/*
 @brief enum RDNAChallengeOpMode - These flags specifies the operation on the challenges whether the challenges received are to set new challenge
 or the received challenges are to be verified by the user.
 */
typedef NS_ENUM(NSInteger, RDNAChallengeOpMode) {
  RDNA_CHALLENGE_OP_VERIFY = 0,
  RDNA_CHALLENGE_OP_SET
};

typedef NS_ENUM(NSInteger, RDNADeviceStatus) {
  RDNA_DEVSTATUS_ACTIVE = 0,
  RDNA_DEVSTATUS_UPDATE,
  RDNA_DEVSTATUS_DELETE,
  RDNA_DEVSTATUS_BLOCKED,     // - For Future use
  RDNA_DEVSTATUS_SUSPEND,     // - For Future use
};

typedef NS_ENUM(NSInteger, RDNADeviceBinding) {
  RDNA_PERMENANT = 0,
  RDNA_TEMPORARY,
};

typedef NS_ENUM(NSInteger,RDNAHttpMethods) {
  RDNA_HTTP_POST = 0,
  RDNA_HTTP_GET,
};



@interface RDNAIWACreds : NSObject
@property (nonatomic, strong) NSString *userName;      /* username for particular domain url */
@property (nonatomic, strong) NSString *password;      /* password for particular domain url */
@property (assign) RDNAIWAAuthStatus authStatus;
@end


//@class RDNAHTTPRequest;
@interface RDNAHTTPRequest : NSObject
@property (nonatomic,assign) RDNAHttpMethods method;
@property (nonatomic,strong) NSString* url;
@property (nonatomic,strong) NSDictionary* headers;
@property (nonatomic,strong) NSData* body;
@end

//@class RDNAHTTPResponse;
@interface RDNAHTTPResponse : NSObject
@property (nonatomic,readonly) NSString* version;
@property (nonatomic,assign) int statusCode;
@property (nonatomic,strong) NSString* statusMessage;
@property (nonatomic,strong) NSDictionary* headers;
@property (nonatomic,strong) NSData* body;
@end

//@class RDNAHTTPStatus;
@interface RDNAHTTPStatus : NSObject
@property (nonatomic,assign) int errorCode;
@property (nonatomic,assign) int requestID;
@property (nonatomic,strong) RDNAHTTPRequest* request;
@property (nonatomic,strong) RDNAHTTPResponse* response;
@end

//@class RDNASSLCertificate;
@interface RDNASSLCertificate : NSObject
@property (nonatomic,strong) NSString* p12Certificate;
@property (nonatomic,strong) NSString* password;
@end



@class RDNAPrivacyStream;
//@class RDNAStatusCheckChallenge;

/**
 * RDNAPrivacyStreamCallBacks - This is a callback routine supplied by the API-client.
 */
@protocol RDNAPrivacyStreamCallBacks

@required

/**
 * @brief This routine is invoked from within the WriteDataIntoStream routine,
 * when the requisite number of blocks are ready for consumption by the API-client
 * (i.e. when that many blocks have been encrypted/decrypted)
 * @param rdnaPrivacyStream    - RDNA Privacy stream reference.
 * @param pvBlockReadyCtx   - Opaque block ready context passed by API-Client
 * @param pvBlockBuf        - Encrypted/Decrypted data block which is ready
 * @param nBlockSize        - Data block size.
 * @return                  - If success return 0 else appropriate error code.
 */
- (int)onBlockReadyFor:(RDNAPrivacyStream*)rdnaPrivacyStream
     BlockReadyContext:(id)pvBlockReadyCtx
    PrivacyBlockBuffer:(NSData *)pvBlockBuf
          andBlockSize:(int)nBlockSize;
@end

/**
 * class RDNAPrivacyStream - Interface class to be implemented by API-Client
 */
@interface RDNAPrivacyStream : NSObject {
@public
  id <RDNAPrivacyStreamCallBacks> callBack;
  void *corePrivyStream;
}

/**
 * @brief getPrivacyScope -
 * @return                -
 */
- (int)getPrivacyScope:(RDNAPrivacyScope *)privacyScope;

/**
 * @brief getStreamType -
 * @return              -
 */
- (int)getStreamType:(RDNAStreamType *)streamType;

/**
 * @brief writeDataIntoStream -
 * @param data          -
 */
- (int)writeDataIntoStream:(NSData *)data;

/**
 * @brief endStream -
 */
- (int)endStream;

/**
 * @brief cleanup - Method called to do the cleanup activity on the stream.
 */
- (int)destroy;

@end

/**
 * protocol RDNACallbacks - Interface class to be implemented by end consumer.
 */
@protocol RDNACallbacks

@required

/**
 * @brief onInitializeCompleted   - This is a asynchronous callback method that needs to be implemented by the end consumer, to get the initialization details after having invoked initialize to start API runtime.
 * @param status                  - This parameter contains the RDNAStatusInit class object.
 * @return                        - appropriate error code or success.
 */
- (int)onInitializeCompleted:(NSString *)status;

/**
 * @brief getLocationManager   - This is a synchronous callback method that needs to be implemented by the end consumer, to send the LocationManager to fetch location(i.e latitude, longitude and altitude).
 * @return                        - locationManager instance.
 */
- (CLLocationManager *)getLocationManager;

/**
 * @brief This method is invoked by the API runtime during initialization(session creation) and during Device FingerPrinting
 * in order to retrieve the application Version, supplied by the API-client application to include in the device details.
 * The intent of this routine is to provide the application with an opportunity
 * to identify itself so that the backend can check integrity of the application.
 * To this end, it is recommended that the application provide strong checksums which can be matched/recorded at the backend.
 * @return - App's version data to be set into the device details.
 */
- (NSString *)getApplicationVersion;

/**
 * @brief This method is invoked by the API runtime during initialization(session creation) and during Device FingerPrinting
 * in order to retrieve the application name, supplied by the API-client application to include in the device details.
 * The intent of this routine is to provide the application with an opportunity
 * to identify itself so that the backend can check integrity of the application.
 * To this end, it is recommended that the application provide strong checksums which can be matched/recorded at the backend.
 * @return - App's name data to be set into the device details.
 */
- (NSString *)getApplicationName;

@optional

/**
 * @brief onTerminated  - This is the callback method that needs to be implemented by the end consumer, to get terminate callback of terminate method.
 * @param status        - This is the parameter that contains the RDNAStatusTerminate object.
 * @return              - appropriate error code or success.
 */
- (int)onTerminate:(NSString *)status;

/**
 * @brief onPauseRuntime  - This is the callback method that needs to be implemented by the end consumer,  after having called pause the API runtime, after initialization is completed. The API runtime context if saved, to be able to call at resume.
 * @param status          - This is the parameter that contains the RDNAStatusPauseRuntime object.
 * @return                - Appropriate error code or success.
 */
- (int)onPauseRuntime:(NSString *)status;

/**
 * @brief onResumeRuntime - This is the callback method that needs to implemented by the end consumer, after having callled resumeRuntime, which provides the status of resume.
 * @param                 - This is the parameter that contains the RDNAStatusResumeRuntime object.
 * @return                - Appropriate error code or success.
 */
- (int)onResumeRuntime:(NSString *)status;


/**
 * @brief onConfigRecieved  - This is the callback method that needs to be implemented by the end consumer, after having called getConfig the API runtime.
 * @param status            - This is the parameter that contains the RDNAStatusGetConfig object.
 * @return                  - Appropriate error code or success.
 */
- (int)onConfigRecieved:(NSString *)status;


/**
 * @brief onCheckChallengeResponseStatus  - Method is called by the API runtime to notify the
 *                                          challenge is recieved.
 * @param status               - status of check challenge response status, app context,
 *                               error code returned if any, method id, response data.
 */
- (int)onCheckChallengeResponseStatus:(NSString *) status;

/**
 * @brief onGetAllChallengeStatus - Method is called by the API runtime to notify the
 *                                  challenge is recieved.
 * @param status                  - status of get all challenges, app context,
 *                                  error code returned returned if any, method id, response data.
 */
- (int)onGetAllChallengeStatus:(NSString *) status;

/**
 * @brief onUpdateChallengeStatus - Method is called by the API runtime to notify the
 *                                  challenge is recieved.
 * @param status                  - status of update challenges, app context,
 *                                  error code returned returned if any, method id, response data.
 */
- (int)onUpdateChallengeStatus:(NSString *) status;

/**
 * @brief onLogOff  - This is the callback method that needs to be implemented by the end consumer, after having called logOff of the API runtime.
 * @param status    - This is the parameter that contains the RDNAStatusLogOff object.
 * @return          - Appropriate error code or success.
 */
- (int)onLogOff: (NSString *)status;

/**
 * @brief getCredentials  - This is a synchronous callback API is used to, get the credential information from end consumser for authenticating oneself on web server accessing through REL-ID API-SDK service.
 * @param status          - This is the parameter that contains the domainUrl string.
 * @return                - RDAIWACreds class object, that needs to be filled in by the end consumer to provided the credentials to the web server.
 */
- (RDNAIWACreds *)getCredentials:(NSString *)domainUrl;

/**
 * @brief ShowLocationDailogue  - This is a synchornous callback method, that neeeds to be implemented by the end consumer, to when location service is disabled or off.
 * @return                      - Appropriate error code or success.
 */

- (int)ShowLocationDailogue;


/**
 * @brief onGetPostLoginChallenges  - Method is called by the API runtime to notify the
 *                                          challenges is received for post login authentication challenges as requested.
 * @param status               - status of check challenge response status, app context,
 *                               error code returned if any, method id, response data.
 */
- (int)onGetPostLoginChallenges:(NSString *)status;



/**
 * @brief onGetRegistredDeviceDetails - Method is called by the API runtime to notify that
 *                                      the device details are received.
 * @param status                      - status of get post login challenges, which contains app context,
 *                                      error code returned by core, method id, and all the devices registred by the User
 */
- (int)onGetRegistredDeviceDetails:(NSString *)status;

/**
 * @brief onUpdateDeviceDetails - Method is called by the API runtime to notify that
 *                                the device details are updated
 * @param status                - status of get post login challenges, which contains app context,
 *                                error code returned by core, method id
 */
- (int)onUpdateDeviceDetails:(NSString *)status;

/**
 * @brief onGetNotifications - Method is called by the API runtime to notify that notification status.
 * @param status                -
 */
- (int)onGetNotifications:(NSString *)status;

/**
 * @brief onUpdateNotification - Method is called by the API runtime to notify that updated notification status.
 * @param status                -
 */
- (int)onUpdateNotification:(NSString *)status;

/**
 * @brief onGetNotificationsHistory - Method is called by the API runtime to notify that notification history status.
 * @param status                -
 */
-(int)onGetNotificationsHistory:(NSString*)status;

/**
 * @brief getDeviceToken - Method is called by the API runtime to get notification token.
 */
- (NSString*)getDeviceToken;

/**
 * @brief onSessionTimeout - Method is called by the API runtime to notify that the session has been timed out.
 * @param status                -
 */
-(int)onSessionTimeout:(NSString*)status;

/**
 * @brief onSessionTimeout - Method is called by the API runtime to notify that the session has been timed out.
 * @param status                -
 */
-(int)onSecurityThreat:(NSString*)status;


-(int)onSdkLogPrintRequest:(RDNALoggingLevel)level andlogData:(NSString*)logData;


@end


/**
 * protocol RDNAHTTPCallbacks - Interface class to be implemented by end consumer.
 */
@protocol RDNAHTTPCallbacks
@required
/**
 * @brief onHttpResponse - Method is called by the API runtime to get http request response.
 */
-(int)onHttpResponse:(RDNAHTTPStatus*) status;
@end



@interface RDNA : NSObject

/**
 * @brief This method initializes the sdk by connecting out to given REL-ID server coordinate and creates REL-ID session.
 * @param agentInfo        - Software identity information for the API-runtime to authenticate and establish primary session connectivity with the REL-ID platform backend.
 * @param callbacks        - Pointer to the callback object
 * @param gwHNIP           - Hostname/IP of the gateway server
 * @param gwPort           - Port of the gateway server
 * @param cipherSpec       - Cipher mode to be used
 * @param cipherSalt       - Cipher salt
 * @param proxySettings    - Parent proxy settings of the application
 * @param appCtx           - Application context
 * @param RDNASSLCertificate-RDNASSLCertificate object with its data and password.
 * @return                 - Appropriate error code of the error that occurred.
 */
+ (int)initialize:(RDNA **)ppRuntimeCtx
        AgentInfo:(NSString *)agentInfo
        Callbacks:(id<RDNACallbacks>)callbacks
      GatewayHost:(NSString *)gwHNIP
      GatewayPort:(uint16_t)gwPort
       CipherSpec:(NSString *)cipherSpec  // Array of RDNACipherSpec
       CipherSalt:(NSString *)cipherSalt
    ProxySettings:(NSString *)proxySettings
RDNASSLCertificate:(RDNASSLCertificate*)rdnaSSLCertificate
    DNSServerList:(NSArray<NSString*>*)dnsServerList
RDNALoggingLevel :(RDNALoggingLevel)loggingLevel
       AppContext:(id)appCtx;

/**
 * @brief getSDKVersion - return the current sdk verion.
 */
+ (NSString *)getSDKVersion;

/**
 * @brief This method is called to get enum value from error code.
 * @param errorCode
 * @return appropriate enum.
 */
+ (RDNAErrorID)getErrorInfo:(int)errorCode;

/**
 * @brief This method is used to get the details of the tunnelling service w.r.t. its name.
 * @param serviceName      - Name of the service.
 * @param service          - The actual service object containg the service details will be filled in here.
 * @return                 - Appropriate error code that occurred or success.
 * @Note                   - Its the apps resp. to cleanup the return service obj.
 */
- (int)getServiceByServiceName:(NSString *)serviceName
                   ServiceInfo:(NSMutableString **)service;

/**
 * @brief This method is used to get the details of the tunnelling service/services w.r.t.
 its destination co-ordinates.
 * @param HNIP             - Destination host-name/IP of the service
 * @param port             - Destination port of the service.
 * @param services         - List of objects containing the service details will be filled in here.
 * @return                 - Appropriate error code that occurred or success.
 * @Note                   - Its the apps responsibility to cleanup the return service obj.
 */
- (int)getServiceByTargetCoordinate:(NSString *)targetHNIP
                         TargetPort:(uint16_t)targetPORT
                       ServicesInfo:(NSMutableString **)services;

/**
 * @brief This method is used to get the details of all the services that are running.
 * @param services         - List of objects containing the service details will be filled in here.
 * @return                 - Appropriate error code that occurred or success.
 */
- (int)getAllServices:(NSMutableString **)services;

/**
 * @brief This method is called to start a particular tunnelling service.
 * @param service      - Object containg the service details. Name is mandatory and the only parameter to uniquely identify the service.
 * @return             - Appropriate error code of the error that occurred or success.
 */
- (int)serviceAccessStart:(NSString *)service;

/**
 * @brief This method is called to stop a particular tunnelling service.
 * @param service     - Object containg the service details. Name is mandatory and the only parameter to uniquely identify the service.
 * @return            - Appropriate error code of the error that occurred or success.
 */
- (int)serviceAccessStop:(NSString *)service;

/**
 * @brief serviceAccessStartAll starts all the non-running tunnelling services
 * @return                      - Appropriate error code that occurred or success.
 */
- (int)serviceAccessStartAll;

/**
 * @brief serviceAccessStopAll stops all the running tunnelling services
 * @return                     - Appropriate error code that occurred or success.
 */
- (int)serviceAccessStopAll;

/**
 * @brief pauseRuntime: method signals the RDNA to pause its execution and save the its state and return it to caller.
 * @param state        - Output paramater that
 * @return             - Returns appropriate error code that occurred or success.
 */
- (int)pauseRuntime:(NSString **)state;

/**
 * @brief This method is used to signal the DNA thread to resume execution.
 * @return              - Returns appropriate error code that occurred or success.
 */
+ (int)resumeRuntime:(RDNA **)ppRuntimeCtx
          SavedState:(NSString *)state
           Callbacks:(id<RDNACallbacks>)callbacks
       ProxySettings:(NSString *)proxySettings
   RDNALoggingLevel :(RDNALoggingLevel)loggingLevel
          AppContext:(id)appCtx;

/**
 * @brief This method is used to get the default cipher spec
 * @param cipherSpec [OUT]    - default cipher spec set in the RDNA
 */
- (int)getDefaultCipherSpec:(NSMutableString **)cipherSpec;

/**
 * @brief This method is used to get the default cipher spec salt
 * @param cipherSalt [OUT]    - default cipher salt set in the RDNA
 */
- (int)getDefaultCipherSalt:(NSMutableString **)cipherSalt;

/**
 * @brief This method used to encrypt the data packet.
 * @param privacyScope      - Privacy scope of the stream.
 * @param cipherSpec        - Cipher to be used.
 * @param cipherSalt        - Cipher salt.
 * @param plainText         - Input the plain string data packet.
 * @param cipherText        - Ouput the ecrypted data packet.
 * @return                  - Appropriate error code of the error that occurred.
 */
- (int)encryptDataPacket:(int)privacyScope
              CipherSpec:(NSString *)cipherSpec
              CipherSalt:(NSString *)cipherSalt
                    From:(NSString *)plainText
                    Into:(NSString **)cipherText;

/**
 * @brief This method decrypts the data packet provided and returns the plain
 * string if successfull else the appropriate error code.
 * @param privacyScope        - Privacy scope of the stream.
 * @param cipherSpec          - Cipher to be used.
 * @param cipherSalt          - Cipher salt.
 * @param dataPacketEncrypted - Input encrypted data packet.
 * @param dataPacketDecrypted - Output decrypted data packet in plain string format.
 * @return                    - Appropriate error code of the error that occurred.
 */
- (int)decryptDataPacket:(int)privacyScope
              CipherSpec:(NSString *)cipherSpec
              CipherSalt:(NSString *)cipherSalt
                    From:(NSString *)cipherText
                    Into:(NSString **)plainText;

/**
 * @brief This method encrypts the original HTTP request and encapsulates it into a dummy
 httprequest with same destination as the original request.
 * @param request               - Input plaint text string containing the http request.
 * @param requestLen            - Length of input plaintext HTTP request.
 * @param scope                 - Privacy scope of the stream.
 * @param cipherSpec            - Cipher to be used.
 * @param cipherSalt            - Cipher salt.
 * @param transformedRequest    - Ouput http request containing the original source and destination and conatains
 the payload which consists of the original http request in encrypted form.
 * @param transformedRequestLen - Length of encrypted output HTTP request.
 * @return                      - Appropriate error code of the error that occurred.
 */
- (int)encryptHttpRequest:(int)privacyScope
               CipherSpec:(NSString *)cipherSpec
               CipherSalt:(NSString *)cipherSalt
                     From:(NSString *)request
                     Into:(NSMutableString **)transformedRequest;

/**
 * @brief This method decrypts the HTTP response and returns back the plain string
 * original http response string.
 * @param privacyScope           - Privacy scope of the stream.
 * @param cipherSpec             - Cipher to be used.
 * @param cipherSalt             - Cipher salt.
 * @param transformedResponse    - Input encrypted HTTP response string.
 * @param response               - Output decrypted to plain string HTTP response string.
 * @return                       - Appropriate error code of the error that occurred.
 */
- (int)decryptHttpResponse:(int)privacyScope
                CipherSpec:(NSString *)cipherSpec
                CipherSalt:(NSString *)cipherSalt
                      From:(NSString *)transformedResponse
                      Into:(NSMutableString **)response;

/**
 * @brief This method creates a private stream defined within the scope of privacy.
 * @param streamType             - Type of stream (Encrypt/Decrypt)
 * @param privacyScope           - Privacy scope of the stream.
 * @param cipherSpec             - Cipher to be used.
 * @param cipherSalt             - Cipher salt.
 * @param blockReadyThreshold    - Input block size from application,Min = 1 and Max = 64 (default).
 * If blockReadySize = 0 then it will be use default value. If blockReadySize > MAX, error is returned.
 * @param callbacks              - Object of RDNAPrivacyStreamCallBacks implementation
 * @param pvBlockReadyCtx        -
 * @param privStream             - Output parameter that is a reference to the RDNAPrivacyStream object
 * @return                       - Appropriate error code of the error that occurred.
 */
- (int)createPrivacyStreamFor:(RDNAStreamType)streamType
                 PrivacyScope:(RDNAPrivacyScope)privacyScope
                   CipherSpec:(NSString *)cipherSpec
                   CipherSalt:(NSString *)cipherSalt
          BlockReadyThreshold:(int)blockReadyThreshold
   RDNAPrivacyStreamCallBacks:(id<RDNAPrivacyStreamCallBacks>)callbacks
            BlockReadyContext:(id)pvBlockReadyCtx
            RDNAPrivacyStream:(RDNAPrivacyStream **)privStream;


/**
 * @brief This method terminates the RDNA context
 */
- (int)terminate;

/**
 * @brief This method returns the session ID of the current initialized REL-ID session.
 * @param sessionID    - Output parameter that is populated with session ID.
 * @return             - Returns appropriate error code that occurred or success.
 */
- (int)getSessionID:(NSMutableString **)sessionID;

/**
 * @brief This method returns the Agent ID using which the REL-ID session is initialized.
 * @param agentID    - Output parameter that is populated with agent ID.
 * @return           - Returns appropriate error code that occurred or success.
 */
- (int)getAgentID:(NSMutableString **)agentID;

/**
 * @brief This method returns the device ID of the current device using which the REL-ID session is initialized.
 * @param deviceID  - Output parameter that is populated with device ID.
 * @return          - Returns appropriate error code that occurred or success.
 */
- (int)getDeviceID:(NSMutableString **)deviceID;


// Advanced API SDK methods -

/**
 *@brief getPostLoginChallenges:  - This method is used to get the post login authentication challenges for the user.
 * @param userID                                           - userID for which the post login authentication is required.
 * @param useCaseName                                      - useCaseName needs to be passed in, as expected by server.
 * @return                                                 - appropriate error code or success.
 */
- (int)getPostLoginChallenges:(NSString *)userID withUseCaseName:(NSString *)useCaseName;

/**
 * @brief getConfig - This method can be used for any state primary or secondary of the RDNA context, and this is used to get the configuration setting from the server.
 * @param userID    - Unique user id.
 * @returns         - Returns 0 on success or appropriate error code.
 */
- (int)getConfig:(NSString *)userID;

/**
 * @brief getAllChallenges  - This method is used to get all challenges
 * @param userID                     - UserID for needs to be provided for which user challenges need to be fetched.
 * @return                           - appropriate error code that occurred or success.
 */
- (int)getAllChallenges:(NSString *)userID;

/**
 * @brief getRegisteredDeviceDetails - This Method is used get all the devices registred by the user,
 *                                     API client can use this API only after the user is successfully logged in, and API client wants
 *                                     to give an authority to user manage it's devices to update the name or delete the device from the list
 * @param userID                     - User ID
 * @return                           - If success returns 0 else appropriate error code.
 */
- (int)getRegisteredDeviceDetails:(NSString *)userID;

/**
 * @brief updateDeviceDetails - This Method is used update the devices registred by the user,
 *                                     API client can use this API only after the user is successfully logged in, and user has updated it's
 *                                     device details, may be deletion of the device and updateing the device name.
 * @param userID                     - User id
 * @return                           - If success returns 0 else appropriate error code.
 */
- (int)updateDeviceDetails:(NSString *)userID withDevices:(NSString *)devices;


/**
 * @brief checkChallengeResponse        - This method is used to send the response of challenges to server for         authentication
 * @param challenngeRequestArray - Challenges with response set to it.
 * @param userID                 - Unique user id.
 * @return                       - appropriate error code that occurred or success.
 */
- (int)checkChallengeResponse:(NSString *)challenges forUserID:(NSString *)userID;

/**
 * @brief resetChallenge        - This method is used to reset the challenge
 * @return                      - appropriate error code that occurred or success.
 *
 */
- (int)resetChallenge;

/**
 * @brief updateChallenges      - This method is used to update the challenges.
 * @param challengeRequestArray - List of challenges to update
 * @param userID                - Unique user id.
 * @return                      - appropriate error code that occurred or success.
 */
- (int)updateChallenges:(NSString *)challenges forUserID:(NSString *)userID;

/**
 * @brief logOff   - This method is used to log off the user session.
 * @param userID            - Unique user id.
 * @return                  - appropriate error code that occurred or success.
 */
- (int)logOff:(NSString *)userID;

/**
 * @brief setDNSserver      - This method is used to set the DNS servers manually.
 * @param DNSServers        - This parameter is the array of the DNS server objects, which needs to be set as DNS servers.
 * @return                  - appropriate error code that occurred or success.
 */
//- (int)setDNSServers:(NSString *)DNSServers;


/**
 * @brief getNotifications  - This method is used to get notification from server.
 * @param recordCount       - number of records to be fetched, To get all    active notifications from the server set this value to -1.
 * @param enterpriseID      - Enterprise ID which we have got while onboarding the enterprise application
 * @param startIndex        - Index of the record from which to be fetched next nRecordCount.
 * @param startDate         - If date specific records needed then provide the start date from which to be fetched
 * @param endDate           - End date of records
 * @return                  - appropriate error code that occurred or success.
 */
- (int)getNotifications:(int)recordCount withEnterpriseID:(NSString*)enterpriseID withStartIndex:(int)startIndex withStartDate:(NSString*)startDate withEndDate:(NSString*)endDate;


/**
 * @brief updateNotification      - This method is used to update notification status.
 * @param notificationID          - otification ID for which the status is to be updated
 * @param response                - Notification response value * @param enterpriseID
 * @return                        - appropriate error code that occurred or success.
 */
- (int)updateNotification:(NSString*)notificationID withResponse:(NSString*)response;

/**
 * @brief getNotificationsHistiory      - This method is used to get notification history from server
 * @param recordCount                   - number of records to be fetched, To get all notifications from the server set this value to -1.
 * @param enterpriseID                  - Enterprise ID which we have got while onboarding the enterprise application
 * @param startIndex                    - Index of the record from which to be fetched next nRecordCount.
 * @param startDate                     - If date specific records needed then provide the start date from which to be fetched
 * @param endDate                       - End date of records
 * @param actionPerformed               - fetch notifications based on action taken
 * @param keywordSearch                 - fetch notifications based on search keyword
 * @param deviceID                      - fetch notifications based on device ID
 * @return                              - appropriate error code that occurred or success.
 */
- (int)getNotificationHistory:(int)recordCount withEnterpriseID:(NSString*)enterpriseID withStartIndex:(int)startIndex withStartDate:(NSString*)startDate withEndDate:(NSString*)endDate withNotificationStatus:(NSString*)notificationStatus withActionPerformed:(NSString*)actionPerformed withKeywordSearch:(NSString*)keywordSearch withDeviceID:(NSString*)deviceID;


/**
 * @brief openHttpConnection      - This method is used to create http/https request
 * @param httpRequestID           - Output parameter that is return request indentifier
 * @return                        - appropriate error code that occurred or success.
 */

-(int)openHttpConnection:(RDNAHTTPRequest*)request Callbacks:(id<RDNAHTTPCallbacks>)callbacks httpRequestID:(int*)httpRequestID;

@end




#endif
