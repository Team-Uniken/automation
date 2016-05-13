

var React = require('react-native');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';
var ToolBar = require('../ToolBar');
var Password = require('./Password');


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
	borderWidth: 1,
	borderColor: "#555555",
	borderRadius: 9,
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
	backgroundColor:'#183F5B',
	borderRadius: 30,
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
	input: {
		fontFamily: 'Century Gothic',
		backgroundColor: 'rgba(255,255,255,0.1)',
		height: 55,
		fontSize: 22,
		width: 280,
		color: 'rgba(255,255,255,1)',
		alignItems: 'center',
		marginTop:16,
		borderWidth: 1,
		borderColor: "#555555",
		borderRadius: 8,
	},
});



class Activation extends React.Component{
	render() {
		return (
			<View style={styles.Container}>
			<ToolBar navigator={this.props.navigator} title="Activation"/>
			<ScrollView >

      <Text style={styles.step}>Step 1/<Text style={{color:MIDBLUE}}>1</Text></Text>
         <Text style={styles.Varification}>Verify and Activate</Text>
<Text style={styles.div}> </Text>
<Text style={styles.Varificationkey}>95nekc</Text>
<Text style={styles.Varification}>Verification Key</Text>
<Text style={styles.match}>Match varificatin key and{"\n"}enter activation code send to you</Text>
<Text style={styles.div}> </Text>
<Text style={styles.Varification}>Activation Code</Text>

<View style={styles.roundcorneredittext}>
<TextInput
placeholder={'Enter Activation Code'}
onChange={(event) => this.setState({devName: event.nativeEvent.text})}
style={styles.formInput}
 />
</View>
<Text style={styles.step}>3 Attempts Left</Text>


 <TouchableHighlight
 style={styles.roundcorner}
	 onPress={()=>{
		 this.props.navigator.push(
				{id: "Password",}
			);
	 }}
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
