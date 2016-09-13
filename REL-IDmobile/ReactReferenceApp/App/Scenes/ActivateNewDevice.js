'use strict';
/*
  NEED
 */
import React from 'react-native';
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
// const ReactRdna = React.NativeModules.ReactRdnaModule;
//const RDNARequestUtility = React.NativeModules.RDNARequestUtility;
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;




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
} = React;

class ActivateNewDeviceScene extends React.Component{
  constructor(props){
  super(props);
  this.state = {
  username:'',
  accCode:'-----',
  accValue:'-----',
  expiryMsg:'Your access code expires on ',
  isLoading:false
  };
  }
  componentDidMount(){
  this.setState({ isLoading: true });
  AsyncStorage.getItem("userId").then((value) => {
                    AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
                    currentProfile = JSON.parse(currentProfile);
                    //var baseUrl = "http://" + currentProfile.Host + ":8080" + "/GM/generateOTP.htm?userId=";
                               
                   var baseUrl = "http://" + currentProfile.Host + ":9080" + "/WSH/rest/generateOTP.htm";

                  //  var url = baseUrl.concat(value);
                    // fetch(url, {
                    //     method: 'POST',
                    //     })
                    // .then((response) => response.text())
                    // .then((responseText) => {
                    //     console.log(responseText);
                    //     var res = JSON.parse(responseText);
                    //     this.state.accCode =res.otpId;
                    //     this.state.accValue=res.otpValue;
                    //     var Msg=res.expiryTs;
                    //     this.state.expiryMsg = 'Your access code expires on '.concat(Msg);
                    //     this.setState({ isLoading:false});
                    //     })
                    // .catch((error) => {
                    //      console.warn(error);
                    //      this.state.expiryMsg="Failed to generate access code. Please try again";
                    //      this.setState({ isLoading:false});
                    //      });




    var userMap = {"userId":value};
   RDNARequestUtility.doHTTPPostRequest(baseUrl, userMap, (response) => {
                                           console.log(response);
                                           if(response[0].error==0){
                                           var res = JSON.parse(response[0].response);
                                           this.state.accCode =res.otpId;
                                           this.state.accValue=res.otpValue;
                                           var Msg=res.expiryTs;
                                           this.state.expiryMsg = 'Your access code expires on '.concat(Msg);
                                           this.setState({ isLoading:false});
                                           }else{
                                                alert('Error');
                                           }
                                       
                                              })

                    }).done();
                    });
  }
  render() {
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
  }
};
module.exports = ActivateNewDeviceScene;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Skin.colors.TEXT_COLOR,
    color: 'black',
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


/*
    <View style={styles.Container}>
      <View style={styles.navbar}>
      <TouchableHighlight
      style={[styles.navButton]}
      underlayColor={'#FFFFFF'}
      activeOpacity={0.6}
      >
      <View></View>
      </TouchableHighlight>
      <Text style={styles.navTitle}>{"Activate New Device"}</Text>
      <TouchableHighlight
      style={[styles.navButton]}
      onPress={()=>{
      this.props.navigator.pop();
      }}
      underlayColor={'#FFFFFF'}
      activeOpacity={0.6}
      >
      <Text
      style={[{textAlign: 'right',fontSize:22}]}
      >X</Text>
      </TouchableHighlight>
      </View>
      <View style={{borderColor:"#D0D0D0",borderStyle:'solid',borderWidth:0.5,width:SCREEN_WIDTH}}></View>
       <ScrollView >
        <Text style={styles.GenerateAccessCodeText}>Activate your new device using the below access code and access value</Text>
        <Text style={styles.div}> </Text>
        <Text style={styles.AccessCodeValueStyle}>{this.state.accCode}</Text>
        <Text style={styles.AccessCodeTextStyle}> Access Code</Text>
        <Text style={styles.div}> </Text>
        <Text style={styles.AccessCodeValueStyle}>{this.state.accValue}</Text>
        <Text style={styles.AccessCodeTextStyle}> Access Value</Text>
        <Text style={styles.div}> </Text>
        <Text style={styles.AccessCodeTextStyle}> {this.state.expiryMsg}</Text>
      </ScrollView >
    </View>
*/
