
import React, {
  Component
} from 'react';
import ReactNative, {
  View,
  Text,
} from 'react-native'

import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import Button from '../view/button';


const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const MAX_WIDTH = 300;
const MAX_HEIGHT = 600;
const VIEW_WIDTH = SCREEN_WIDTH - 50;
const SCREEN_HEIGHT_RATIO = 1;
if (SCREEN_HEIGHT <= 426) {
  SCREEN_HEIGHT_RATIO = 0.5
} else if (SCREEN_HEIGHT <= 470) {
  SCREEN_HEIGHT_RATIO = 1
} else if (SCREEN_HEIGHT < 640) {
  SCREEN_HEIGHT_RATIO = 1.5
} else {
  SCREEN_HEIGHT_RATIO = 2
}

/*
Skin.layout0 = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    borderRadius: 8,
  },
  scrollcontainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 32,
    width: SCREEN_WIDTH,
    marginTop: 16,
  },
  headertext: {
    width: SCREEN_WIDTH,
    textAlign: 'center',
    color: '#000',
    fontSize: 20,
  },
  topicon: {
    marginTop: (SCREEN_HEIGHT - 100) / 8,
    width: SCREEN_WIDTH,
    color: '#f00',
    textAlign: 'center',
    fontSize: 100,
    height: 100,
  },
  welcometextstyle: {
    marginTop: 16,
    width: VIEW_WIDTH,
    textAlign: 'center',
    color: '#000',
    fontSize: 20,
  },
  regtype: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    marginBottom: 32,
  },
  hint: {
    width: SCREEN_WIDTH,
    textAlign: 'center',
    color: '#dbdbdb',
    fontSize: 16,
    marginBottom: 32,
  },
  button: {
    alignItems: 'center',
    height: 48,
    width: VIEW_WIDTH,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: '#f00',
  },
  buttontext: {
    paddingTop: 12,
    paddingBottom: 12,
    height: 48,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  regtypebutton: {
    alignItems: 'center',
    height: 70,
    width: 70,
    borderRadius: 8,
    margin: 8,
    marginBottom: 4,
    backgroundColor: '#f00',
  },
  regtypebuttontext: {
    height: 70,
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: VIEW_WIDTH,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  col: {
    flexDirection: 'column',
  },
  textinput: {
    fontSize: 16,
    height: 48,
    width: VIEW_WIDTH,
    color: '#000',
    marginBottom: 12,
    backgroundColor: '#ebebeb',
    paddingLeft: 8,
  },
  check_text_condition: {
    fontSize: 16,
    color: '#f00',
    opacity: 1,
    height: 24,
    textAlign: 'left',
    textDecorationLine: 'underline',
    textAlignVertical: 'center',
  },
  check_text: {
    fontSize: 20,
    color: '#000',
    opacity: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  note: {
    fontSize: 14,
    color: '#f00',
    opacity: 1,
    width: VIEW_WIDTH,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
});
*/

class First extends Component {
  selectReg() {
    console.log('doNavigation:');
    //    this.props.navigator.push({ id: "selectlogin",title: "nextChlngName", url: { "chlngJson": this.props.url.chlngJson, "screenId": this.props.url.screenId}});
    this.props.navigator.push({
      id: "Machine",
      title: "nextChlngName",
      url: {
        "chlngJson": this.props.url.chlngJson,
        "screenId": this.props.url.screenId
      }
    });
  }

  register() {
    console.log('doNavigation:');
    this.props.navigator.push({ id: "register" });
  }

  render() {
    return (
      <View style={Skin.layout0.wrap.container}>
        <View style={Skin.layout0.top.container}>
          <Text style={Skin.layout0.top.icon}>
            {Skin.icon.logo}
          </Text>
          <Text style={Skin.layout0.top.subtitle}>
            Welcome to New World CLUB
          </Text>
          <Text style={Skin.layout0.top.prompt}>
            Select one of the options
          </Text>
        </View>
        <View style={Skin.layout0.bottom.container}>
          <Button
            label="I need to register"
            onPress={this.register.bind(this)} />
          <Button
            label="I'm already a member2"
            onPress={this.selectReg.bind(this)} />
        </View>
      </View>
    );
    //,Skin.layout0.topContainer
  }
  /*
  <Button
              label="I need to register"
              onPress={this.register.bind(this)} />
  */

}

module.exports = First;
