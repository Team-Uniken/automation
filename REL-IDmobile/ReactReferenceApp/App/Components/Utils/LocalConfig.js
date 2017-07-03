import Config from 'react-native-config';

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

module.exports = {
    ClientBasedConfig : requireClientBasedConfig()
}
