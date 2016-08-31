
/*
  ALWAYS NEED
*/
'use strict';

import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/

import dismissKeyboard from 'react-native-dismiss-keyboard';
import Loader from './Loader';
import Events from 'react-native-simple-events';
/* 
  INSTANCES
*/
const {
  StatusBar,
  View,
  Image,
  Text,
  Platform,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,

} = React;

let obj;
class MainActivation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    ColorProp:'rgba(255,255,255,1)',
    color:'#4fadd8',
    visible: this.props.visible
    };
    console.log('\nMain Activation in constructor');
    console.log(this.state.visible);
  }

  dismiss() {
    dismissKeyboard();
  }
  
  componentDidMount() {
    obj=this;
    Events.on('hideLoader', 'hideLoader', this.hideLoader);
    Events.on('showLoader', 'showLoader', this.showLoader);
  }
  
  hideLoader(args){
  console.log('\n in hideLoader of main activation');
  obj.hideLoaderView();
  }
  
  showLoader(args){
    console.log('\n in hideLoader of main activation');
    obj.showLoaderView();
  }
  
  hideLoaderView(){
  console.log('\n in hide Loader view of main activation');
  this.setState({visible: false});
    console.log(this.state.visible);
  }
  showLoaderView(){
    console.log('\n in show Loader view of main activation');
    this.setState({visible: true});
    console.log(this.state.visible);
  }
  

  render() {
    console.log('\n\n\n  Main Activation render called again');
//    this.state.visible = this.props.visible;
    if(Platform.OS == "android"){
      return (
              <View style={Skin.activationStyle.container}>
                <StatusBar
                  backgroundColor={Skin.colors.DARK_PRIMARY}
                  barStyle={'light-content'}
                />
                <View style={Skin.activationStyle.bgbase} />
                <Image style={Skin.activationStyle.bgimage} source={require('image!bg')} />
              
                <View style={Skin.activationStyle.bgcolorizer} />
                <View style={Skin.activationStyle.centering_wrap}>
                  <View style={Skin.activationStyle.wrap}>
                    {this.props.children}
                  </View>
                </View>
                <TouchableHighlight
                  activeOpacity={1.0}
                  style={{
                    backgroundColor: 'white',
                    height: 50,
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: 20,
                  }}
                  underlayColor={Skin.colors.DARK_PRIMARY}
                  onPress={() => this.props.navigator.push({ id: 'ConnectionProfile' })}
                >
                  <View>
                    <Text
                      style={{
                        color: Skin.colors.DARK_PRIMARY,
                        fontSize: 30,
                      }}
                    >
                    {Skin.icon.settings}
                    </Text>
               <Loader visible={this.state.visible}/>
                  </View>
                </TouchableHighlight>
              </View>
          );
    }else if(Platform.OS == "ios"){
        return (
          <TouchableWithoutFeedback onPress={this.dismiss}>
            <View style={Skin.activationStyle.container}>
              <StatusBar
                backgroundColor={Skin.colors.DARK_PRIMARY}
                barStyle={'light-content'}
              />
              <View style={Skin.activationStyle.bgbase} />
              <Image style={Skin.activationStyle.bgimage} source={require('image!bg')} />
              <View style={Skin.statusBarStyle.default}>
                <StatusBar
                  barStyle="light-content"
                />
              </View>
              <View style={Skin.activationStyle.bgcolorizer} />
              <View style={Skin.activationStyle.centering_wrap}>
                <View style={Skin.activationStyle.wrap}>
                  {this.props.children}
                </View>
              </View>
              <TouchableHighlight
                activeOpacity={1.0}
                style={{
                  backgroundColor: 'white',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopRightRadius: 20,
                }}
                underlayColor={Skin.colors.DARK_PRIMARY}
                onPress={() => this.props.navigator.push({ id: 'ConnectionProfile' })}
              >
                <View>
                  <Text
                    style={{
                      color: Skin.colors.DARK_PRIMARY,
                      fontSize: 30,
                    }}
                  >
                  {Skin.icon.settings}
                  </Text>
                </View>
              </TouchableHighlight>
                <Loader visible={this.state.visible}/>
            </View>
          </TouchableWithoutFeedback>
        );
    }
  }
}

module.exports = MainActivation;
