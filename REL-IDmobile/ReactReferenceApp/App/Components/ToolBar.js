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
      <Text
        style={{fontSize:24,color: '#2579a2',marginTop:12,marginLeft:40,fontWeight: 'bold', width:Dimensions.get('window').width-80,textAlign:'center',}}
      >{this.props.title}</Text>
      <TouchableHighlight
        onPress={()=>{
                this.props.navigator.pop();
        }}
        underlayColor={'#FFF'}
        activeOpacity={0.6}
      >
        <Text
          style={{textAlign: 'right',fontSize:24,color: '#2579a2',margin:12}}
        >X</Text>
      </TouchableHighlight>
      </View>
		);




  },
});

var styles = {
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#fff',
            width:Dimensions.get('window').width,
  },
};
module.exports = Appointment;
