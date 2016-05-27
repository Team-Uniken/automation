

var React = require('react-native');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';
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
	remember:{
		margin:16,
		color: TEXT_COLOR,
		fontSize: 16,
		width:Dimensions.get('window').width-80,
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
	images: {
		width: 24,
		height: 24,
		margin:12,
	},
	row: {
						flexDirection:'row',
						width:Dimensions.get('window').width,
	},
	wrap: {
		position: 'absolute',
		top: 10,
		bottom: 0,
		left: 0,
		right: 0,
		width: 50,
		height: 50,
	},
});



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
			<View style={styles.Container}>
			<ToolBar navigator={this.props.navigator} title="DeviceBinding"/>
			<ScrollView >

<Text style={styles.Varification}>Remember Device</Text>
<Text style={styles.div}> </Text>
<View style={styles.row}>
<Text style={styles.remember}>{this.props.url.chlngJson.chlng_info[1].value}</Text>

<View>
<Animated.View style={[styles.wrap,{opacity:1}]}>
<TouchableHighlight
underlayColor={'transparent'}

>
<Image source={require('image!ic_unch1')} style={styles.images} />
</TouchableHighlight>
</Animated.View>

<Animated.View style={[styles.wrap,{opacity: this.state.opa}]}>
<TouchableHighlight
underlayColor={'transparent'}
onPress={this.check.bind(this)}

>
<Image source={require('image!ic_ch1')} style={styles.images} />
</TouchableHighlight>
</Animated.View>
</View>


</View>


<Text style={styles.Varification}>{this.state.type}</Text>

<Text style={styles.div}> </Text>

 <TouchableHighlight
 style={styles.roundcorner}
	 onPress={this.setDeviceBinding.bind(this)}

	 underlayColor={'#082340'}
	 activeOpacity={0.6}
 >
 <Text style={styles.button}>{this.btnText()}</Text>
 </TouchableHighlight>



</ScrollView >
			</View>
		);
	}
};

module.exports = DeviceBinding;
