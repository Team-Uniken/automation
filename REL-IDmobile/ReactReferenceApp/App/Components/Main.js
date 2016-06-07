

var React = require('react-native');
//var NavigationBar = require('react-native-navbar');
var Accounts = require('./Accounts');
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
  TouchableOpacity,
  ActivityIndicatorIOS,
  StyleSheet,
  StatusBarIOS,
  BackAndroid,
  PropTypes,
} = React;



var dnaProxyPort;
var dnaUserName;


class Main extends React.Component{
  constructor(props){
    super(props);
    this.state={
      drawerOpen: false,
      drawerDisabled: false,
    };
  }

  toggleDrawer(){
    console.log(this);
    if(this.state.drawerOpen){
      this.drawer.close();
    }else{
      this.drawer.open();
    }
  }


  render() {
    return (
      <Drawer
        ref={c => this.drawer = c}
        type="static"
        content={
          <ControlPanel closeDrawer={this.closeDrawer} />
        }
        acceptDoubleTap
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15}}}
        onOpen={() => {
          console.log('onopen')
          this.setState({drawerOpen: true})
        }}
        onClose={() => {
          console.log('onclose')
          this.setState({drawerOpen: false})
        }}
        captureGestures={false}
        tweenDuration={100}
        panThreshold={0.0}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => {
          return 70
        }}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}
        negotiatePan
        >
          <Accounts navigator={this.props.navigator} toggle={this.toggleDrawer.bind(this)}/>
      </Drawer>
    )
  }

};



var drawerStyles = {
    drawer: { shadowColor: '#000000'}
    //, shadowOpacity: 0.8, shadowRadius: 3},
    //main: {paddingLeft: 3},
};







/*
    <View style={{ flex: 1, }}>
          <NavigationBar
            title={{title:'Accounts',tintColor:Skin.colors.TEXT_COLOR}}
            tintColor={Skin.colors.PRIMARY}
            statusBar={{tintColor:Skin.colors.DARK_PRIMARY,style:'light-content'}}
            leftButton={{
              tintColor: Skin.colors.TEXT_COLOR,
              textStyle: Skin.nav.icon,
              title: "\ue20e",
            }} 
            
            />*/

        /*
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
        <Accounts navigator={this.props.navigator}/>*/



module.exports = Main;
  