'use strict';

/*
  ALWAYS NEED
*/
import React from 'react-native';
import Skin from '../Skin';
/*
  CALLED
*/
import MainActivation from '../Components/MainActivation';
import { DeviceEventEmitter } from 'react-native';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
import erelid from '../../erelid.json';

/*
  Instantiaions
*/
let initSuc = false;
let isRunAfterInteractions = false;
let initCount = 0;
let initSuccess = 2;
let initError = 3;
let Obj;
let responseJson;
let chlngJson;
let nextChlngName;
let initErrorMsg;
let onInitCompletedListener;
let onPauseCompletedListener;
let onResumeCompletedListener;

const {
    Text,
    View,
    Animated,
    InteractionManager,
    AppState,
    AsyncStorage,
    Alert,
    Platform,
} = React;


/*
 Class Load
 */

class Load extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            r_opac_val: new Animated.Value(0),
            i_opac_val: new Animated.Value(0),
            d_opac_val: new Animated.Value(0),
            relid_text_opac: new Animated.Value(0),
            rid_top: new Animated.Value(200),
            r_text_opac: new Animated.Value(0),
            i_text_opac: new Animated.Value(0),
            d_text_opac: new Animated.Value(0),
            relid_opac_val: new Animated.Value(0),
        };
    }
    openRoute(route) {
        this.props.navigator.push(route);
    }
    componentDidMount() {

        Obj = this;

        AppState.addEventListener('change', this._handleAppStateChange);

        if(onPauseCompletedListener !== undefined){
          console.log("--------------- removing onPauseCompleted");
          onPauseCompletedListener.remove();
        }

        if(onResumeCompletedListener !== undefined){
          onResumeCompletedListener.remove();
        }

        onPauseCompletedListener = DeviceEventEmitter.addListener('onPauseCompleted', function(e) {
            console.log('On Pause Completed:');
            console.log('immediate response is' + e.response);
            responseJson = JSON.parse(e.response);
            if (responseJson.errCode == 0) {
                console.log('Pause Successfull');
            } else {
                alert('Failed to Pause with Error ' + responseJson.errCode);
            }
        });

        onResumeCompletedListener = DeviceEventEmitter.addListener('onResumeCompleted', function(e) {
            console.log('On Resume Completed:');
            console.log('immediate response is' + e.response);
            responseJson = JSON.parse(e.response);
            if (responseJson.errCode == 0) {
                console.log('Resume Successfull');
                AsyncStorage.setItem("savedContext", "");
            } else {
                AsyncStorage.setItem("savedContext", "");
                alert('Failed to Resume with Error ' + responseJson.errCode);
                alert(' Please restart application.');
            }
        });

        onInitCompletedListener = DeviceEventEmitter.addListener('onInitializeCompleted', function(e) {
            onInitCompletedListener.remove();
            console.log('On Initialize Completed:');
            console.log('immediate response is' + e.response);
            responseJson = JSON.parse(e.response);
            if (responseJson.errCode == 0) {
                initCount = initSuccess;
                chlngJson = responseJson.pArgs.response.ResponseData;
                nextChlngName = chlngJson.chlng[0].chlng_name
                Obj.onInitCompleted();
                console.log('--------- onInitializeCompleted initCount ' + initCount);
            } else {
                initCount = initError;
                initErrorMsg = ' Error code ' + responseJson.errCode + '. Please restart application.';
                console.log('--------- onInitializeCompleted initCount ' + initCount);
                Obj.onInitCompleted();
            }
        });

        AsyncStorage.getItem('ConnectionProfiles', (err, profiles) => {
            console.log('get Item, Connection Profiles:');
            profiles = JSON.parse(profiles);

            if ((profiles == null) || (profiles.length == 0)) {
                console.log("NOT FOUND !!!!!!!!, hence import connection profiles now");

                var profileArray = erelid.Profiles;
                var relidArray = erelid.RelIds;

                for (let i = 0; i < profileArray.length; i++) {
                    var RelIdName = profileArray[i].RelId;

                    for (let j = 0; j < relidArray.length; j++) {
                        if (RelIdName === relidArray[j].Name) {
                            profileArray[i].RelId = relidArray[j].RelId;

                        }
                    }
                }

                AsyncStorage.setItem('ConnectionProfiles', JSON.stringify(profileArray), () => {

                    AsyncStorage.getItem('ConnectionProfiles', (err, importedProfiles) => {
                        importedProfiles = JSON.parse(importedProfiles);

                        AsyncStorage.setItem('CurrentConnectionProfile', JSON.stringify(importedProfiles[0]), () => {
                            this.doInitialize();

                        });
                    });
                });

            } else {

                AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
                    currentProfile = JSON.parse(currentProfile);
                    if (currentProfile != null || currentProfile.length > 0) {
                        this.doInitialize();
                    } else {

                        AsyncStorage.getItem('ConnectionProfiles', (err, importedProfiles) => {
                            importedProfiles = JSON.parse(importedProfiles);

                            AsyncStorage.setItem('CurrentConnectionProfile', JSON.stringify(importedProfiles[0]), () => {
                                this.doInitialize();

                            });
                        });
                    }
                });

            }

        });

        Animated.sequence([
            Animated.parallel([
                Animated.timing(this.state.r_opac_val, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1000 * Skin.spd,
                }),
                Animated.timing(this.state.r_text_opac, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1000 * Skin.spd,
                }),
            ]),
            Animated.parallel([
                Animated.timing(this.state.r_text_opac, {
                    toValue: 0,
                    duration: 500 * Skin.spd,
                    delay: 1000 * Skin.spd,
                }),
                Animated.timing(this.state.i_opac_val, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1500 * Skin.spd,
                }),
                Animated.timing(this.state.i_text_opac, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1500 * Skin.spd,
                }),
            ]),
            Animated.parallel([
                Animated.timing(this.state.i_text_opac, {
                    toValue: 0,
                    duration: 500 * Skin.spd,
                    delay: 1000 * Skin.spd,
                }),
                Animated.timing(this.state.d_opac_val, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1500 * Skin.spd,
                }),
                Animated.timing(this.state.d_text_opac, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1500 * Skin.spd,
                }),
            ]),
            Animated.parallel([
                Animated.timing(this.state.d_text_opac, {
                    toValue: 0,
                    duration: 500 * Skin.spd,
                    delay: 1000 * Skin.spd,
                }),
                Animated.timing(this.state.relid_opac_val, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1500 * Skin.spd,
                }),
                Animated.timing(this.state.relid_text_opac, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1500 * Skin.spd,
                }),
            ]),
            Animated.parallel([
                Animated.timing(this.state.relid_text_opac, {
                    toValue: 1,
                    duration: 500 * Skin.spd,
                    delay: 1500 * Skin.spd,
                }),
            ])
        ]).start();


        InteractionManager.runAfterInteractions(() => {
            isRunAfterInteractions = true;
            Obj.onInitCompleted();
        });

    }
    _handleAppStateChange(currentAppState) {
        console.log('_handleAppStateChange');

        if (currentAppState == 'background') {
            console.log('App State Change background:');

            ReactRdna.pauseRuntime((response) => {
                if (response) {
                    if (response[0].error == 0) {
                        AsyncStorage.setItem("savedContext", response[0].response);
                    }
                    console.log('immediate response is' + response[0].error);
                } else {
                    console.log('immediate response is' + response[0].error);
                }
            })
        } else if (currentAppState == 'active') {
            console.log('App State Change active:');


            var proxySettings;
            var jsonProxySettings = JSON.stringify(proxySettings);
            AsyncStorage.getItem("savedContext").then((value) => {
                ReactRdna.resumeRuntime(value, jsonProxySettings, (response) => {
                    if (response) {
                        console.log('immediate response is' + response[0].error);
                    } else {
                        console.log('immediate response is' + response[0].error);
                    }
                })
            }).done();
        }
    }


  doInitialize() {
    initSuc = false;
    isRunAfterInteractions = false;
    initCount = 0;
    console.log('------------Initialize RDNA');
    var proxySettings; //= {'proxyHost':'127.0.0.1','proxyPort':'proxyport'};
    var jsonProxySettings = JSON.stringify(proxySettings);
    AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
      console.log('Initialize RDNA - get Item CurrentConnectionProfile:');

      currentProfile = JSON.parse(currentProfile);

      let currentAgentInfo = currentProfile.RelId;
      let currentGatewayHost = currentProfile.Host;
      var currentGatewayPort;
      if(Platform.OS === 'ios'){
        currentGatewayPort = currentProfile.Port;
      }else{
        currentGatewayPort = parseInt(currentProfile.Port);
      }

      ReactRdna.initialize(currentAgentInfo, currentGatewayHost, currentGatewayPort, ReactRdna.RdnaCipherSpecs, ReactRdna.RdnaCipherSalt, jsonProxySettings, (response) => {
          if (response) {
              console.log('immediate response is' + response[0].error);
              // alert(response[0].error);
          } else {
              console.log('immediate response is' + response[0].error);
              // alert(response[0].error);
          }
      })
    });
  }

  // doInitialize() {
  //   initSuc = false;
  //   isRunAfterInteractions = false;
  //   initCount = 0;
  //   console.log('Initialize RDNA');
  //   var proxySettings; //= {'proxyHost':'127.0.0.1','proxyPort':'proxyport'};
  //   var jsonProxySettings = JSON.stringify(proxySettings);
  //   ReactRdna.initialize(ReactRdna.agentInfo, ReactRdna.GatewayHost, ReactRdna.GatewayPort, ReactRdna.RdnaCipherSpecs, ReactRdna.RdnaCipherSalt, jsonProxySettings, (response) => {
  //                        if (response) {
  //                        console.log('immediate response is' + response[0].error);
  //                        // alert(response[0].error);
  //                        } else {
  //                        console.log('immediate response is' + response[0].error);
  //                        // alert(response[0].error);
  //                        }
  //                        })
  // }


  onInitCompleted() {
    console.log('--------- onInitCompleted initCount ' + initCount + ' isRunAfterInteractions ' + isRunAfterInteractions);
    if (isRunAfterInteractions) {
      if (initCount === initSuccess) {
        Obj.doNavigation();
      } else if (initCount === initError) {
        Alert.alert(
                    'Error',
                    initErrorMsg,
                    [
                      {text: 'CANCEL',onPress: () => console.log('CHANGE Pressed'), style: 'cancel'},
                      {text: 'CHANGE', onPress: () => this.props.navigator.push({id: "ConnectionProfile"})},
                    ]
                  )
              }
    }
  }

  doNavigation() {
    console.log('doNavigation:');
    this.props.navigator.push({ id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
  }

  render() {
    return (
      <MainActivation navigator={this.props.navigator}>
        <Animated.View style={[Skin.loadStyle.rid_wrap, { top: this.state.rid_top }]}>
          <View style={Skin.loadStyle.rid_center}>
            <Animated.Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_r, { opacity: this.state.r_opac_val }]}>g
            </Animated.Text>
            <Animated.Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_i, { opacity: this.state.i_opac_val }]}>h
            </Animated.Text>
            <Animated.Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_d, { opacity: this.state.d_opac_val }]}>i
            </Animated.Text>
          </View>
        </Animated.View>
        <View style={Skin.loadStyle.relid_wrap}>
          <Animated.Text style={[Skin.loadStyle.relid, { opacity: this.state.relid_opac_val }]}>W
          </Animated.Text>
        </View>
        <View style={Skin.loadStyle.text_wrap}>
            <View style={Skin.loadStyle.text_center}>
              <Animated.Text style={[Skin.loadStyle.text, { opacity: this.state.r_text_opac }]}>
                Initializing Authentication
              </Animated.Text>
              <Animated.Text style={[Skin.loadStyle.text, { opacity: this.state.i_text_opac }]}>
                Authenticating Device
              </Animated.Text>
              <Animated.Text style={[Skin.loadStyle.text, { opacity: this.state.d_text_opac }]}>
                Securing Connection
              </Animated.Text>
              <Animated.Text style={[Skin.loadStyle.text, { opacity: this.state.relid_text_opac }]}>
                Secure Access Established
              </Animated.Text>
            </View>
        </View>
      </MainActivation>
    );
  }
}


module.exports = Load;