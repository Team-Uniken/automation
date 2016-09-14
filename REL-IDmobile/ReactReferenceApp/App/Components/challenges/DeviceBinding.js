'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import MainActivation from '../MainActivation';
import Events from 'react-native-simple-events';

let check = true;
let responseJson;
const {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  AsyncStorage,
} = React;


export default class DeviceBinding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opa: new Animated.Value(0),
      type: 'Permanent',
      icon: Skin.icon.permanent,
    };
    /*
    this._props = {
      url: {
        chlngJson: {
          chlng_idx: 3,
          sub_challenge_index: 0,
          chlng_name: 'devbind',
          chlng_type: 1,
          challengeOperation: 1,
          chlng_prompt: [[]],
          chlng_info: [{
            key: 'Response label',
            value: 'Dev Bind',
          }, {
            key: 'description',
            value: 'Select to make device permanent.',
          }],
          chlng_resp: [{
            challenge: 'devbind',
            response: '',
          }],
          challenge_response_policy: [],
          chlng_response_validation: false,
          attempts_left: 3,
        },
        chlngsCount: 4,
        currentIndex: 3,
      },
    };
    */
  }
  
  componentDidMount() {
//    obj = this;
    
    
//     AsyncStorage.getItem("passwd").then((value) => {
//                                         if(value){
//                                         if(value == "empty"){
                                        
//                                         }else{
//                                             check = true;
//                                             this.setDeviceBinding();
//                                             }
//                                         }
//                                         }).done();
//    check = true;
//    this.setDeviceBinding();
  }

  setDeviceBinding() {
    let flag;
    if (check) {
      flag = 'true';
    } else {
      flag = 'false';
    }

    responseJson = this.props.url.chlngJson;
    responseJson.chlng_resp[0].response = flag;
    Events.trigger('showNextChallenge', { response: responseJson });
  }

  check() {
    if (check === false) {
      check = true;
      this.setState({ type: 'Permanent' });
      this.setState({ icon: Skin.icon.permanent });
      Animated.sequence([
        Animated.timing(this.state.opa, {
          toValue: 1,
          duration: 100 * 0.8,
          delay: 100 * 0.8,
        }),
      ]).start();
    } else {
      check = false;
      this.setState({ type: 'Temporary' });
      this.setState({ icon: Skin.icon.temporary });
      Animated.sequence([
        Animated.timing(this.state.opa, {
          toValue: 0,
          duration: 100 * 0.8,
          delay: 100 * 0.8,
        }),
      ]).start();
    }
  }

  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }

  render() {
    console.log(JSON.stringify(this.props.url));
    return (
            <MainActivation navigator={this.props.navigator}>
        <View style={{marginTop:38}}>
          <Text style={Skin.activationStyle.counter}>
            {this.props.url.currentIndex}/{this.props.url.chlngsCount}
          </Text>
          <Text style={Skin.activationStyle.title}>Remember Device</Text>
          <Text style={Skin.activationStyle.info}>
            Tap icon to change your setting:
          </Text>
        </View>

        <Animated.View style={styles.animWrap}>
          <TouchableHighlight
            style={styles.touch}
            onPress={this.check.bind(this)}
            underlayColor={'transparent'}
          >
            <Text style={styles.icon}>{this.state.icon}</Text>
          </TouchableHighlight>
        </Animated.View>
        <Text style={styles.type}>{this.state.type}</Text>
        <View style={Skin.activationStyle.input_wrap}>
          <TouchableOpacity
            style={Skin.activationStyle.button}
            onPress={this.setDeviceBinding.bind(this)}
            activeOpacity={0.8}
            underlayColor={Skin.login.BUTTON_UNDERLAY}
          >
            <Text style={Skin.activationStyle.buttontext}>
              {this.btnText()}
            </Text>
          </TouchableOpacity>
        </View>
      </MainActivation>
    );
  }
}
/*

        <Animated.View style={[Skin.customeStyle.wrap, { opacity: 1 }]}>
          <TouchableHighlight
            underlayColor={'transparent'}
          >
            <Image source={require('image!uncheck')} style={Skin.customeStyle.images} />
          </TouchableHighlight>
        </Animated.View>
        <Animated.View style={[Skin.customeStyle.wrap,{opacity: this.state.opa}]}>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={this.check.bind(this)}
          >
            <Image source={require('image!check')} style={Skin.customeStyle.images} />
          </TouchableHighlight>
        </Animated.View>
        <Text style={Skin.customeStyle.text2}>{this.state.type}</Text>
        <TouchableHighlight
          style={[Skin.customeStyle.roundcornerbutton]}
          onPress={this.setDeviceBinding.bind(this)}
          underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
          activeOpacity={0.6}
        >
          <Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
        </TouchableHighlight>
 */
module.exports = DeviceBinding;

const styles = StyleSheet.create({
  animWrap: {

  },
  touch: {
    backgroundColor:'transparent',
  },
  icon: {
    fontFamily: Skin.font.ICON_FONT,
    textAlign: 'center',
    fontSize: 200,
    color: Skin.DEV_BIND_ICON_TEXT_COLOR_RGB,
  },
  type: {
    fontSize:30,
    color: Skin.DEV_BIND_TYPE_TEXT_COLOR_RGB,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
