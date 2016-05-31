#ifndef __RDNA_CPP_JS_INTERN_HEADER_INCLUDED__
#define __RDNA_CPP_JS_INTERN_HEADER_INCLUDED__

#include <string>

class RDNA;
class RDNAPrivacyStream;

#define MIN_PORT_VALUE 0

#define STR_CHLNG                      "chlng"
#define STR_SUB_CHLNG_COUNT            "sub_chlng_count"
#define STR_CHLNGS_PER_BATCH           "chlngs_per_batch"
#define STR_CHLNG_RESP                 "chlng_resp"
#define STR_CHLNG_PROMPT               "chlng_prompt"
#define STR_CHLNG_IDX                  "chlng_idx"
#define STR_CHLNG_TYPE                 "chlng_type"
#define STR_CHLNG_NAME                 "chlng_name"
#define STR_ATTEMPTS_LEFT              "attempts_left"
#define STR_TOTAL_CHLNGS               "total_no_of_chlngs"
#define STR_SUB_CHLNG_IDX              "sub_challenge_index"
#define STR_CHLNG_OP_MODE              "challengeOperation"
#define STR_CHLNG_INFO                 "chlng_info"
#define STR_CHLNG_RESP_VALIDATION      "chlng_response_validation"
#define STR_CHLNG_RESP_POLICY          "challenge_response_policy"
#define STR_CHLNG_USER_ID              "user_id"
#define STR_CHLNG_CHLNG                "challenge"
#define STR_CHLNG_RESPONSE             "response"
#define STR_ERR_CODE                   "errCode"
#define STR_STATUS_CODE                "status_code"
#define STR_STATUS_MSG                 "status_msg"
#define STR_METHOD_ID                  "eMethId"
#define STR_DEVICE_DETAILS             "device_details"
#define STR_PROXY_DETAILS              "pxyDetails"
#define STR_P_ARGS                     "pArgs"
#define STR_CONFIG                     "Config"
#define STR_URL                        "url"

#define STR_SERVICES                   "Services"
#define STR_SERVICES_COUNT             "Services_Count"
#define STR_SERVICE_NAME               "serviceName"
#define STR_TARGET_HNIP                "targetHNIP"
#define STR_APP_UUID                   "app_uuid"
#define STR_ACCESS_SERVER_NAME         "accessServerName"
#define STR_SPN                        "spn"
#define STR_REALM                      "realm"
#define STR_TCKT_FETCHER_URL           "ticketFetcherURL"
#define STR_TARGET_PORT                "targetPort"
#define STR_IS_AUTO_STARTED            "isAutoStartedPort"
#define STR_IS_LOCAL_HOST_ONLY         "isLocalhostOnly"
#define STR_IS_STARTED                 "isStarted"
#define STR_IS_PRIVACY_ENABLED         "isPrivacyEnabled"
#define STR_PORT_TYPE                  "portType"
#define STR_PORT                       "port"
#define STR_PORT_INFO                  "portInfo"
#define STR_SERVICE_NAME               "serviceName"
#define STR_RESPONSE_DATA              "ResponseData"
#define STR_RESPONSE_DATA_LEN          "ResponseDataLen"
#define STR_SERVICE_DETAILS            "service_details"
#define STR_PXY_HOST                   "pxyHost"
#define STR_PXY_PORT                   "pxyPort"
#define STR_PXY_PSWD                   "pxyPass"
#define STR_PXY_USER                   "pxyUser"



#define STR_RDNA_PRIV_SCOPE_SSN        "RDNA_PRIVACY_SCOPE_SESSION"
#define STR_RDNA_PRIV_SCOPE_DEVICE     "RDNA_PRIVACY_SCOPE_DEVICE"
#define STR_RDNA_PRIV_SCOPE_USER       "RDNA_PRIVACY_SCOPE_USER"
#define STR_RDNA_PRIV_SCOPE_AGENT      "RDNA_PRIVACY_SCOPE_AGENT"


typedef enum {
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
  RDNA_METH_UPDATE_DEVICE_DETAILS,              /* Update device details of the user*/
  RDNA_METH_GET_CREDS_CB,
} RDNAMethodID;

/*
@brief enum RDNAIWAAuthStatus - These flags specifies the Integrated windows
authentication credential status which will be set
by the user/callback executioner.
API-Client in getCredentials call back
*/
typedef enum{
  RDNA_IWA_AUTH_SUCCESS   = 0,
  RDNA_IWA_AUTH_CANCELLED = 1,
  RDNA_IWA_AUTH_DEFERRED  = 2
} RDNAIWAAuthStatus;

/*
@brief enum RDNAChallengeOpMode - These flags specifies the operation on the challenges whether the challenges received are to set new challenge
or the received challenges are to be verified by the user.
*/
typedef enum{
  RDNA_CHALLENGE_OP_VERIFY = 0,
  RDNA_CHALLENGE_OP_SET
} RDNAChallengeOpMode;

/*
@brief Enum RDNAErrorID - This enum specifies all the error codes which RDNA returns back to the client.
*/
typedef enum {
  RDNA_ERR_NONE = 0,                               /* No Error                                             */

  RDNA_ERR_NOT_INITIALIZED = 1,                    /* If core not initialized                              */
  RDNA_ERR_GENERIC_ERROR,                          /* If generic error occured                             */
  RDNA_ERR_INVALID_VERSION,                        /* If invalid SDK Version                               */
  RDNA_ERR_INVALID_ARGS,                           /* If invalid args are passed                           */
  RDNA_ERR_INVALID_CONTEXT,                        /* If invalid context is passed                         */
  RDNA_ERR_SESSION_EXPIRED,                        /* If session has expired                               */
  RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS,

  RDNA_ERR_FAILED_TO_CONNECT_VIA_PROXY = 21,       /* If failed to connect to proxy server                 */
  RDNA_ERR_NULL_CALLBACKS,                         /* If Null callback/ptr passed in                       */
  RDNA_ERR_INVALID_HOST,                           /* If Null or empty hostname/IP                         */
  RDNA_ERR_INVALID_PORTNUM,                        /* If Invalid port number                               */
  RDNA_ERR_INVALID_AGENT_INFO,                     /* If agent info is invalid                             */
  RDNA_ERR_FAILED_TO_CONNECT_TO_SERVER,            /* If failed to connect to server                       */
  RDNA_ERR_FAILED_TO_AUTHENTICATE,                 /* If failed to authenticate                            */
  RDNA_ERR_INVALID_SAVED_CONTEXT,                  /* If Invalid saved context                             */
  RDNA_ERR_INVALID_HTTP_REQUEST,                   /* If Invalid HTTP request                              */
  RDNA_ERR_INVALID_HTTP_RESPONSE,                  /* If Invalid HTTP response                             */

  RDNA_ERR_INVALID_CIPHERSPECS = 42,               /* If cipherspecs is invalid                            */
  RDNA_ERR_PLAINTEXT_EMPTY,                        /* If plain text is empty in data packet/HTTP request   */
  RDNA_ERR_PLAINTEXT_LENGTH_INVALID,               /* If plain text length is empty/invalid                */
  RDNA_ERR_CIPHERTEXT_EMPTY,                       /* If cipher text is empty in data packet/HTTP request  */
  RDNA_ERR_CIPHERTEXT_LENGTH_INVALID,              /* If cipher text length is empty/invalid               */

  RDNA_ERR_SERVICE_NOT_SUPPORTED = 61,             /* If service not supported                             */
  RDNA_ERR_INVALID_SERVICE_NAME,                   /* If Invalid service name                              */

  RDNA_ERR_FAILED_TO_GET_STREAM_PRIVACYSCOPE = 81, /* If failed to get stream privacy scope                */
  RDNA_ERR_FAILED_TO_GET_STREAM_TYPE,              /* If failed to get stream type                         */
  RDNA_ERR_FAILED_TO_WRITE_INTO_STREAM,            /* If failed to write into data stream                  */
  RDNA_ERR_FAILED_TO_END_STREAM,                   /* If failed to end stream                              */
  RDNA_ERR_FAILED_TO_DESTROY_STREAM,               /* If failed to destroy stream                          */

  RDNA_ERR_FAILED_TO_INITIALIZE = 101,             /* If failed to initialize                              */
  RDNA_ERR_FAILED_TO_PAUSERUNTIME,                 /* If failed to pause runtime                           */
  RDNA_ERR_FAILED_TO_RESUMERUNTIME,                /* If failed to resume runtime                          */
  RDNA_ERR_FAILED_TO_TERMINATE,                    /* If failed to terminate                               */
  RDNA_ERR_FAILED_TO_GET_CIPHERSALT,               /* If failed to get ciphersalt                          */
  RDNA_ERR_FAILED_TO_GET_CIPHERSPECS,              /* If failed to get cipherspecs                         */
  RDNA_ERR_FAILED_TO_GET_AGENT_ID,                 /* If failed to get agent id                            */
  RDNA_ERR_FAILED_TO_GET_SESSION_ID,               /* If failed to get session id                          */
  RDNA_ERR_FAILED_TO_GET_DEVICE_ID,                /* If failed to get device id                           */
  RDNA_ERR_FAILED_TO_GET_SERVICE,                  /* If failed to get service                             */
  RDNA_ERR_FAILED_TO_START_SERVICE,                /* If failed to start service                           */
  RDNA_ERR_FAILED_TO_STOP_SERVICE,                 /* If failed to stop service                            */
  RDNA_ERR_FAILED_TO_ENCRYPT_DATA_PACKET,          /* If failed to encrypt data packet                     */
  RDNA_ERR_FAILED_TO_DECRYPT_DATA_PACKET,          /* If failed to decrypt data packet                     */
  RDNA_ERR_FAILED_TO_ENCRYPT_HTTP_REQUEST,         /* If failed to encrypt HTTP request                    */
  RDNA_ERR_FAILED_TO_DECRYPT_HTTP_RESPONSE,        /* If failed to decrypt HTTP response                   */
  RDNA_ERR_FAILED_TO_CREATE_PRIVACY_STREAM,        /* If failed to create privacy stream                   */
  RDNA_ERR_FAILED_TO_CHECK_CHALLENGE,              /* If failed to check challenges                        */
  RDNA_ERR_FAILED_TO_UPDATE_CHALLENGE,             /* If failed to update challenges                       */
  RDNA_ERR_FAILED_TO_GET_CONFIG,                   /* If failed to get config                              */
  RDNA_ERR_FAILED_TO_GET_ALL_CHALLENGES,           /* If failed to get all challenges                      */
  RDNA_ERR_FAILED_TO_LOGOFF,                       /* If failed to log off                                 */
  RDNA_ERR_FAILED_TO_RESET_CHALLENGE,              /* If failed to reset challenge                         */
  RDNA_ERR_FAILED_TO_DO_FORGOT_PASSWORD,           /* If failed to update forgot pass operation            */
  RDNA_ERR_FAILED_TO_SEND_DEV_DETAILS,             /* If failed to send device details to server           */
  RDNA_ERR_FAILED_TO_SET_DNS_SERVER,               /* If failed to set DNS server                          */
  RDNA_ERR_INVALID_CHALLENGE_CONFIG,               /* If there is any mistake in challenge configuration   */
  RDNA_ERR_USERID_EMPTY,                           /* If empty user id is provided to the api              */
  RDNA_ERR_CHALLENGE_EMPTY,                        /* If empty challenge is provided to the api            */
  RDNA_ERR_FAILED_TO_SERIALIZE_JSON,               /* If failed to serialize json                          */
  RDNA_ERR_FAILED_TO_DESERIALIZE_JSON,             /* If failed to deserialize json                        */
  RDNA_NO_MEMORY,
  RDNA_ERR_USECASE_EMPTY,
  RDNA_ERR_DEVICE_DETAILS_EMPTY,
  RDNA_ERR_401_URL_EMPTY,
  RDNA_ERR_PASSWORD_EMPTY,
  RDNA_ERR_INVALID_CHALLENGE_JSON,
} RDNAErrorID;

/*
@brief enum RDNAChallengeStatusCode - These flags error codes occured in MFA flow of advance API-SDK
*/
typedef enum{
  RDNA_CHLNG_STATUS_SUCCESS = 0,                           /* Sucess challenge                                   */
  RDNA_CHLNG_STATUS_NO_SUCH_USER,                          /* No such user exists.                               */
  RDNA_CHLNG_STATUS_USER_SUSPENDED,                        /* All attempts exhausted.User is suspended           */
  RDNA_CHLNG_STATUS_USER_BLOCKED,                          /* All attempts exhausted.User is blocked             */
  RDNA_CHLNG_STATUS_USER_ALREADY_ACTIVATED,                /* The user is already activated.Please login again   */
  RDNA_CHLNG_STATUS_INVALID_ACT_CODE,                      /* Invalid activation code                            */
  RDNA_CHLNG_STATUS_UPDATE_CHALLENGES_FAILED,              /* Failed to update credentials                       */
  RDNA_CHLNG_STATUS_CHALLENGE_RESPONSE_VALIDATION_FAILED,  /* Failed to Validate previous challenges             */
  RDNA_CHLNG_STATUS_DEVICE_VALIDATION_FAILED,              /* Device validation failed                           */
  RDNA_CHLNG_STATUS_INVALID_CHALLENGE_LIST,                /* Invalid challenge list sent for the state          */
  RDNA_CHLNG_STATUS_INTERNAL_SERVER_ERROR,                 /* Internal server error occured                      */
  RDNA_CHLNG_STATUS_UNKNOWN_ERROR,                          /* Unknown error occured while updating / validaating challenes*/
  RDNA_CHLNG_STATUS_FAILED_UPDATE_DEVICE_DETAILS,
  RDNA_CHLNG_STATUS_NO_SUCH_USE_CASE_EXISTS,

} RDNAChallengeStatusCode;

/*
@brief struct RDNAIWACreds : This structure specifies the integrated windows
authentication credentials API client may fill up this
structure when asked for user authentication for
Integrated windows Authentication.
this may be filled up in getCredentials callback.to get through the authentication
*/
typedef struct RDNAIWACreds_s {
  std::string userName;                    /* userName for authentication */
  std::string password;                    /* password for authentication */
  RDNAIWAAuthStatus authStatus;            /* status of authentication    */
  RDNAIWACreds_s() : userName(""), password(""), authStatus(RDNA_IWA_AUTH_CANCELLED)
  {}
} RDNAIWACreds;
#endif