

var React = require('react-native');
var ToolBar = require('../ToolBar');
var SetQue = require('./SetQue');
var Events = require('react-native-simple-events');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';

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

var styles = StyleSheet.create({
	Container: {
	    flex: 1,
      backgroundColor: 'rgba(8,26,60,0.9)'
	},
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#fff',
            width:Dimensions.get('window').width,
  },
  step:{
     textAlign: "center",
    marginTop:16,
    color: TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    width:Dimensions.get('window').width,

  },
  Varification:{
     textAlign: "center",
    marginTop:16,
    color: TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    width:Dimensions.get('window').width,
  },
	match:{
		 textAlign: "center",
		marginTop:16,
		color: '#cdcdc1',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 20,
		width:Dimensions.get('window').width,
	},
	Varificationkey:{
		 textAlign: "center",
		marginTop:16,
		color: TEXT_COLOR,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 24,
		width:Dimensions.get('window').width,
	},
  div:{
    marginTop:16,
    width:Dimensions.get('window').width,
    backgroundColor: '#fff',
    height:1,
  },

	button: {
			fontFamily: 'Century Gothic',
		backgroundColor:'transparent',
	flex:1,
	fontSize: 16,
	margin:1,
	textAlign:'center',
	textAlignVertical:'center',
	color: '#FFF',
	marginTop:16,
	},
	roundcorneredittext: {
		height: 56,
		width: 280,
	marginTop:16,
	marginLeft:Dimensions.get('window').width/2-140,
	backgroundColor:'#fff',
	borderRadius: 10,
	},
	formInput: {
		height: 56,
		width: 280,
	fontSize: 16,
	textAlign:'center',
	color: "#555555",
	backgroundColor:'transparent'
	},
	roundcorner: {
		height: 56,
		width: 280,
	marginTop:16,
	marginLeft:Dimensions.get('window').width/2-140,
	borderWidth: 1,
	borderColor: "#fff",
	backgroundColor: 'rgba(255,255,255,0.1)',
	borderRadius:30,
	},

	input: {
		fontFamily: 'Century Gothic',
		backgroundColor: 'rgba(255,255,255,0.1)',
		height: 56,
		fontSize:16,
		width: 280,
		marginTop:16,
		color: 'rgba(255,255,255,1)',
		marginLeft:Dimensions.get('window').width/2-140,
		textAlign:'center',
		alignItems: 'center',
	},
});



class Password extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      password : '',
      cPassword : ''
      
    };
  }
  
  setPassword(){
    var pw = this.state.password;
    var cpw = this.state.cPassword;
    
    if(pw.length>0){
      if(cpw.length>0){
        if(pw == cpw){
        responseJson = this.props.url.chlngJson;
        responseJson.chlng_resp[0].response = pw;
          Events.trigger('showNextChallenge', {response: responseJson});
        }
        else{
          alert('Password and Confirm Password do not match');
        }}else{alert('Please enter confirm password ');}
    }
    else{
      alert('Please enter password ');
    }
  }
  
  onPasswordChange(event){
    this.setState({password: event.nativeEvent.text});
  }
  
  onConfirmPasswordChange(event){
    this.setState({cPassword: event.nativeEvent.text});
  }
  
	render() {
		return (
			<View style={styles.Container}>
			<ToolBar navigator={this.props.navigator} title="Activation"/>
			<ScrollView >

      <Text style={styles.step}>Step 4/<Text style={{color:MIDBLUE}}>5</Text></Text>
         <Text style={styles.Varification}>Set Access</Text>
<Text style={styles.div}> </Text>
<Text style={styles.Varification}>Set Account Password</Text>

<TextInput
	autoCorrect={false}
	secureTextEntry={true}
	placeholder={'Enter Password'}
	placeholderTextColor={'rgba(255,255,255,0.5)'}
	style={styles.input}
            ref='password'
            onChange={this.onPasswordChange.bind(this)}
/>
 <Text style={styles.div}> </Text>

	<TextInput
		autoCorrect={false}
		secureTextEntry={true}
		placeholder={'Confirm Password'}
		placeholderTextColor={'rgba(255,255,255,0.5)'}
		style={styles.input}
            ref='cPassowrd'
            onChange={this.onConfirmPasswordChange.bind(this)}
	/>

<Text style={styles.match}>To make stronger password : {"\n"}Add uppercase letter, Add number</Text>
<Text style={styles.div}> </Text>

 <TouchableHighlight
 style={styles.roundcorner}
             onPress={this.setPassword.bind(this)}
//	 onPress={()=>{
//		 this.props.navigator.push(
//				{id: "SetQue",}
//			);
//	 }}
	 underlayColor={'#082340'}
	 activeOpacity={0.6}
 >
 <Text style={styles.button}>Continue</Text>
 </TouchableHighlight>



</ScrollView >
			</View>
		);
	}
};

module.exports = Password;
