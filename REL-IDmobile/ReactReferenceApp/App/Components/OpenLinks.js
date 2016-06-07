/*
  ALWAYS NEED
*/
'use strict';

var React = require('react-native');
var Skin = require('../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var {
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
	  TouchableHighlight,
} = React;

var OpenLinks = React.createClass({
  render() {
    return (
      <View style={[Skin.logStyle.input_wrap, {justifyContent:'space-between'}]}>
        <View style={Skin.logStyle.openlink_wrap}>
          <Text style={Skin.logStyle.openlink_icon}>
            {Skin.text.LINK_1_ICON}
          </Text>
          <Text style={Skin.logStyle.openlink_text}>
            {Skin.text.LINK_1_TEXT}
          </Text>
        </View>
        <View style={Skin.logStyle.openlink_wrap}>
          <Text style={Skin.logStyle.openlink_icon}>
            {Skin.text.LINK_2_ICON}
          </Text>
          <Text style={Skin.logStyle.openlink_text}>
            {Skin.text.LINK_2_TEXT}
          </Text>
        </View>
        <View style={Skin.logStyle.openlink_wrap}ja>
          <Text style={Skin.logStyle.openlink_icon}>
            {Skin.text.LINK_3_ICON}
          </Text>
          <Text style={Skin.logStyle.openlink_text}>
            {Skin.text.LINK_3_TEXT}
          </Text>
        </View>
      </View>
    );
  },
});

module.exports = OpenLinks;
