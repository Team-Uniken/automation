

var React = require('react-native');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';
var ToolBar = require('../ToolBar');
var Password = require('./Password');
var Events = require('react-native-simple-events');
var Events = require('react-native-simple-events');
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
		marginLeft:Dimensions.get('window').width/2-120,
		width:240,
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

	roundcorner: {
		height: 56,
		width: 280,
	marginTop:16,
	marginLeft:Dimensions.get('window').width/2-140,
	borderWidth: 1,
	borderColor: "#fff",
	backgroundColor: 'rgba(255,255,255,0.1)',
	borderRadius: 30,
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



class Activation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activatonCode : ''

    };
  }

  checkActivationCode(){
    var vkey = this.state.activatonCode;
    if(vkey.length>0){
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', {response: responseJson});
    }
    else{
      alert('Please enter Verification Key');
    }
  }
  onActivationCodeChange(event){
    this.setState({activatonCode: event.nativeEvent.text});
  }

	render() {
		return (
			<View style={styles.Container}>
			<ToolBar navigator={this.props.navigator} title="Activation"/>
			<ScrollView >

<<<<<<< HEAD
			<Text style={styles.step}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
=======
			<Text style={styles.step}>{this.props.url.chlngJson.chlng_idx}/{this.props.url.chlngsCount}</Text>
>>>>>>> eda2805070e6851af73caa72936b5da5f9af339e
         <Text style={styles.Varification}>Verify and Activate</Text>
<Text style={styles.div}> </Text>
<Text style={styles.Varificationkey}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
<Text style={styles.Varification}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
<Text style={styles.match}>{this.props.url.chlngJson.chlng_info[2].value}</Text>

<Text style={styles.div}> </Text>
<Text style={styles.Varification}>{this.props.url.chlngJson.chlng_info[1].value}</Text>



<TextInput
	autoCorrect={false}
  ref='activatonCode'
	placeholder={'Enter Activation Code'}
	placeholderTextColor={'rgba(255,255,255,0.5)'}
	style={styles.input}
  onChange={this.onActivationCodeChange.bind(this)}
/>
<Text style={styles.step}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>


 <TouchableHighlight
 style={styles.roundcorner}
//	 onPress={()=>{
            onPress={this.checkActivationCode.bind(this)}
//		 Events.trigger('showNextChallenge', {response: this.props.url.chlngJson});
//	 }}
	 underlayColor={'#082340'}
	 activeOpacity={0.6}
 >
 <Text style={styles.button}>Submit</Text>
 </TouchableHighlight>



</ScrollView >
			</View>
		);
	}
};

module.exports = Activation;
