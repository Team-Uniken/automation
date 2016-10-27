

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
  height:48,
    textAlign: 'left',
    textAlignVertical: 'center',
paddingTop:12,
  },
   row: {
    flexDirection: 'row',
    height:48,
    width:Skin.VIEW_WIDTH
  },
});

class CheckBox extends Component {
  render() {
   var check = this.props.selected ? Skin.icon.check:'';

    return (  
 <View style={styles.row}>
 <CheckboxField
                defaultColor='tranprant'
                selectedColor="#247fd2"
                onSelect={this.props.onSelect}
                checkboxStyle={styles.checkboxStyle}
                labelSide={this.props.labelSide}>
                <Text style={{ color: '#f00' }}>{check}</Text>
            </CheckboxField>
      <Text style={styles.check_text}>{this.props.lable}</Text>
  </View>
            );
  }
}

module.exports = CheckBox;

// Commenting because of UI issues on android

// import React, { PropTypes, Component } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Checkbox } from 'react-native-checkbox-field';
// import Skin from '../../Skin';


// const Styles = { defaultColor: '#fff',selectedColor: '#247fd2' };



// const CheckboxField = (props) => {

//   const source = props.selected ? Skin.icon.check : ''

//   return (
//     <TouchableOpacity onPress={props.onSelect}>
//       <View style={props.containerStyle}>
//         {props.labelSide === 'left' ?
//          <Text
//            onPress={props.onLabelPress}
//            style={props.labelStyle}>
//            {props.children}
//          </Text>
//          : null}
//         <Checkbox
//           selected={props.selected}
//           onSelect={props.onSelect}
//           defaultColor={props.defaultColor}
//           selectedColor={props.selectedColor}
//           checkboxStyle={props.checkboxStyle}>
//           <Text style={Skin.baseline.checkbox.check}>
//             {source}
//           </Text>
//         </Checkbox>
//         {props.labelSide === 'right' ?
//          <Text
//            onPress={props.onLabelPress}
//            style={props.labelStyle}>
//            {props.children}
//          </Text>
//          : null}
//       </View>
//     </TouchableOpacity>


//     );
// };

// CheckboxField.propTypes = {
//   // CheckboxField
//   label: PropTypes.string,
//   containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
//   labelStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
//   labelSide: PropTypes.oneOf(['left', 'right']),

//   // Checkbox
//   defaultColor: PropTypes.string,
//   selectedColor: PropTypes.string,
//   selected: PropTypes.bool,
//   onSelect: PropTypes.func.isRequired,
//   checkboxStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
//   children: PropTypes.string
// };

// CheckboxField.defaultProps = {
//   containerStyle: Skin.baseline.checkbox.container,
//   labelStyle: Skin.baseline.checkbox.label,
//   checkboxStyle: Skin.baseline.checkbox.base,
//   defaultColor: Skin.baseline.checkbox.defaultColor,
//   selectedColor: Skin.baseline.checkbox.selectedColor,
//   onSelect: () => {
//   },
//   labelSide: 'left'
// };

// export default CheckboxField;













/*
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <CheckboxField
          defaultColor={Skin.baseline.checkbox.defaultColor, this.props.defaultColor}
          selectedColor={Skin.baseline.checkbox.selectedColor, this.props.selectedColor}
          containerStyle={[Skin.baseline.checkbox.container, this.props.containerStyle]}
          onSelect={this.props.onSelect}
          checkboxStyle={[Skin.baseline.checkbox.base, this.props.checkboxStyle]}>
          <Text style={Skin.baseline.checkbox.check}>
            {this.props.checkState}
          </Text>
        </CheckboxField>
        <Text
          style={[Skin.baseline.checkbox.label, this.props.labelStyle]}
          onPress={this.props.onLabelPress}>
          {this.props.children}
        </Text>
      </View>
      );
  }
}
Checkbox.propTypes = {
      // CheckboxField
      label: PropTypes.string,
      containerStyle: PropTypes.oneOfType([ PropTypes.number, PropTypes.object ]),
      labelStyle: PropTypes.oneOfType([ PropTypes.number, PropTypes.object ]),
      labelSide: PropTypes.oneOf([
          'left',
          'right'
      ]),
      
      // Checkbox
      defaultColor: PropTypes.string,
      selectedColor: PropTypes.string,
      selected: PropTypes.bool,
      onSelect: PropTypes.func.isRequired,
      checkboxStyle: PropTypes.oneOfType([ PropTypes.number, PropTypes.object ]),
      children: PropTypes.element
  }
}

module.exports = CheckBox;
*/