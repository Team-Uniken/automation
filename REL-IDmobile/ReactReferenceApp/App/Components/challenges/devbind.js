

var React = require('react-native');
var {customeStyle, styles} = require("./MainStyleSheet");
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
			<View   style={{flex:1,backgroundColor:'#fff'}}>
		         <StatusBar
		         backgroundColor='#1976d2'
		         barStyle='light-content'
		         />
						 			<ToolBar navigator={this.props.navigator} title="DeviceBinding"/>
			<ScrollView >

<Text style={customeStyle.text2}>Remember Device</Text>
<Text style={customeStyle.div}> </Text>
<View style={customeStyle.row}>
<Text style={customeStyle.remember}>{this.props.url.chlngJson.chlng_info[1].value}</Text>

<View>
<Animated.View style={[customeStyle.wrap,{opacity:1}]}>
<TouchableHighlight
underlayColor={'transparent'}

>
<Image source={require('image!uncheck')} style={styles.images} />
</TouchableHighlight>
</Animated.View>

<Animated.View style={[styles.wrap,{opacity: this.state.opa}]}>
<TouchableHighlight
underlayColor={'transparent'}
onPress={this.check.bind(this)}

>
<Image source={require('image!check')} style={styles.images} />
</TouchableHighlight>
</Animated.View>
</View>


</View>


<Text style={customeStyle.text2}>{this.state.type}</Text>

<Text style={customeStyle.div}> </Text>

<TouchableHighlight
		style={[customeStyle.roundcorner,{backgroundColor:'#2196F3'}]}
		onPress={this.setDeviceBinding.bind(this)}
		 underlayColor={'#1976d2'}
		 activeOpacity={0.6}
		>
		<Text style={customeStyle.button}>{this.btnText()}</Text>
		</TouchableHighlight>
</ScrollView >
			</View>
		);
	}
};

module.exports = DeviceBinding;
