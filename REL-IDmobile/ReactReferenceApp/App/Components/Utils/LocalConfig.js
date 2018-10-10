import Config from 'react-native-config';
var RNFS = require('react-native-fs');
import { Platform } from 'react-native';
var sslCertificateFile = null;

function requireClientBasedConfig() {
    var config = null;

    if (Config.ENV == 'sandp') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/snp.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: 'uniken123$',
                },
                img: {
                    welcome: require('../../img/sandp.png')
                },
                notification:require("../view/notificationcard").default,
                dashboard: {
                    screenName: 'homepage',
                    screen: require('../Dashboard/SandP/homepage').default,
                }
            }
        })();
    }
    if (Config.ENV == 'nwd') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/nwd.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: 'uniken123$',
                },
                img: {
                    welcome: require('../../img/nwd.png')
                },
                bottomMenu: require("../view/bottomMenu"),
                notification:require("../view/notificationcard").default,
                dashboard: {
                    screenName: 'Deals',
                    screen: require('../Dashboard/NWD/Deals').default,
                }
            }
        })();
    }
    if (Config.ENV == 'stock') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/stock.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: 'uniken123$',
                },
                img: {
                    welcome: require('../../img/stock.png')
                },
                notification:require("../view/notificationcard").default,
                dashboard: {
                    screenName: 'Deals',
                    screen: require("../Dashboard/Stock/Deals").default,
                }
            }
        })();
    }
    if (Config.ENV == 'ubs') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/ubs.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: 'uniken123$',
                },
                img: {
                    welcome: require('../../img/ubs.png')
                },
                notification:require("../view/notificationcard").default,
                dashboard: {
                    screenName: 'homepage',
                    screen: require('../Dashboard/Ubs/homepage').default,
                }
            }
        })();
    }
    if (Config.ENV == 'cbc') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/cbc.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: 'uniken123$',
                },
                img: {
                    welcome: require('../../img/cbc.png')
                },
                bottomMenu: require("../view/cbcbottomMenu"),
                notification:require("../view/notificationcard").default,
                dashboard: {
                    screenName: 'Accounts',
                    screen: require('../Dashboard/CBC/Accounts').default,
                }
            }
        })();
    }

    if (Config.ENV == 'relidmobile') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/relidmobile.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: 'uniken123$',
                },
                img: {
                    welcome: require('../../img/rmobile.png')
                },
                notification:require("../view/notificationcard").default,
                dashboard: {
                    screenName: 'Deals',
                    screen: require('../Dashboard/REL-IDMobile/Deals').default,
                }
            }
        })();
    }
    if (Config.ENV == 'cbcverify') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/cbcverify.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: 'uniken123$',
                },
                img: {
                    welcome: require('../../img/cbc.png')
                },
                notification:require("../view/notificationcard").default,
                dashboard: {
                    screenName: 'HomePage',
                    screen: require("../Dashboard/CBCVerify/HomePage").default,
                },
            }
        })();
    }
    if (Config.ENV == 'startokenlite') {
        config = (function () {
                  return {
                  connectionProfile: require("../../../Connection_profiles/startokenlite.json"),
                  sslCertificate: {
                  data: getSSLFileContent(),
                  password: 'uniken123$',
                  },
                  img: {
                  welcome: require('../../img/startokenlite.png')
                  },
                  notification:require("../view/notificationcard").default,
                  dashboard: {
                  screenName: 'HomePage',
                  screen: require("../Dashboard/startokenlite/HomePage").default,
                  },
                  }
                  })();
    }
    if (Config.ENV == 'pnbverify') {
        config = (function () {
                  return {
                  connectionProfile: require("../../../Connection_profiles/pnbverify.json"),
                  sslCertificate: {
                  data: getSSLFileContent(),
                  password: 'uniken123$',
                  },
                  img: {
                  welcome: require('../../img/pnbverify.png')
                  },
                  notification:require("../view/notificationcard").default,
                  dashboard: {
                  screenName: 'HomePage',
                  screen: require("../Dashboard/pnbverify/HomePage").default,
                  },
                  }
                  })();
    }
    if (Config.ENV == 'chathamretail') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/chathamretail.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: 'uniken123$',
                },
                img: {
                    welcome: require('../../img/chathamretail2.png')
                },
                bottomMenu: require("../view/chathamretailBottomMenu"),
                notification:require("../view/NotificationCard/notificationcard_retail").default,
                dashboard: {
                    screenName: 'Accounts',
                    screen: require('../Dashboard/ChathamRetail/Accounts').default,
                }
            }
        })();
    }

    return config;
}


function getSSLFileContent() {
    if (Platform.OS === "ios") {
        return new Promise(function (resolve, reject) {
            RNFS.readDir(RNFS.MainBundlePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
                .then((result) => {
                    console.log('GOT RESULT', result);

                    // stat the first file
                    // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].name == 'clientcert.p12') {

                            return Promise.all([RNFS.stat(result[i].path), result[i].path])
                        }
                    }
                    resolve(null);
                })
                .then((statResult) => {
                    if (statResult[0].isFile()) {
                        // if we have a file, read it
                        return RNFS.readFile(statResult[1], 'base64');
                    }
                    resolve(null);
                    return 'no file';
                })
                .then((contents) => {
                    // log the file contents
                    resolve(contents);
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                    resolve(null);
                });
        });
    } else {
        return new Promise(function (resolve, reject) {
            RNFS.readDirAssets('cert') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
                .then((result) => {
                    console.log('GOT RESULT', result);

                    // stat the first file
                    // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].name == 'clientcert.p12') {
                            return Promise.all([result[i].path])
                        }
                    }
                    resolve(null);
                })
                .then((result) => {
                    return RNFS.readFileAssets(result[0], 'base64');
                })
                .then((contents) => {
                    // log the file contents
                    resolve(contents);
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                    resolve(null);
                });
        });
    }
}



module.exports = {
    ClientBasedConfig: requireClientBasedConfig()
}
