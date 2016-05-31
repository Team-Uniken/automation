

var React = require('react-native');
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
	input: {
		fontFamily: 'Century Gothic',
		backgroundColor: 'rgba(255,255,255,0.1)',
		height: 55,
		fontSize: 22,
		width: 280,
		color: 'rgba(255,255,255,1)',
		alignItems: 'center',
		marginTop:16,
	},
	button: {
		backgroundColor: 'transparent',
		height: 48,
		fontSize: 16,
		marginTop: 13,
		color: MIDBLUE,
		marginTop:16,
		width:Dimensions.get('window').width,
		justifyContent: 'center',
		alignItems: 'center',


	},

});



class Activation extends React.Component{
	render() {
		return (
			<View style={styles.Container}>
      <View style={styles.toolbarrow}>
      <Text
        style={{fontSize:22,color: '#2579a2',margin:12,fontWeight: 'bold', width:Dimensions.get('window').width-80,}}
      >Activation</Text>
      <TouchableHighlight
        onPress={()=>{
                this.props.navigator.pop();
        }}
        underlayColor={'#FFFFFF'}
        activeOpacity={0.6}
      >
        <Text
          style={{textAlign: 'right',fontSize:24,color: '#2579a2',margin:12,}}
        >X</Text>
      </TouchableHighlight>
      </View>

      <Text style={styles.step}>Step 1/<Text style={{color: 'red'}}>1</Text></Text>
         <Text style={styles.Varification}>Verify and Activate</Text>
<Text style={styles.div}> </Text>
<Text style={styles.Varificationkey}>95nekc</Text>
<Text style={styles.Varification}>Verification Key</Text>
<Text style={styles.match}>Match varificatin key and enter activation code send to you</Text>
<Text style={styles.div}> </Text>
<Text style={styles.Varification}>Activation Code</Text>

<TextInput
	returnKeyType={'next'}
	autoCorrect={false}
	placeholder={'Enter Activation Code'}
	placeholderTextColor={'rgba(255,255,255,0.5)'}
	style={styles.input}
/>
<Text style={styles.step}>3 Attempts Left</Text>
<View style={styles.button}><Text>3 Attempts Left</Text></View>
<Text style={styles.button}>Submit</Text>

			</View>
		);
	}
};

module.exports = Activation;
