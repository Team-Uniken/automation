var exec = require('cordova/exec');

RdnaClient.prototype.RDNAPrivacyScope = {

    RDNA_PRIVACY_SCOPE_SESSION: 1,
    RDNA_PRIVACY_SCOPE_DEVICE: 2,
    RDNA_PRIVACY_SCOPE_USER: 3,
    RDNA_PRIVACY_SCOPE_AGENT: 4
};

function RdnaClient() {
    console.log("RdnaClient.js: is created");
}

/**
 * 
 * @param {*} successCallback - Sync callback that indicates initialize call was successfull.
 * @param {*} errorCallback - Sync callback that indicates initialize failure. Returns the error code for
 *                            the error that occured.
 * @param {*} options - [AGENT_ID, RELID_GATEWAY_HOST, RELID_GATEWAY_PORT, CIPHER_SPECS, CIPHER_SALT, PROXY_SETTINGS]
 */
RdnaClient.prototype.initialize = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.initialize failure: failure parameter not a function");
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.initialize failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.logOff failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.terminate failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.pauseRuntime failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.resumeRuntime failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getDefaultCipherSalt failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getDefaultCipherSpec failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getDefaultCipherSpec", []);
};

/**
 * @param {*} successCallback - Sync callback that returns encrypted data.
 * @param {*} errorCallback - Sync callback that indicates encryptDataPacket failure. Returns the error code for the error occured
 * @param {*} options - [PRIVACY_SCOPE, CIPHER_SPEC, CIPHER_SALT, PLAIN_TEXT]
 */
RdnaClient.prototype.encryptDataPacket = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.encryptDataPacket failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.encryptDataPacket failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "encryptDataPacket", options);
};

/**
 * @param {*} successCallback - Sync callback that returns decrypted data.
 * @param {*} errorCallback - Sync callback that indicates decryptDataPacket failure. Returns the error code for the error occured
 * @param {*} options - [PRIVACY_SCOPE, CIPHER_SPEC, CIPHER_SALT, CIPHER_TEXT]
 */
RdnaClient.prototype.decryptDataPacket = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.decryptDataPacket failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.decryptDataPacket failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "decryptDataPacket", options);
};

/**
 * @param {*} successCallback - Sync callback that returns encrypted http request.
 * @param {*} errorCallback - Sync callback that indicates encryptHttpRequest failure. Returns the error code for the error occured
 * @param {*} options - [PRIVACY_SCOPE, CIPHER_SPEC, CIPHER_SALT, PLAIN_REQUEST]
 */
RdnaClient.prototype.encryptHttpRequest = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.encryptHttpRequest failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.encryptHttpRequest failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "encryptHttpRequest", options);
};

/**
 * @param {*} successCallback - Sync callback that returns decrypted http response.
 * @param {*} errorCallback - Sync callback that indicates decryptHttpResponse failure. Returns the error code for the error occured
 * @param {*} options - [PRIVACY_SCOPE, CIPHER_SPEC, CIPHER_SALT, ENCRYPTED_RESPONSE]
 */
RdnaClient.prototype.decryptHttpResponse = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.decryptHttpResponse failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.decryptHttpResponse failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getConfig failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.resetChallenge failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "resetChallenge", []);
};

/**
 * @param {*} successCallback - Sync callback that indicates forgotPassword call was successfull.
 * @param {*} errorCallback - Sync callback that indicates forgotPassword failure. Returns the error code for the error occured
 * @param {*} options - [USER_ID]
 */
RdnaClient.prototype.forgotPassword = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.forgotPassword failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.forgotPassword failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "forgotPassword", options);
};

/**
 * @param {*} successCallback - Sync callback that indicates getSDKVersion call was successfull. Returns RELID SDK version.
 * @param {*} errorCallback - Sync callback that indicates getSDKVersion failure. Returns the error code for the error occured.
 */
RdnaClient.prototype.getSDKVersion = function (successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getSDKVersion failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getSDKVersion failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getErrorInfo failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getAllServices failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getServiceByServiceName failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getServiceByTargetCoordinate failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStart failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStartAll failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStopAll failure: success callback parameter must be a function");
        return
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
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStop failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.checkChallengeResponse failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.updateChallenges failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient. getAllChallenges    failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.updateNotifications    failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getNotifications    failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setDeviceToken     failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setApplicationName     failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setApplicationVersion    failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getPostLoginChallenges    failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getRegisteredDeviceDetails    failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.updateDeviceDetails    failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setCredentials    failure: success callback parameter must be a function");
        return
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
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getSessionID    failure: success callback parameter must be a function");
        return
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getSessionID");
};

var rdnaClient = new RdnaClient();
module.exports = rdnaClient;




