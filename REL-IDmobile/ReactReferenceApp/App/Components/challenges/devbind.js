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

var check=false;
var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StyleSheet,
  Dimensions,
	ScrollView,
	Image,
	Animated,
	StatusBar,
} = React;

class DeviceBinding extends React.Component{
	btnText(){
		if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
			return "Submit";
		}else{
			return "Continue";
		}}
	constructor(props){
		super(props);
		//var testClass = new Machine();
		//testClass.dummyFunc();
		this.state = {
			opa: new Animated.Value(0),
			type: 'Temporary',
		};
	}
	check(){
		if(check==false){
			check=true;
      this.setState({type: 'Parmanent'});
			type='Parmanent';
			Animated.sequence([
				Animated.timing(this.state.opa, {
					toValue: 1,
					duration: 100 * 0.8,
					delay: 100 * 0.8
					}
				),
			]).start();
		}else{
			check=false;
      this.setState({type: 'Temporary'});
			type='Temporary';

			Animated.sequence([
				Animated.timing(this.state.opa, {
					toValue: 0,
					duration: 100 * 0.8,
					delay: 100 * 0.8
					}
				),
			]).start();
		}



	  }
  setDeviceBinding(){
      var dBind = this.state.type;
      var flag;
      if(check)
      	flag = "true";
      else
      	flag = "false";

      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = flag;
      Events.trigger('showNextChallenge', {response: responseJson});
  }

	render() {
		return (
			<View style={Skin.customeStyle.maincontainer}>
		         <StatusBar
						 backgroundColor={Skin.colors.STATUS_BAR_COLOR}
		         barStyle='light-content'
		         />
						 			<ToolBar navigator={this.props.navigator} title="DeviceBinding"/>
			<ScrollView >

<Text style={Skin.customeStyle.text2}>Remember Device</Text>
<Text style={Skin.customeStyle.div}> </Text>
<View style={Skin.customeStyle.row}>
<Text style={Skin.customeStyle.remember}>{this.props.url.chlngJson.chlng_info[1].value}</Text>

<View>
<Animated.View style={[Skin.customeStyle.wrap,{opacity:1}]}>
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
</View>


</View>


<Text style={Skin.customeStyle.text2}>{this.state.type}</Text>

<Text style={Skin.customeStyle.div}> </Text>

<TouchableHighlight
		style={[Skin.customeStyle.roundcornerbutton]}
		onPress={this.setDeviceBinding.bind(this)}
		underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
		 activeOpacity={0.6}
		>
		<Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
		</TouchableHighlight>
</ScrollView >
			</View>
		);
	}
};

module.exports = DeviceBinding;
