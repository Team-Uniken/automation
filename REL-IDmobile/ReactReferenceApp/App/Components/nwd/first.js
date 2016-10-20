
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
} = ReactNative;
const{Component} =  React;

var styles = StyleSheet.create({
  icon:{
    marginTop:(Skin.SCREEN_HEIGHT-100)/8,
    width: Skin.SCREEN_WIDTH,
    color:'#f00',
      textAlign: 'center',
    fontSize: 100,
    height: 100,
  },
   textstyle:{
    marginTop:32,
    marginBottom:32,
    width: Skin.SCREEN_WIDTH,
      textAlign: 'center',
    color:'#000',
    fontSize:16,
    height:48,
  }
});




class First extends Component {
  selectReg() {
    console.log('doNavigation:');
    this.props.navigator.push({ id: "second"});
  }
  
 register() {
    console.log('doNavigation:');
    this.props.navigator.push({ id: "register"});
  }
  

  render() {
    return (  
        <View style={Skin.nwd.container}>
      <Text style={styles.icon}>N</Text>
      <Text style={styles.textstyle}>Welcome to New World CLUB</Text>
       <TouchableOpacity
                style={Skin.nwd.button}
                underlayColor={'#082340'}
                activeOpacity={0.8}
                onPress={this.register.bind(this)}

                >
                <Text style={Skin.nwd.buttontext}>
                I need to register
                </Text>
                </TouchableOpacity>
     <TouchableOpacity
                style={Skin.nwd.button}
                underlayColor={'#082340'}
                activeOpacity={0.8}
                onPress={this.selectReg.bind(this)}

                >
                <Text style={Skin.nwd.buttontext}>
                 I'm already a member
                </Text>
                </TouchableOpacity>

     </View>
            );
  }




}

module.exports = First;