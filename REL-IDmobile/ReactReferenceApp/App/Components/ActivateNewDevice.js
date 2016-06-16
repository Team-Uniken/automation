var React = require('react-native');

var ToolBar = require('./ToolBar');

import Spinner from 'react-native-loading-spinner-overlay';


var Dimensions = require('Dimensions');

var CORE_FONT = 'Century Gothic';

var MID_COL = '#2579A2';

var TEXT_COLOR = '#FFFFFF';

var SCREEN_WIDTH = Dimensions.get('window').width;

var SCREEN_HEIGHT = Dimensions.get('window').height;


var {

	View,

	Text,

	Navigator,

	TouchableHighlight,

	StyleSheet,

  Dimensions,

	ScrollView,

  AsyncStorage,

} = React;


var styles = StyleSheet.create({

	Container: {

	    flex: 1,

      backgroundColor: 'rgba(8,26,60,0.9)'

	},

   bar:{

   backgroundColor: MID_COL,

   width: 20,

   height:3,

   marginTop:3,

   },

   navbar:{

   backgroundColor: '#ffffff',

   height: 65,

   flexDirection: 'row',

   padding: 10,

   paddingTop:30

   },

   navButton:{

   backgroundColor: 'transparent',

   },

   navButtonIcon:{

   fontFamily: CORE_FONT,

   },

   navTitle:{

   flex:2,

   fontFamily: CORE_FONT,

   textAlign: 'center',

   fontSize: 20,

   },

  GenerateAccessCodeText:{

     textAlign: "center",

    marginTop:16,

    color: TEXT_COLOR,

    justifyContent: 'center',

    alignItems: 'center',

    fontSize: 18,

    width:Dimensions.get('window').width,

  },

   AccessCodeTextStyle:{

   textAlign: "center",

   marginTop:16,

   color: TEXT_COLOR,

   justifyContent: 'center',

   alignItems: 'center',

   fontSize: 17,

   width:Dimensions.get('window').width,

   },

   AccessCodeValueStyle:{

   textAlign: "center",

   marginTop:16,

   color: TEXT_COLOR,

   justifyContent: 'center',

   alignItems: 'center',

   fontSize: 22,

   width:Dimensions.get('window').width,

   },

  div:{

    marginTop:16,

    width:Dimensions.get('window').width,

    backgroundColor: '#fff',

    height:1,

  },


});




class ActivateNewDevice extends React.Component{

  constructor(props){

    super(props);

    this.state = {

    username:'',

    accCode:'-----',

    accValue:'-----',

    expiryMsg:'Your access code expires on ',

    isLoading:false

    };

  }



  componentDidMount(){

    this.setState({ isLoading: true });



    AsyncStorage.getItem("userId").then((value) => {

                                        AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {

																				currentProfile = JSON.parse(currentProfile);



                                        var baseUrl = "http://" + currentProfile.Host + ":8080" + "/GM/generateOTP.htm?userId=";
                                                             
                                        
                                                             

                                        var url = baseUrl.concat(value);

                                        fetch(url, {

                                              method: 'POST',

                                              })

                                        .then((response) => response.text())

                                        .then((responseText) => {

                                              console.log(responseText);

                                              var res = JSON.parse(responseText);

                                              this.state.accCode =res.otpId;

                                              this.state.accValue=res.otpValue;

                                              var Msg=res.expiryTs;

                                              this.state.expiryMsg = 'Your access code expires on '.concat(Msg);

                                              this.setState({ isLoading:false});

                                              })

                                        .catch((error) => {

                                               console.warn(error);

                                               this.state.expiryMsg="Failed to generate access code. Please try again";

                                               this.setState({ isLoading:false});

                                               });

                                        }).done();


																			});
  }



  render() {



		return (

			<View style={styles.Container}>



            <View style={styles.navbar}>

            <TouchableHighlight

            style={[styles.navButton]}

            underlayColor={'#FFFFFF'}

            activeOpacity={0.6}

            >

            <View></View>

            </TouchableHighlight>

            <Text style={styles.navTitle}>{"Activate New Device"}</Text>

            <TouchableHighlight

            style={[styles.navButton]}

            onPress={()=>{

            this.props.navigator.pop();

            }}

            underlayColor={'#FFFFFF'}

            activeOpacity={0.6}

            >

            <Text

            style={[{textAlign: 'right',fontSize:22}]}

            >X</Text>

            </TouchableHighlight>

            </View>

            <View style={{borderColor:"#D0D0D0",borderStyle:'solid',borderWidth:0.5,width:SCREEN_WIDTH}}></View>



           <ScrollView >

              <Text style={styles.GenerateAccessCodeText}>Activate your new device using the below access code and access value</Text>

                <Text style={styles.div}> </Text>

                <Text style={styles.AccessCodeValueStyle}>{this.state.accCode}</Text>

                <Text style={styles.AccessCodeTextStyle}> Access Code</Text>

                <Text style={styles.div}> </Text>

                <Text style={styles.AccessCodeValueStyle}>{this.state.accValue}</Text>

                <Text style={styles.AccessCodeTextStyle}> Access Value</Text>

                <Text style={styles.div}> </Text>

                <Text style={styles.AccessCodeTextStyle}> {this.state.expiryMsg}</Text>

            </ScrollView >




			</View>

		);

  }

};


module.exports = ActivateNewDevice;


class MyComponent extends React.Component {



  constructor(props) {

    super();

    this.state = {

    visible: true

    };

  }



  render() {

    return (

            <View style={{ flex: 1 }}>

            <Spinner visible={this.state.visible} />

            </View>

            );

  }

}
