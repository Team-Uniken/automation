
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';

const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
} = ReactNative;
const{Component} =  React;

var styles = StyleSheet.create({
    checkboxStyle: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#f00',
        borderRadius: 5,
    } 
  , check_text: {
    fontSize: 20,
    color: '#000',
    opacity: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
   row: {
    flexDirection: 'row',
    height:48,
    width:Skin.VIEW_WIDTH
  },
});

class CheckBox extends Component {
  render() {
    return (  
 <View style={styles.row}>
 <CheckboxField
                defaultColor='tranprant'
                selectedColor="#247fd2"
                onSelect={this.props.onSelect}
                checkboxStyle={styles.checkboxStyle}
                labelSide="right">
                <Text style={{ color: '#f00' }}>{this.props.value}</Text>
            </CheckboxField>
      <Text style={styles.check_text}>{this.props.lable}</Text>
  </View>
            );
  }
}

module.exports = CheckBox;