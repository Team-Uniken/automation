'use strict';
/*
  NEED
 */
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Main';
import ListItem from '../Components/ListItem';
import ListSectionHeader from '../Components/ListSectionHeader';
import { FormattedCurrency } from 'react-native-globalize';

/*
  Instantiaions
*/

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;


var QRCode = require('react-native-qrcode');

var Dimensions = require('Dimensions');
var CORE_FONT = 'Century Gothic';
var MID_COL = '#2579A2';
var TEXT_COLOR = '#FFFFFF';
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;
var {
  View,
  Text,
  Navigator,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  ScrollView,
  AsyncStorage,
} = ReactNative;

const{Component}=React;

class ActivateNewDeviceScene extends Component{
  constructor(props){
  super(props);
  this.state = {
  username:'',
  accCode:'-----',
  accValue:'-----',
  expiryMsg:'Your access code expires on ',
  isLoading:false,
  QRtext: 'appa'
  };
  }

  componentDidMount(){
  this.setState({ isLoading: true });
  AsyncStorage.getItem("userId").then((value) => {
                    AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
                    currentProfile = JSON.parse(currentProfile);
                   var baseUrl = "http://" + currentProfile.Host + ":9080" + "/WSH/rest/generateOTP.htm";

    var userMap = {"userId":value};
   RDNARequestUtility.doHTTPPostRequest(baseUrl, userMap, (response) => {
                                           console.log(response);
                                           if(response[0].error==0){
                                           var res = JSON.parse(response[0].response);
                                           this.state.accCode =res.otpId;
                                           this.state.accValue=res.otpValue;
                                           var Msg=res.expiryTs;
                                        var QRJson = {'Access_Code':res.otpId,'Access_Value':res.otpValue,'Expiry':res.expiryTs}
                                        var QRcontextString = JSON.stringify(QRJson);
                                           this.state.expiryMsg = 'Your access code expires on '.concat(Msg);
                                        this.setState({ isLoading:false, QRtext:QRcontextString});
                                           }else{
                                                alert('Error');
                                           }
                                       
                                              })

                    }).done();
                    });
  }
  render() {
    
  var QRTextStr = this.state.QRtext;
  var length = QRTextStr.length;
  if(length===0){
  return (
    <Main
    drawerState={{
      open: false,
      disabled: true,
    }}
    navBar={{
      title: 'Activate New Device',
      visible: true,
      tint: Skin.colors.TEXT_COLOR,
      left: {
      text: 'Back',
      icon: 'x',
      iconStyle: {},
      textStyle: {},
      handler: () => {this.props.navigator.pop();},
      },
    }}
    bottomMenu={{
      visible: false,
    }}
    navigator={this.props.navigator}
    >
      <View style={styles.container}>
    <Text style={styles.headline}>Activate a new device using Verification Code and Access Code below.</Text>
    <Text style={styles.codeTitle}> Verification Code:</Text>
    <Text style={styles.codeValue}>{this.state.accCode}</Text>
    <Text style={styles.codeTitle}> Access Code:</Text>
    <Text style={styles.codeValue}>{this.state.accValue}</Text>
    <Text style={styles.footer}> {this.state.expiryMsg}</Text>
      
    </View>

    </Main>
          );
    }else{
    return (
            <Main
            drawerState={{
            open: false,
            disabled: true,
            }}
            navBar={{
            title: 'Activate New Device',
            visible: true,
            tint: Skin.colors.TEXT_COLOR,
            left: {
            text: 'Back',
            icon: 'x',
            iconStyle: {},
            textStyle: {},
            handler: () => {this.props.navigator.pop();},
            },
            }}
            bottomMenu={{
            visible: false,
            }}
            navigator={this.props.navigator}
            >
            <View style={styles.container}>
            <Text style={styles.headline}>Activate a new device using Verification Code and Access Code below.</Text>
            <Text style={styles.codeTitle}> Verification Code:</Text>
            <Text style={styles.codeValue}>{this.state.accCode}</Text>
            <Text style={styles.codeTitle}> Access Code:</Text>
            <Text style={styles.codeValue}>{this.state.accValue}</Text>
            <Text style={styles.footer}> {this.state.expiryMsg}</Text>
            <View style={styles.QRConatiner}>
            <QRCode
            value={this.state.QRtext}
            size={150}
            bgColor='purple'
            fgColor='white'
            />
            </View>
            </View>
            
            </Main>
            );
  
  }
  }
};
module.exports = ActivateNewDeviceScene;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Skin.colors.TEXT_COLOR,
    color: 'black',
  },
 QRConatiner:{
  backgroundColor: Skin.colors.TEXT_COLOR,
  alignItems: 'center',
 },
  headline: {
    textAlign: 'center',
    padding: 15,
    paddingTop: 30,
    color: Skin.colors.PRIMARY_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
  codeTitle: {
    textAlign: "center",
    padding: 5,
    paddingTop: 20,
    color: Skin.colors.PRIMARY_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 17,
  },
  codeValue: {
    textAlign: "center",
    color: Skin.colors.PRIMARY_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    backgroundColor: Skin.colors.BACK_GRAY,
    paddingVertical: 20,
    fontWeight: 'bold',
  },
  footer:{
    textAlign: 'center',
    padding: 15,
    paddingTop: 30,
    color: Skin.colors.PRIMARY_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
  }
});
