#ifndef __RDNA_CPP_JS_INTERN_HEADER_INCLUDED__
#define __RDNA_CPP_JS_INTERN_HEADER_INCLUDED__

#include <string>

class RDNA;
class RDNAPrivacyStream;

#define MIN_PORT_VALUE 0

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

  RDNA_ERR_USERID_EMPTY,                           /* If empty user id is provided to the api              */
  RDNA_ERR_CHALLENGE_EMPTY,                        /* If empty challenge is provided to the api            */
  RDNA_ERR_FAILED_TO_SERIALIZE_JSON,               /* If failed to serialize json                          */
  RDNA_ERR_FAILED_TO_DESERIALIZE_JSON,             /* If failed to deserialize json                        */
  RDNA_NO_MEMORY,
  RDNA_ERR_USECASE_EMPTY,
  RDNA_ERR_DEVICE_DETAILS_EMPTY,
  RDNA_ERR_401_URL_EMPTY,
  RDNA_ERR_PASSWORD_EMPTY,
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
  RDNA_CHLNG_STATUS_UNKNOWN_ERROR                          /* Unknown error occured while updating / validaating challenes*/
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