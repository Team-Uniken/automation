var React = require('react-native');
import Skin from '../../Skin';
var ToolBar = require('./ChallengeToolBar');

/*
  CALLED
*/
import Events from 'react-native-simple-events';


var {
    StyleSheet,
    View,
    Text,
    Image,
	   TouchableHighlight,
    } = React;

var Appointment = React.createClass({
  render() {
    return (
      <View style={styles.toolbarrow}>
      <TouchableHighlight
style={styles.touchable}
        onPress={()=>{
          Events.trigger('showPreviousChallenge', '');
        }}
        underlayColor={Skin.colors.STATUS_BAR_COLOR}
        activeOpacity={0.6}
      >
      <Image source={require('image!ic_back')} style={styles.images} />
      </TouchableHighlight>
      <Text style={Skin.customeStyle.title}
      >{this.props.title}</Text>

      </View>
		);




  },
});

var styles = {
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: Skin.colors.TOOL_BAR_COLOR,
            height:56,
            width:Skin.SCREEN_WIDTH,
  },
  images: {
    width: 24,
    height: 24,
    margin:12,
  },
  touchable: {
    width: 48,
    height: 48,
    marginTop:4,
  },
};
module.exports = Appointment;
