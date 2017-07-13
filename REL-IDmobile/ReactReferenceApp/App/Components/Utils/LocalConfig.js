import Config from 'react-native-config';
var RNFS = require('react-native-fs');
var sslCertificateFile = null;
function requireClientBasedConfig() {
    var config = null;
  
  
  

  
    if (Config.ENV == 'sandp') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/snp.json"),
                img: {
                    welcome: require('../../img/sandp.png')
                },
                dashboard: require('../Dashboard/SandP/homepage').default
            }
        })();
    } 
    if (Config.ENV == 'nwd') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/nwd.json"),
                img: {
                    welcome: require('../../img/nwd.png')
                },
                bottomMenu: require("../view/bottomMenu"),
                dashboard: require('../Dashboard/NWD/Deals').default
            }
        })();
    }
    if (Config.ENV == 'stock') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/stock.json"),
                img: {
                    welcome: require('../../img/stock.png')
                },
                dashboard: require('../Dashboard/Stock/Deals').default
            }
        })();
    } 
    if (Config.ENV == 'ubs') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/ubs.json"),
                img: {
                    welcome: require('../../img/ubs.png')
                },
                dashboard: require('../Dashboard/Ubs/homepage').default
            }
        })();
    }
    if (Config.ENV == 'cbc') {
        config = (function () {
            return {
                connectionProfile:require("../../../Connection_profiles/cbc.json"),
                  sslCertificate:{
                  data:getSSLFileContent(),
                  password:'uniken123$',
                  },
                img: {
                    welcome: require('../../img/cbc.png')
                },
                bottomMenu: require("../view/cbcbottomMenu"),
                dashboard: require('../Dashboard/CBC/Accounts').default
            }
        })();
    }
    if (Config.ENV == 'relidmobile') {
        config = (function () {
            return {
                connectionProfile: require("../../../Connection_profiles/relidmobile.json"),
                img: {
                    welcome: require('../../img/rmobile.png')
                },
                dashboard: require('../Dashboard/REL-IDMobile/Deals').default
            }
        })();
    }

    return config;
}


 function getSSLFileContent(){
  
  return new Promise(function (resolve, reject) {
  RNFS.readDir(RNFS.MainBundlePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
        console.log('GOT RESULT', result);
        
        // stat the first file
       // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
         for (let i = 0; i < result.length; i++) {
        if(result[i].name == 'clientcert.p12'){
        
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
}

module.exports = {
    ClientBasedConfig : requireClientBasedConfig()
}
