'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import { KeyboardAwareScrollView } from 'react-native-smart-scroll-view';

var ToolBar = require('../ToolBar');
var Password = require('./Password');
var Events = require('react-native-simple-events');


var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StatusBar,
	StyleSheet,
  Dimensions,
	ScrollView,
	StatusBar,
} = React;


class DevName extends React.Component{
	btnText(){
		console.log('------ devname ' + this.props.url.chlngJson.chlng_idx+  this.props.url.chlngsCount );

		if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
			return "Submit";
		}else{
			return "Continue";
		}}

  constructor(props){
    super(props);
    this.state = {
      deviceName : ''

    };
  }

  componentDidMount(){
//    this.state.deviceName = this.props.url.chlngJson.chlng_resp[0].response;
    this.setState({deviceName: this.props.url.chlngJson.chlng_resp[0].response});
  }

  setDeviceName(){
    var dName = this.state.deviceName;

    if(dName.length>0){
          responseJson = this.props.url.chlngJson;
          responseJson.chlng_resp[0].response = dName;
          Events.trigger('showNextChallenge', {response: responseJson});
    }
    else{
      alert('Please enter Device Name ');
    }
  }

  onDeviceNameChange(event){
    this.setState({deviceName: event.nativeEvent.text});
  }
  onDeviceNameChangeText(event){
  this.setState({deviceName: event.nativeEvent.text});
  }

	render() {
		return (
			<View style={Skin.customeStyle.maincontainer}>
						<StatusBar  backgroundColor={Skin.colors.STATUS_BAR_COLOR} barStyle='light-content'/>
						<ToolBar navigator={this.props.navigator} title="Login"/>
						<ScrollView >
						<Text style={Skin.customeStyle.text2}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
						<Text style={Skin.customeStyle.note}>Please give a name for this device</Text>
						<Text style={Skin.customeStyle.div}> </Text>

						<View
					       style={[Skin.customeStyle.roundcornerinput]}
					        activeOpacity={0.6}
					       >
								 <KeyboardAwareScrollView>

					       <TextInput
					         autoCorrect={false}
					         placeholder={'Enter name of the device'}
					         placeholderTextColor={'#8F8F8F'}
					         style={Skin.customeStyle.input}
									 ref='deviceName'
									 value={this.state.deviceName}
									 onChange={this.onDeviceNameChange.bind(this)}
					       />
								 </KeyboardAwareScrollView>

					       </View>

      <Text style={Skin.customeStyle.div}> </Text>

			<TouchableHighlight
			onPress={this.setDeviceName.bind(this)}
       style={[Skin.customeStyle.roundcornerbutton]}
			 underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
      	 activeOpacity={0.6}>
       			<Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
       </TouchableHighlight>
			 </ScrollView >
		</View>
		);
	}
};

module.exports = DevName;
