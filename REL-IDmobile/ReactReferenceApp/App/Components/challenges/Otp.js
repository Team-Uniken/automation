import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


var React = require('react-native');
var ToolBar = require('../ToolBar');
var Events = require('react-native-simple-events');
var Skin = require('../../Skin');

var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
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
			<View style={Skin.customeStyle.maincontainer}>
			      <StatusBar  backgroundColor={Skin.colors.STATUS_BAR_COLOR} barStyle='light-content'/>
						<ToolBar navigator={this.props.navigator} title="Login"/>
						<ScrollView >

      <Text style={Skin.customeStyle.text1}>{this.props.url.chlngJson.chlng_idx}/{this.props.url.chlngsCount}</Text>
         <Text style={Skin.customeStyle.text2}>Set Access</Text>
<Text style={Skin.customeStyle.div}> </Text>
<Text style={Skin.customeStyle.text3}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
<Text style={Skin.customeStyle.text2}>Verification Key</Text>
<Text style={Skin.customeStyle.note}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
<Text style={Skin.customeStyle.div}> </Text>
<Text style={Skin.customeStyle.text2}>Access Code</Text>
<Text style={Skin.customeStyle.div}> </Text>



      <View
      style={[Skin.customeStyle.roundcornerinput]}
       activeOpacity={0.6}
      >
			<KeyboardAwareScrollView>

      <TextInput
      	autoCorrect={false}
        ref='accessCode'
      	placeholder={'Enter Access Code'}
      	placeholderTextColor={'#8F8F8F'}
      	style={Skin.customeStyle.input}
        secureTextEntry={true}
				onChange={this.onAccessCodeChange.bind(this)}
      />
			</KeyboardAwareScrollView>

      </View>


 <Text style={Skin.customeStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
 <Text style={Skin.customeStyle.div}> </Text>


 <TouchableHighlight
		 style={[Skin.customeStyle.roundcornerbutton]}
		 onPress={this.checkAccessCode.bind(this)}
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

module.exports = Activation;
