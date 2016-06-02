var React = require('react-native');



var {
Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
	TouchableHighlight,
	Dimensions,
  Dimensions,
} = React;

var Appointment = React.createClass({


  render() {

    return (
      <View style={styles.toolbarrow}>
      <TouchableHighlight
style={styles.touchable}
        onPress={()=>{
                this.props.navigator.pop();
        }}
        underlayColor={'#FFF'}
        activeOpacity={0.6}
      >
        <Image source={require('image!ic_back')} style={styles.images} />

      </TouchableHighlight>
      <Text
        style={{fontSize:24,color: '#fff',marginTop:8,fontWeight: 'bold', width:Dimensions.get('window').width-96,textAlign:'center',	textAlignVertical:'center'}}
      >{this.props.title}</Text>

      </View>
		);




  },
});

var styles = {
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#2196F3',
            height:56,
            width:Dimensions.get('window').width,
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
