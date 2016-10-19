
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
  bg : {
    height: Skin.SCREEN_HEIGHT,
    width: Skin.SCREEN_WIDTH,
  },
  container: {
    flex: 1,
    alignItems:'center',
  },
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
    width: Skin.SCREEN_WIDTH,
      textAlign: 'center',
    color:'#000',
    fontSize:16,
  },
   hint:{
    width: Skin.SCREEN_WIDTH,
      textAlign: 'center',
    color:'#dbdbdb',
    fontSize:16,
    marginBottom:32,
  },
   regtype:{
      textAlign: 'center',
    color:'#000',
    fontSize:16,
    marginBottom:32,
  }

});




class Second extends Component {



  render() {
    return (  
        <View style={styles.container}>
      <Text style={styles.icon}>N</Text>
      <Text style={styles.textstyle}>Welcome to New World CLUB</Text>
       <Text style={styles.hint}>Select a login</Text>
       <View style={Skin.nwd.row}> 
       <View style={Skin.nwd.col}> 
        <TouchableOpacity
                style={Skin.nwd.regtypebutton}
                underlayColor={'#082340'}
                activeOpacity={0.8}
                >
                <Text style={Skin.nwd.regtypebuttontext}>
                T
                </Text>
                </TouchableOpacity>
                <Text style={styles.regtype}>TouchId</Text>
       </View>
       <View style={Skin.nwd.col}> 
     <TouchableOpacity
                style={Skin.nwd.regtypebutton}
                underlayColor={'#082340'}
                activeOpacity={0.8}
                >
                <Text style={Skin.nwd.regtypebuttontext}>
                P
                </Text>
                </TouchableOpacity>
                <Text style={styles.regtype}>Password</Text>
       </View>

 <View style={Skin.nwd.col}> 
                 <TouchableOpacity
                style={Skin.nwd.regtypebutton}
                underlayColor={'#082340'}
                activeOpacity={0.8}
                >
                <Text style={Skin.nwd.regtypebuttontext}>
                W
                </Text>
                </TouchableOpacity>
                <Text style={styles.regtype}>WeChat</Text>
       </View>

 </View>
     </View>
            );
  }




}

module.exports = Second;