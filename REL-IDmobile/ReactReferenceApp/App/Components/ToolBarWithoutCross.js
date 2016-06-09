var React = require('react-native');
var Skin = require('../Skin');

var {
    StyleSheet,
    View,
    Text,
    } = React;

var Appointment = React.createClass({
  render() {
    return (
      <View style={styles.toolbarrow}>
      <Text style={Skin.customeStyle.title1}>{this.props.title}</Text>
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
};
module.exports = Appointment;
