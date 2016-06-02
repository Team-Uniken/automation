

var React = require('react-native');
var ToolBar = require('../ToolBar');
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
	StatusBar,
} = React;


class Activation extends React.Component{


  constructor(props){
    super(props);
    this.state = {
      accessCode : ''

    };
  }
  componentDidMount() {

		}

  checkAccessCode(){
    var AcCode = this.state.accessCode;
    if(AcCode.length>0){
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = AcCode;
      Events.trigger('showNextChallenge', {response: responseJson});
    }
    else{
      alert('Please enter Access Code');
    }
  }
  onAccessCodeChange(event){
    this.setState({accessCode: event.nativeEvent.text});
  }

btnText(){
	if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
		return "Submit";
	}else{
		return "Continue";
	}}


	render() {
		return (
			<View style={customeStyle.maincontainer}>
			      <StatusBar backgroundColor='#1976d2' barStyle='light-content'/>
						<ToolBar navigator={this.props.navigator} title="Login"/>
						<ScrollView >

      <Text style={customeStyle.text1}>{this.props.url.chlngJson.chlng_idx}/{this.props.url.chlngsCount}</Text>
         <Text style={customeStyle.text2}>Set Access</Text>
<Text style={styles.div}> </Text>
<Text style={customeStyle.text3}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
<Text style={customeStyle.text2}>Verification Key</Text>
<Text style={customeStyle.note}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
<Text style={customeStyle.div}> </Text>
<Text style={customeStyle.text2}>Access Code</Text>
<Text style={styles.div}> </Text>



      <View
      style={[customeStyle.roundcorner,{backgroundColor:'#fff',borderColor:'#2196F3'}]}
       activeOpacity={0.6}
      >
      <TextInput
      	autoCorrect={false}
        ref='accessCode'
      	placeholder={'Enter Access Code'}
      	placeholderTextColor={'#8F8F8F'}
      	style={customeStyle.input}
        secureTextEntry={true}
				onChange={this.onAccessCodeChange.bind(this)}
      />
      </View>


 <Text style={customeStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
 <Text style={styles.div}> </Text>


 <TouchableHighlight
		 style={[customeStyle.roundcorner,{backgroundColor:'#2196F3'}]}
		 onPress={this.checkAccessCode.bind(this)}
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

module.exports = Activation;
