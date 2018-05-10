var exec = require('cordova/exec');


RdnaClient.prototype.RDNAHttpMethods = {
    RDNA_HTTP_POST: 0,
    RDNA_HTTP_GET: 1,
};

/*
 @brief Enum RDNAMethodID - These identifiers are used to identify the routine when the StatusUpdate callback routine is invoked.
 */
RdnaClient.prototype.RDNAMethodID = {
    RDNA_METH_NONE: 0,                /* Not a specific method ID */
    RDNA_METH_INITIALIZE: 1,              /* Initialize runtime */
    RDNA_METH_TERMINATE: 2,               /* Terminate runtime */
    RDNA_METH_RESUME: 3,                  /* Resume runtime */
    RDNA_METH_PAUSE: 4,                   /* Pause runtime */
    RDNA_METH_GET_CONFIG: 5,              /* Get config call back method */
    RDNA_METH_CHECK_CHALLENGE: 6,         /* Check challenge call back method */
    RDNA_METH_UPDATE_CHALLENGE: 7,        /* Update user Challenge call back method*/
    RDNA_METH_GET_ALL_CHALLENGES: 8,      /* Get All challenges of user call back method*/
    RDNA_METH_LOGOFF: 9,                  /* Log Off user call back method*/
    RDNA_METH_FORGOT_PASSWORD: 10,         /* Forgot password call back method*/
    RDNA_METH_GET_POST_LOGIN_CHALLENGES: 11,         /* Get Post login challenge callback method*/
    RDNA_METH_GET_DEVICE_DETAILS: 12,                /* Get all registred devices for the user*/
    RDNA_METH_UPDATE_DEVICE_DETAILS: 13,             /* Update device details of the user*/
    RDNA_METH_GET_NOTIFICATIONS: 14,                 /* Get pending notifications from server */
    RDNA_METH_UPDATE_NOTIFICATION: 15,               /* Update notification status to server */
    RDNA_METH_OPEN_HTTP_CONNECTION: 16             /* Create http rest api tunnel request  */
};

RdnaClient.prototype.RDNALoggingLevel = {
    RDNA_NO_LOGS: 0,
    RDNA_LOG_WARN: 1,
    RDNA_LOG_NOTIFY: 2,
    RDNA_LOG_NETWORK: 3,
    RDNA_LOG_DNA: 4,
    RDNA_LOG_DEBUG: 5,
    RDNA_LOG_VERBOSE: 6
};

/*
 @brief Enum RDNAErrorID - This enum specifies all the error codes which RDNA returns back to the client.
 */
RdnaClient.prototype.RDNAErrorID = {
    RDNA_ERR_NONE: 0,                                  /* No Error                                             */
    RDNA_ERR_NOT_INITIALIZED: 1,                       /* If core not initialized                              */
    RDNA_ERR_GENERIC_ERROR: 2,                         /* If generic error occured                             */
    RDNA_ERR_INVALID_VERSION: 3,                       /* If invalid SDK Version                               */
    RDNA_ERR_INVALID_ARGS: 4,                          /* If invalid args are passed                           */
    RDNA_ERR_SESSION_EXPIRED: 5,                       /* If session has expired                               */
    RDNA_ERR_PARENT_PROXY_CONNECT_FAILED: 6,           /* If failed to connect to proxy server                 */
    RDNA_ERR_NULL_CALLBACKS: 7,                        /* If Null callback/ptr passed in                       */
    RDNA_ERR_INVALID_HOST: 8,                          /* If Null or empty hostname/IP                         */
    RDNA_ERR_INVALID_PORTNUM: 9,                       /* If Invalid port number                               */
    RDNA_ERR_INVALID_AGENT_INFO: 10,                    /* If agent info is invalid                             */
    RDNA_ERR_FAILED_TO_CONNECT_TO_SERVER: 11,           /* If failed to connect to server                       */
    RDNA_ERR_INVALID_SAVED_CONTEXT: 12,                 /* If Invalid saved context                             */
    RDNA_ERR_INVALID_HTTP_REQUEST: 13,                  /* If Invalid HTTP request                              */
    RDNA_ERR_INVALID_HTTP_RESPONSE: 14,                 /* If Invalid HTTP response                             */
    RDNA_ERR_INVALID_CIPHERSPECS: 15,                   /* If cipherspecs is invalid                            */
    RDNA_ERR_SERVICE_NOT_SUPPORTED: 16,                 /* If service not supported                             */
    RDNA_ERR_FAILED_TO_GET_STREAM_PRIVACYSCOPE: 17,     /* If failed to get stream privacy scope                */
    RDNA_ERR_FAILED_TO_GET_STREAM_TYPE: 18,             /* If failed to get stream type                         */
    RDNA_ERR_FAILED_TO_WRITE_INTO_STREAM: 19,           /* If failed to write into data stream                  */
    RDNA_ERR_FAILED_TO_END_STREAM: 20,                  /* If failed to end stream                              */
    RDNA_ERR_FAILED_TO_DESTROY_STREAM: 21,              /* If failed to destroy stream                          */
    RDNA_ERR_FAILED_TO_INITIALIZE: 22,                  /* If failed to initialize                              */
    RDNA_ERR_FAILED_TO_PAUSERUNTIME: 23,                /* If failed to pause runtime                           */
    RDNA_ERR_FAILED_TO_RESUMERUNTIME: 24,               /* If failed to resume runtime                          */
    RDNA_ERR_FAILED_TO_TERMINATE: 25,                   /* If failed to terminate                               */
    RDNA_ERR_FAILED_TO_GET_CIPHERSALT: 26,              /* If failed to get ciphersalt                          */
    RDNA_ERR_FAILED_TO_GET_CIPHERSPECS: 27,             /* If failed to get cipherspecs                         */
    RDNA_ERR_FAILED_TO_GET_AGENT_ID: 28,                /* If failed to get agent id                            */
    RDNA_ERR_FAILED_TO_GET_SESSION_ID: 29,              /* If failed to get session id                          */
    RDNA_ERR_FAILED_TO_GET_DEVICE_ID: 30,               /* If failed to get device id                           */
    RDNA_ERR_FAILED_TO_GET_SERVICE: 31,                 /* If failed to get service                             */
    RDNA_ERR_FAILED_TO_START_SERVICE: 32,               /* If failed to start service                           */
    RDNA_ERR_FAILED_TO_STOP_SERVICE: 33,                /* If failed to stop service                            */
    RDNA_ERR_FAILED_TO_ENCRYPT_DATA_PACKET: 34,         /* If failed to encrypt data packet                     */
    RDNA_ERR_FAILED_TO_DECRYPT_DATA_PACKET: 35,         /* If failed to decrypt data packet                     */
    RDNA_ERR_FAILED_TO_ENCRYPT_HTTP_REQUEST: 36,        /* If failed to encrypt HTTP request                    */
    RDNA_ERR_FAILED_TO_DECRYPT_HTTP_RESPONSE: 37,       /* If failed to decrypt HTTP response                   */
    RDNA_ERR_FAILED_TO_CREATE_PRIVACY_STREAM: 38,       /* If failed to create privacy stream                   */
    RDNA_ERR_FAILED_TO_CHECK_CHALLENGE: 39,             /* If failed to check challenges                        */
    RDNA_ERR_FAILED_TO_UPDATE_CHALLENGE: 40,            /* If failed to update challenges                       */
    RDNA_ERR_FAILED_TO_GET_CONFIG: 41,                  /* If failed to get config                              */
    RDNA_ERR_FAILED_TO_GET_ALL_CHALLENGES: 42,          /* If failed to get all challenges                      */
    RDNA_ERR_FAILED_TO_LOGOFF: 43,                      /* If failed to log off                                 */
    RDNA_ERR_FAILED_TO_RESET_CHALLENGE: 44,             /* If failed to reset challenge                         */
    RDNA_ERR_FAILED_TO_DO_FORGOT_PASSWORD: 45,          /* If failed to update forgot pass operation            */
    RDNA_ERR_FAILED_TO_GET_POST_LOGIN_CHALLENGES: 46,   /* If failed to get post login challenges               */
    RDNA_ERR_FAILED_TO_GET_REGISTERD_DEVICE_DETAILS: 47,/* If failed to get registered device details           */
    RDNA_ERR_FAILED_TO_UPDATE_DEVICE_DETAILS: 48,       /* If failed to update registered device details        */
    RDNA_ERR_FAILED_TO_GET_NOTIFICATIONS: 49,           /* If failed to get notification from server            */
    RDNA_ERR_FAILED_TO_UPDATE_NOTIFICATION: 50,         /* If failed to update notification to server           */
    RDNA_ERR_FAILED_TO_OPEN_HTTP_CONNECTION: 51,        /* If any failure occurs while openeing http tunnel(api)*/
    RDNA_ERR_SSL_INIT_FAILED: 52,                       /* If SSL init fails*/
    RDNA_ERR_SSL_ACTIVITY_FAILED: 53,                   /* If any error occured during ssl in action*/
    RDNA_ERR_DNS_FAILED: 54,                            /* If domain name resolution failed*/
    RDNA_ERR_NET_DOWN: 55,                              /* If network is down*/
    RDNA_ERR_SOCK_TIMEDOUT: 56,                         /* If connect timeout occured*/
    RDNA_ERR_DNA_INTERNAL: 57,
    //All errors above this are mapped with the internal errors

    //Following error codes are local error codes
    RDNA_ERR_INVALID_USER_MR_STATE: 58,                  /* Invalid user state in secure storage */
    RDNA_ERR_NOTF_SIGN_INTERNAL_FAILURE: 59,            /* Failure occurred when signing notification           */
    RDNA_ERR_FAILED_TO_PARSE_DEVICES: 60,                /* If parsing the device details failed                 */
    RDNA_ERR_INVALID_CHALLENGE_CONFIG: 61,               /* If there is any mistake in challenge configuration   */
    RDNA_ERR_INVALID_HTTP_API_REQ_URL: 62,               /* If URL in HTTP req is invalid                        */
    RDNA_ERR_NO_MEMORY: 63,
    RDNA_ERR_INVALID_CONTEXT: 64,
    RDNA_ERR_CIPHERTEXT_LENGTH_INVALID: 65,
    RDNA_ERR_CIPHERTEXT_EMPTY: 66,
    RDNA_ERR_PLAINTEXT_EMPTY: 67,
    RDNA_ERR_PLAINTEXT_LENGTH_INVALID: 68,
    RDNA_ERR_USERID_EMPTY: 69,
    RDNA_ERR_CHALLENGE_EMPTY: 70,
    RDNA_ERR_FAILED_TO_SERIALIZE_JSON: 71,
    RDNA_ERR_USECASE_EMPTY: 72,
    RDNA_ERR_INVALID_SERVICE_NAME: 73,
};

/*
 @brief enum RDNAPortType - These flags specify attributes of the returned access port for the backend service.
 */
RdnaClient.prototype.RDNAPortType = {
    RDNA_PORT_TYPE_PROXY: 0,    /* port type is proxy           */
    RDNA_PORT_TYPE_PORTF: 1          /* port type is port forwarding */
};

/*
 @brief enum RDNAPrivacyScope - These flags specifies which level of key to be used for encryption in data encryption API's.
 */
RdnaClient.prototype.RDNAPrivacyScope = {

    RDNA_PRIVACY_SCOPE_SESSION: 1,    /* use session-specific keys */
    RDNA_PRIVACY_SCOPE_DEVICE: 2,     /* use device-specific keys  */
    RDNA_PRIVACY_SCOPE_USER: 4,       /* use user-specific keys    */
    RDNA_PRIVACY_SCOPE_AGENT: 8       /* use agent-specific keys   */
};

/*
 @brief enum RDNAChallengeStatusCode - These flags error codes occured in MFA flow of advance API-SDK
 */
RdnaClient.prototype.RDNAResponseStatusCode = {
    RDNA_RESP_STATUS_SUCCESS: 100,                                /* Success                                                    */
    RDNA_RESP_STATUS_NO_USER_ID: 101,                                 /* No user Id.                                              */
    RDNA_RESP_STATUS_AUTH_FAILED: 102,                                /* Authentication failed                                     */
    RDNA_RESP_STATUS_SEC_QA_MATCH_FAILED: 103,                        /* Sec QA match failed                                   */
    RDNA_RESP_STATUS_NO_SEC_QA_PRESENT: 104,                          /* No Sec QA present                                  */
    RDNA_RESP_STATUS_PWD_UPDATE_FAILED: 105,                          /* Password update failed                                     */
    RDNA_RESP_STATUS_OTP_MATCH_FAILED: 106,                           /* OTP matching failed                                     */
    RDNA_RESP_STATUS_SECONDARY_SEC_QA_MATCH_FAILED: 107,              /* Secondary Sec QA match failed                            */
    RDNA_RESP_STATUS_ACT_CODE_MATCH_FAILED: 108,                      /* Activation code match failed                               */
    RDNA_RESP_STATUS_ACT_CODE_EXPIRED: 109,                           /* Activation code expired                                   */
    RDNA_RESP_STATUS_PASSWORD_EXPIRED: 110,                           /* Password expired                                        */
    RDNA_RESP_STATUS_OTP_EXPIRED: 111,                                /* OTP expired                                           */
    RDNA_RESP_STATUS_OTP_ALREADY_USED: 112,                           /* OTP already exists                                        */
    RDNA_RESP_STATUS_AUTO_RESET_USER: 113,                            /* Auto reset user                                      */
    RDNA_RESP_STATUS_INTERNAL_SERVER_ERROR: 114,                      /* Internal server error                             */
    RDNA_RESP_STATUS_POST_LOGIN_VERIFY_CREDS_FAILURE: 115,            /* Post login verify credentials failure                 */
    RDNA_RESP_STATUS_DEVICE_UPDATE_FAILED: 116,                       /* Failed to update device                            */
    RDNA_RESP_STATUS_USER_UNENROLLED: 117,                            /* User removed                                    */
    RDNA_RESP_STATUS_INVALID_USE_CASE: 118,                           /* Invalid use case                                 */
    RDNA_RESP_STATUS_USER_LOCKED: 119,                                /* User locked                                        */
    RDNA_RESP_STATUS_PERMANENT_DEVICE_LIMIT_EXCEEDED: 120,            /* Permanent device limit exceeded                      */
    RDNA_RESP_STATUS_CHALLENGE_NOT_FOUND: 121,                        /* Challenge not found                                  */
    RDNA_RESP_STATUS_TOKEN_BASED_AUTH_FAILED: 122,                    /* Token authentication failed                            */
    RDNA_RESP_STATUS_TOKEN_BASED_AUTH_UPDATED: 123,                   /* Token authentication updated                        */
    RDNA_RESP_STATUS_AD_USER_DISABLE: 124,                            /* AD User disabled                                 */
    RDNA_RESP_STATUS_AD_USER_DELETED: 125,                            /* AD User deleted                                     */
    RDNA_RESP_STATUS_USER_DEVICE_NOT_REGISTERED: 126,                 /* User device not register                           */
    RDNA_RESP_STATUS_USER_BLOCKED: 127,                               /* User blocked                                    */
    RDNA_RESP_STATUS_USER_SUSPENDED: 128,                             /* User suspended                                  */
    RDNA_RESP_STATUS_INVALID_CHALLENGE_JSON: 129,                     /* Challenge JSON is invalid                           */
    RDNA_RESP_STATUS_AD_PASSWORD_MISMATCH: 130,                       /* AD password mismatch                              */
    RDNA_RESP_STATUS_DEVICE_VALIDATION_FAILED: 131,                   /* Device validation failed                           */
    RDNA_RESP_STATUS_USER_ALREADY_ACTIVE: 132,                        /* User already active                                  */
};


/*
 @brief enum RDNAIWAAuthStatus - These flags specifies the Integrated windows authentication credential status which will be set by the
 API-Client in getCredentials call back
 */
RdnaClient.prototype.RDNAIWAAuthStatus = {
    RDNA_IWA_AUTH_SUCCESS: 0,
    RDNA_IWA_AUTH_CANCELLED: 1,
    RDNA_IWA_AUTH_DEFERRED: 2
};

/*
 @brief enum RDNAChallengeOpMode - These flags specifies the operation on the challenges whether the challenges received are to set new challenge
 or the received challenges are to be verified by the user.
 */
RdnaClient.prototype.RDNAChallengeOpMode = {
    RDNA_CHALLENGE_OP_VERIFY: 0,
    RDNA_CHALLENGE_OP_SET: 1,
};

RdnaClient.prototype.RDNADeviceStatus = {
    RDNA_DEVSTATUS_ACTIVE: 0,
    RDNA_DEVSTATUS_UPDATE: 1,
    RDNA_DEVSTATUS_DELETE: 2,
    RDNA_DEVSTATUS_BLOCKED: 3,     // - For Future use
    RDNA_DEVSTATUS_SUSPEND: 4,     // - For Future use
};

RdnaClient.prototype.RDNADeviceBinding = {
    RDNA_PERMENANT: 0,
    RDNA_TEMPORARY: 1
};


function RdnaClient() {
    console.log("RdnaClient.js: is created");
}

/**
 * 
 * @param {*} successCallback - Sync callback that indicates initialize call was successfull.
 * @param {*} errorCallback - Sync callback that indicates initialize failure. Returns the error code for
 *                            the error that occured.
 * @param {*} options - [AGENT_ID, RELID_GATEWAY_HOST, RELID_GATEWAY_PORT, CIPHER_SPECS, CIPHER_SALT, PROXY_SETTINGS,Enum:RDNALoggingLevel]
 */
RdnaClient.prototype.initialize = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.initialize failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.initialize failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "initialize", options);
};


/**
 * @param {*} successCallback - Sync callbback that indicates logOff call was successfull.
 * @param {*} errorCallback - Sync callback that indicates logOff failure. Returns the error code for that occured
 * @param {*} options - [USER_ID]
 */
RdnaClient.prototype.logOff = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.logOff failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.logOff failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "logoff", options);
};

/**
 * @param {*} successCallback - Sync callbback that indicates terminate call was successfull.
 * @param {*} errorCallback - Sync callback that indicates terminate failure. Returns the error code for that occured
 */
RdnaClient.prototype.terminate = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.terminate failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.terminate failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "terminate", []);
};

/**
 * @param {*} successCallback - Sync callbback that indicates pauseRuntime call was successfull. Returns state of SDK.
 * @param {*} errorCallback - Sync callback that indicates pauseRuntime failure. Returns the error code for the error occured
 */
RdnaClient.prototype.pauseRuntime = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.pauseRuntime failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.pauseRuntime failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "pauseRuntime", []);
};

/**
 * 
 * @param {*} successCallback - Sync callback that indicates resumeRuntime call was successfull.
 * @param {*} errorCallback - Sync callback that indicates resumeRuntime failure. Returns the error code for
 *                            the error that occured.
 * @param {*} options - [SAVED_SDK_STATE]
 */
RdnaClient.prototype.resumeRuntime = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.resumeRuntime failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.resumeRuntime failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "resumeRuntime", options);
};

/**
 * @param {*} successCallback - Sync callback that returns default cipher salt.
 * @param {*} errorCallback - Sync callback that indicates getDefaultCipherSalt failure. Returns the error code for the error occured
 */
RdnaClient.prototype.getDefaultCipherSalt = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getDefaultCipherSalt failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getDefaultCipherSalt failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getDefaultCipherSalt", []);
};

/**
 * @param {*} successCallback - Sync callback that returns default cipher specs.
 * @param {*} errorCallback - Sync callback that indicates getDefaultCipherSpec failure. Returns the error code for the error occured
 */
RdnaClient.prototype.getDefaultCipherSpec = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getDefaultCipherSpec failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getDefaultCipherSpec failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getDefaultCipherSpec", []);
};

/**
 * @param {*} successCallback - Sync callback that returns encrypted data.
 * @param {*} errorCallback - Sync callback that indicates encryptDataPacket failure. Returns the error code for the error occured
 * @param {*} options - [ENum:RDNAPrivacyScope, CIPHER_SPEC, CIPHER_SALT, PLAIN_TEXT]
 */
RdnaClient.prototype.encryptDataPacket = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.encryptDataPacket failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.encryptDataPacket failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "encryptDataPacket", options);
};

/**
 * @param {*} successCallback - Sync callback that returns decrypted data.
 * @param {*} errorCallback - Sync callback that indicates decryptDataPacket failure. Returns the error code for the error occured
 * @param {*} options - [ENUM:RDNAPrivacyScope, CIPHER_SPEC, CIPHER_SALT, CIPHER_TEXT]
 */
RdnaClient.prototype.decryptDataPacket = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.decryptDataPacket failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.decryptDataPacket failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "decryptDataPacket", options);
};

/**
 * @param {*} successCallback - Sync callback that returns encrypted http request.
 * @param {*} errorCallback - Sync callback that indicates encryptHttpRequest failure. Returns the error code for the error occured
 * @param {*} options - [Enum:RDNAPrivacyScope, CIPHER_SPEC, CIPHER_SALT, PLAIN_REQUEST]
 */
RdnaClient.prototype.encryptHttpRequest = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.encryptHttpRequest failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.encryptHttpRequest failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "encryptHttpRequest", options);
};

/**
 * @param {*} successCallback - Sync callback that returns decrypted http response.
 * @param {*} errorCallback - Sync callback that indicates decryptHttpResponse failure. Returns the error code for the error occured
 * @param {*} options - [Enum:RDNAPrivacyScope, CIPHER_SPEC, CIPHER_SALT, ENCRYPTED_RESPONSE]
 */
RdnaClient.prototype.decryptHttpResponse = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.decryptHttpResponse failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.decryptHttpResponse failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "decryptHttpResponse", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getConfig call was successfull.
 * @param {*} errorCallback - Sync callback that indicates getConfig failure. Returns the error code for the error occured
 * @param {*} options - [USER_ID]
 */
RdnaClient.prototype.getConfig = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getConfig failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getConfig failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getConfig", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates resetChallenge call was successfull.
 * @param {*} errorCallback - Sync callback that indicates resetChallenge failure. Returns the error code for the error occured
 */
RdnaClient.prototype.resetChallenge = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.resetChallenge failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.resetChallenge failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "resetChallenge", []);
};

/**
 * @param {*} successCallback - Sync callback that indicates getSDKVersion call was successfull. Returns RELID SDK version.
 * @param {*} errorCallback - Sync callback that indicates getSDKVersion failure. Returns the error code for the error occured.
 */
RdnaClient.prototype.getSDKVersion = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getSDKVersion failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getSDKVersion failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getSDKVersion", []);
};


/**
 * @param {*} successCallback - Sync callback that indicates getErrorInfo call was successfull. Returns error description.
 * @param {*} errorCallback - Sync callback that indicates getErrorInfo failure. Returns the error code for the error occured.
 * @param {*} options - [ERROR_CODE]
 */
RdnaClient.prototype.getErrorInfo = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getErrorInfo failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getErrorInfo failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getErrorInfo", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getAllServices call was successfull. Returns stringified list of services.
 * @param {*} errorCallback - Sync callback that indicates getAllServices failure. Returns the error code for the error occured.
 */
RdnaClient.prototype.getAllServices = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getAllServices failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getAllServices failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getAllServices", []);
};

/**
 * @param {*} successCallback - Sync callback that indicates getServiceByServiceName call was successfull. Returns service details.
 * @param {*} errorCallback - Sync callback that indicates getServiceByServiceName failure. Returns the error code for the error occured.
 * @param {*} options - [SERVICE_NAME]
 */
RdnaClient.prototype.getServiceByServiceName = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getServiceByServiceName failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getServiceByServiceName failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getServiceByServiceName", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getServiceByTargetCoordinate call was successfull. Returns service details.
 * @param {*} errorCallback - Sync callback that indicates getServiceByTargetCoordinate failure. Returns the error code for the error occured.
 * @param {*} options - [TARGET_HNIP, TARGET_PORT]
 */
RdnaClient.prototype.getServiceByTargetCoordinate = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getServiceByTargetCoordinate failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getServiceByTargetCoordinate failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getServiceByTargetCoordinate", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates serviceAccessStart call was successfull.
 * @param {*} errorCallback - Sync callback that indicates getServiceByTargetCoordinate failure. Returns the error code for the error occured.
 * @param {*} options - [STRINGIFIED_SERVICE_OBJECT]
 */
RdnaClient.prototype.serviceAccessStart = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.serviceAccessStart failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStart failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "serviceAccessStart", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates serviceAccessStartAll call was successfull.
 * @param {*} errorCallback - Sync callback that indicates serviceAccessStartAll failure. Returns the error code for the error occured.
 */
RdnaClient.prototype.serviceAccessStartAll = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.serviceAccessStartAll failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStartAll failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "serviceAccessStartAll", []);
};

/**
 * @param {*} successCallback - Sync callback that indicates serviceAccessStopAll call was successfull.
 * @param {*} errorCallback - Sync callback that indicates serviceAccessStopAll failure. Returns the error code for the error occured.
 */
RdnaClient.prototype.serviceAccessStopAll = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.serviceAccessStopAll failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStopAll failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "serviceAccessStopAll", []);
};

/**
 * @param {*} successCallback - Sync callback that indicates serviceAccessStop call was successfull.
 * @param {*} errorCallback - Sync callback that indicates serviceAccessStop failure. Returns the error code for the error occured.
 * @param {*} options - [STRINGIFIED_SERVICE_OBJECT]
 */
RdnaClient.prototype.serviceAccessStop = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.serviceAccessStop failure: failure parameter not a function");
        return;
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStop failure: success callback parameter must be a function");
        return;
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "serviceAccessStop", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates checkChallengeResponse call was successfull.
 * @param {*} errorCallback - Sync callback that indicates checkChallengeResponse failure. Returns the error code for the error occured.
 * @param {*} options - [STRINGIFIED_CHALLENGE_OBJECT, USER_ID]
 */
RdnaClient.prototype.checkChallengeResponse = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.checkChallengeResponse failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.checkChallengeResponse failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "checkChallengeResponse", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates updateChallenges call was successfull.
 * @param {*} errorCallback - Sync callback that indicates updateChallenges failure. Returns the error code for the error occured.
 * @param {*} options - [STRINGIFIED_CHALLENGE_OBJECT, USER_ID]
 */
RdnaClient.prototype.updateChallenges = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.updateChallenges failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.updateChallenges failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "updateChallenges", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getAllChallenges call was successfull.
 * @param {*} errorCallback - Sync callback that indicates getAllChallenges failure. Returns the error code for the error occured.
 * @param {*} options - [USER_ID]
 */
RdnaClient.prototype.getAllChallenges = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient. getAllChallenges    failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient. getAllChallenges    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getAllChallenges", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates updateNotifications call was successfull.
 * @param {*} errorCallback - Sync callback that indicates updateNotifications failure. Returns the error code for the error occured.
 * @param {*} options - [NOTIFICATION_ID, NOTIFICATION_ACTION]
 */
RdnaClient.prototype.updateNotifications = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.updateNotifications    failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.updateNotifications    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "updateNotifications", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getNotifications call was successfull.
 * @param {*} errorCallback - Sync callback that indicates getNotifications failure. Returns the error code for the error occured.
 * @param {*} options - [RECORD_COUNT, START_RECORD, ENTERPRISE_ID, START_DATE, END_DATE]
 */
RdnaClient.prototype.getNotifications = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getNotifications    failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getNotifications    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getNotifications", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates setDeviceToken call was successfull.
 * @param {*} errorCallback - Sync callback that indicates setDeviceToken failure. Returns the error if any.
 * @param {*} options - [GCM_OR_APNS_TOKEN]
 */
RdnaClient.prototype.setDeviceToken = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.setDeviceToken     failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setDeviceToken     failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "setDeviceToken", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates setApplicationName call was successfull.
 * @param {*} errorCallback - Sync callback that indicates setApplicationName failure. Returns the error if any.
 * @param {*} options - [APPLICATION_NAME]
 */
RdnaClient.prototype.setApplicationName = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.setApplicationName    failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setApplicationName     failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "setApplicationName", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates setApplicationVersion call was successfull.
 * @param {*} errorCallback - Sync callback that indicates setApplicationVersion failure. Returns the error if any.
 * @param {*} options - [APPLICATION_VERSION]
 */
RdnaClient.prototype.setApplicationVersion = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.setApplicationVersion   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setApplicationVersion    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "setApplicationVersion", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getPostLoginChallenges call was successfull.
 * @param {*} errorCallback - Sync callback that indicates getPostLoginChallenges failure. Returns the error code for the error occured.
 * @param {*} options - [USER_ID, USECASE_NAME]
 */
RdnaClient.prototype.getPostLoginChallenges = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getPostLoginChallenges   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getPostLoginChallenges    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getPostLoginChallenges", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getRegisteredDeviceDetails call was successfull.
 * @param {*} errorCallback - Sync callback that indicates getRegisteredDeviceDetails failure. Returns the error code for the error occured.
 * @param {*} options - [USER_ID]
 */
RdnaClient.prototype.getRegisteredDeviceDetails = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getRegisteredDeviceDetails   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getRegisteredDeviceDetails    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getRegisteredDeviceDetails", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates updateDeviceDetails call was successfull.
 * @param {*} errorCallback - Sync callback that indicates updateDeviceDetails failure. Returns the error code for the error occured.
 * @param {*} options - [USER_ID, STRINGIFIED_DEVICE_OBJECT]
 */
RdnaClient.prototype.updateDeviceDetails = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.updateDeviceDetails   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.updateDeviceDetails    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "updateDeviceDetails", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates setCredentials call was successfull.
 * @param {*} errorCallback - Sync callback that indicates setCredentials failure. Returns the error code for the error occured.
 * @param {*} options - [USERNAME, PASSWORD, BOOLEAN_AUTH_STATUS]
 */
RdnaClient.prototype.setCredentials = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.setCredentials   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setCredentials    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "setCredentials", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getSessionID call was successfull. Returns session ID of current session.
 * @param {*} errorCallback - Sync callback that indicates getSessionID failure. Returns the error code for the error occured.
 */
RdnaClient.prototype.getSessionID = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getSessionID   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getSessionID    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getSessionID");
};

/**
 * @param {*} successCallback - Sync callback that indicates getAgentID call was successfull. Returns getAgentID of current app session.
 * @param {*} errorCallback - Sync callback that indicates getAgentID failure. Returns the error code for the error occured.
 */
RdnaClient.prototype.getAgentID = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getAgentID   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getAgentID    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getAgentID");
};

/**
 * @param {*} successCallback - Sync callback that indicates getDeviceID call was successfull. Returns getDeviceID of current app session.
 * @param {*} errorCallback - Sync callback that indicates getDeviceID failure. Returns the error code for the error occured.
 */
RdnaClient.prototype.getAgentID = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getDeviceID   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getDeviceID    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getDeviceID");
};

/**
 * @param {*} successCallback - Sync callback that indicates openHttpConnection call was successfull and return the http request id .
 * @param {*} errorCallback - Sync callback that indicates openHttpConnection failure. Returns the error code for the error occured.
 * @param {*} options - [Enum:RDNAHttpMethods, URL, HEADER, BODY]
 */
RdnaClient.prototype.openHttpConnection = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.openHttpConnection   failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.openHttpConnection    failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "openHttpConnection", options);
};


var rdnaClient = new RdnaClient();
module.exports = rdnaClient;




