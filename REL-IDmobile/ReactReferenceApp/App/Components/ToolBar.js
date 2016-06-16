var React = require('react-native');
var Skin = require('../Skin');



var {
    StyleSheet,
    View,
    Text,
    Image,
	   TouchableHighlight,
    } = React;

var Toolbar = React.createClass({
  render() {
    return (
      <View style={styles.toolbarrow}>
      <TouchableHighlight
style={styles.touchable}
        onPress={()=>{
                this.props.navigator.pop();
        }}
        underlayColor={Skin.colors.STATUS_BAR_COLOR}
        activeOpacity={0.6}
      >
      {/*<Image source={require('image!ic_back')} style={styles.images} />*/}
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
module.exports = Toolbar;
