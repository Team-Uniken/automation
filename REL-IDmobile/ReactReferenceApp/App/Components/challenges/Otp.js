

var React = require('react-native');
var ToolBar = require('../ToolBar');
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

		componentDidMount() {
		}
	render() {
		return (
			<View style={styles.Container}>
			<ToolBar navigator={this.props.navigator} title="Login"/>

			<ScrollView >

      <Text style={styles.step}>{this.props.url.chlngJson.chlng_idx}/{this.props.url.chlngsCount}</Text>
         <Text style={styles.Varification}>Set Access</Text>
<Text style={styles.div}> </Text>
<Text style={styles.Varificationkey}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
<Text style={styles.Varification}>Verification Key</Text>
<Text style={styles.match}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
<Text style={styles.div}> </Text>
<Text style={styles.Varification}>Access Code</Text>
<Text style={styles.div}> </Text>

 <TextInput
 	autoCorrect={false}
	secureTextEntry={true}
	placeholder={'Enter Access Code'}
 	placeholderTextColor={'rgba(255,255,255,0.5)'}
 	style={styles.input}
 />

 <Text style={styles.step}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
 <Text style={styles.div}> </Text>


 <TouchableHighlight
 style={styles.roundcorner}
	 onPress={()=>{
	 	Events.trigger('showNextChallenge', {response: this.props.url.chlngJson});
	 }}
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

module.exports = Activation;