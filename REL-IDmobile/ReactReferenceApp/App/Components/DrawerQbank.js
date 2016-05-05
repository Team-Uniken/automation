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
        <Text style={styles.controlHeader}>TITLE</Text>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight ><Text style={styles.menuItem}>Admin menu item 1</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight ><Text style={styles.menuItem}>Admin menu item 2</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight ><Text style={styles.menuItem}>Admin menu item 3</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight ><Text style={styles.menuItem}>Admin menu item 4</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight ><Text style={styles.menuItem}>Admin menu item 5</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight ><Text style={styles.menuItem}>Admin menu item 6</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <Text style={styles.menuItem}>   </Text>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight  style={styles.touch}><Text style={styles.menuItem}>Logout</Text>
        </TouchableHighlight>
      </View>
    )
  }
};

module.exports = ControlPanel
