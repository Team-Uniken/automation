

var React = require('react-native');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';
var ToolBar = require('../ToolBar');
var Password = require('./Password');
var Events = require('react-native-simple-events');
var {customeStyle, styles} = require("../MainStyleSheet");


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
    this.state.deviceName = this.props.url.chlngJson.chlng_resp[0].response;
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
			<View style={customeStyle.maincontainer}>
						<StatusBar backgroundColor='#1976d2' barStyle='light-content'/>
						<ToolBar navigator={this.props.navigator} title="Login"/>
						<ScrollView >
						<Text style={customeStyle.text2}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
						<Text style={customeStyle.note}>Please give a name for this device</Text>
						<Text style={customeStyle.div}> </Text>

						<View
					       style={[customeStyle.roundcorner,{backgroundColor:'#fff',borderColor:'#2196F3'}]}
					        activeOpacity={0.6}
					       >
					       <TextInput
					         autoCorrect={false}
					         ref='activatonCode'
					         placeholder={'Enter name of the device'}
					         placeholderTextColor={'#8F8F8F'}
					         style={customeStyle.input}
									 ref='deviceName'
									 value={this.state.deviceName}
									 onChange={this.onDeviceNameChange.bind(this)}
					       />
					       </View>

      <Text style={customeStyle.div}> </Text>

			<TouchableHighlight
			onPress={this.setDeviceName.bind(this)}
       style={[customeStyle.roundcorner,{backgroundColor:'#2196F3'}]}
      	 underlayColor={'#f00'}
      	 activeOpacity={0.6}>
       			<Text style={customeStyle.button}>{this.btnText()}</Text>
       </TouchableHighlight>
			 </ScrollView >
		</View>
		);
	}
};

module.exports = DevName;