
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import LoginTypeButton from '../view/logintypebutton';


const {Text, View, } = ReactNative;
const {Component} = React;



class Second extends Component {
  password() {
    this.props.navigator.push({
      id: "Machine",
      title: "nextChlngName",
      url: {
        "chlngJson": this.props.url.chlngJson,
        "screenId": this.props.url.screenId
      }
    });
  }
  touch() {
    alert("todo");
  }
  wechat() {
    alert("todo");
  }
  render() {
    return (
      <View style={Skin.layout0.wrap.container}>
        <View style={Skin.layout0.top.container}>
          <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
            {Skin.icon.logo}
          </Text>
          <Text style={Skin.layout0.top.subtitle}>
            {Skin.text['0']['2'].subtitle}
          </Text>
          <Text style={Skin.layout0.top.prompt}>
            {Skin.text['0']['2'].prompt}
          </Text>
        </View>
        <View style={Skin.layout0.bottom.container}>
          <View style={Skin.layout0.bottom.loginbutton.wrap}>
            <LoginTypeButton
              label={Skin.icon.touchid}
              onPress={this.touch.bind(this)}
              text="TouchId" />
            <LoginTypeButton
              label={Skin.icon.password}
              onPress={this.password.bind(this)}
              text="Password" />
            <LoginTypeButton
              label={Skin.icon.wechat}
              onPress={this.wechat.bind(this)}
              text="WeChat" />
          </View>
        </View>
      </View>
      );
  }
}

module.exports = Second;
