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

    return config;
}

module.exports = {
    ClientBasedConfig : requireClientBasedConfig()
}
