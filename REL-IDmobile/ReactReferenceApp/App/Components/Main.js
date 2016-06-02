

var React = require('react-native');
//var NavigationBar = require('react-native-navbar');
var Menu = require('./Menu');
var Skin = require('./Skin');
var styles = Skin.styles;
var Load = require('./Load');
var ControlPanel = require('./ControlPanel');
import Drawer from 'react-native-drawer'

var {
  View,
  Dimensions,
  Text,
  Image,
  Navigator,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  StatusBarIOS,
  BackAndroid,
} = React;



var dnaProxyPort;
var dnaUserName;




var styles = StyleSheet.create({
  hamburger: {
    width: 24,
    height: 24,
    margin:16,
  },
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#fff',


  },
  bar:{
    backgroundColor: '#FFFFFf',
    width: 20,
    height:3,
    marginTop:3,
  },
  navbar:{
    backgroundColor: '#ffffff',
    height: 65,
    flexDirection: 'row',
    margin: 10,
    marginTop:30
  },
  navButton:{
    //backgroundColor:'#dddddd',
    backgroundColor: 'transparent',
    width: 100,
    height: 20,

    flex:1,

  },
  navButtonText:{
    //textAlign: 'left',
    //fontFamily: CORE_FONT,
  },
  navRight:{
    //textAlign: 'right'
   // right: 0,
   // position: 'absolute'
  },
  navLeft:{
    //left: 0,
   // position: 'absolute',
    //flex:1
  },
  navTitle:{
    flex:2,
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
  }
});



class Main extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      controlPanelOpen:false
    }
  }

  toggleControlPanel(){
    if(this.state.controlPanelOpen){
      this.refs.drawer.close();
      this.setState({controlPanelOpen:false});
    }else{
      this.refs.drawer.open();
      this.setState({controlPanelOpen:true});
    }
  }
  render() {
  //  StatusBarIOS.setStyle(0);
    return (
      <Drawer
        ref="drawer"
        type="static"
        content={<ControlPanel navigator={this.props.navigator} toggle={this.toggleControlPanel.bind(this)}/>}
        openDrawerOffset={50}
        styles={{main: {shadowColor: "#000000", shadowOpacity: 1, shadowRadius: 20}}}
        tweenHandler={Drawer.tweenPresets.parallax}
      >
        <View style={styles.toolbarrow}>
          <TouchableHighlight
            onPress={this.toggleControlPanel.bind(this)}
            underlayColor={'#FFFFFF'}
            activeOpacity={0.6}
          >
            <Image source={require('image!ic_navigation')} style={styles.hamburger} />
          </TouchableHighlight>
          <Text
            style={{fontSize:22,color: '#2579a2',margin:12,fontWeight: 'bold', width:Dimensions.get('window').width-120,}}
          >
            Menu
          </Text>
        </View>
        <Menu navigator={this.props.navigator}/>
      </Drawer>
    )
  }
};

module.exports = Main;
