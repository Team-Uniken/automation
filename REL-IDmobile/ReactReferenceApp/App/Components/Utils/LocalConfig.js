import Config from 'react-native-config';
var RNFS = require('react-native-fs');
import { Platform } from 'react-native';
var sslCertificateFile = null;

function requireClientBasedConfig() {
    var config = null;

    if (Config.ENV == 'cbc') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/cbc.json"),
                sslCertificate: {
                    data: getSSLFileContent(),
                    password: '',
                },
                img: {
                    welcome: require('../../img/cbc.png')
                },
                bottomMenu: require("../view/cbcbottomMenu"),
                dashboard: {
                    screenName: 'Accounts',
                    screen: require('../Dashboard/CBC/Accounts').default,
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
