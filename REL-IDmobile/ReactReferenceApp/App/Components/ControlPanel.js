var React = require('react-native');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

var {
  View,
  Text,
  Navigator,
  StyleSheet,
  TouchableHighlight,
} = React;

var styles = StyleSheet.create({
  container:{
    backgroundColor: '#1c1c1c',
    flex: 1,
    //color: '#ffffff',
  },
  shadow:{
    width: 300,
    height: 300,
    shadowOffset:{width: 10, height: 10}
  },
  menuItem:{
    color: '#ffffff',
    fontFamily: 'Century Gothic',
    paddingTop: 15,
    paddingBottom: 15,
  },
  menuBorder:{
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#222222',
    marginLeft:20,
  },
  touch:{
    paddingLeft: 20
  },
  controlHeader:{
    color: '#ffffff',
    fontFamily: 'Century Gothic',
    paddingTop: 30,
    fontSize: 30,
    paddingBottom: 50,
    width: SCREEN_WIDTH-90,
    textAlign: 'center',
  }
});

class ControlPanel extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.controlHeader}>UNIKEN</Text>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Alerts"});}} style={styles.touch}><Text style={styles.menuItem}>Alerts</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Profile & Settings"});}} style={styles.touch}><Text style={styles.menuItem}>Profile & Settings</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Activate New Device"});}}  style={styles.touch}><Text style={styles.menuItem}>Activate New Device</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Change Secret Question"});}}  style={styles.touch}><Text style={styles.menuItem}>Change Secret Question</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Help & Support"});}}  style={styles.touch}><Text style={styles.menuItem}>Help & Support</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Contact Us"});}}  style={styles.touch}><Text style={styles.menuItem}>Contact Us</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Send App Feedback"});}}  style={styles.touch}><Text style={styles.menuItem}>Send App Feedback</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Legal Info"});}}  style={styles.touch}><Text style={styles.menuItem}>Legal Info</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <Text style={styles.menuItem}>   </Text>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "Load"});}}  style={styles.touch}><Text style={styles.menuItem}>Logout</Text>
        </TouchableHighlight>
      </View>
    )
  }
};

module.exports = ControlPanel