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

RdnaClient.prototype.resetChallenge = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.resetChallenge failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.resetChallenge failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "resetChallenge", options);
};
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
RdnaClient.prototype.getSDKVersion = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getSDKVersion failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.getSDKVersion failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "getSDKVersion", options);
};

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


RdnaClient.prototype.getAllServices = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.getAllServices failure: failure parameter not a function");
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.getAllServices failure: success callback parameter must be a function");
        return
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "getAllServices", options);
};


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

RdnaClient.prototype.serviceAccessStartAll = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.serviceAccessStartAll failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStartAll failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "serviceAccessStartAll", options);
};

RdnaClient.prototype.serviceAccessStopAll = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }
    if (typeof errorCallback != "function") {
        console.log("RdnaClient.serviceAccessStopAll failure: failure parameter not a function");
        return
    }
    if (typeof successCallback != "function") {
        console.log("RdnaClient.serviceAccessStopAll failure: success callback parameter must be a function");
        return
    }
    cordova.exec(successCallback, errorCallback, "RdnaClient", "serviceAccessStopAll", options);
};

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

RdnaClient.prototype.checkChallenges = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.checkChallenges failure: failure parameter not a function");
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.checkChallenges failure: success callback parameter must be a function");
        return
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "checkChallenges", options);
};

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

RdnaClient.prototype.setApplicationFingerprint = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("RdnaClient.setApplicationFingerprint    failure: failure parameter not a function");
        return
    }

    if (typeof successCallback != "function") {
        console.log("RdnaClient.setApplicationFingerprint     failure: success callback parameter must be a function");
        return
    }

    cordova.exec(successCallback, errorCallback, "RdnaClient", "setApplicationFingerprint", options);
};

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

var rdnaClient = new RdnaClient();
module.exports = rdnaClient;




