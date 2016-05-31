var React = require('react-native');



var {
Dimensions,
    StyleSheet,
    View,
    Text,
	Dimensions,
  Dimensions,
} = React;

var Appointment = React.createClass({


  render() {

    return (
      <View style={styles.toolbarrow}>
      <Text
        style={{fontSize:22,color: '#2579a2',marginTop:12,fontWeight: 'bold', width:Dimensions.get('window').width,textAlign:'center',}}
      >{this.props.title}</Text>
      </View>
		);




  },
});

var styles = {
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#fff',
            height:56,
            width:Dimensions.get('window').width,
  },
};
module.exports = Appointment;
