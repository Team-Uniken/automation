import React, { PropTypes, Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-checkbox-field';
import Skin from '../../Skin';

class CheckboxField extends Component {
  constructor(props) {
    super(props)
  }
  onSelect(){
    return this.props.selected ? Skin.icon.check : ''
  }

  render(){
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={this.props.containerStyle}>
          {this.props.labelSide === 'left' ?
           <Text
             onPress={this.props.onLabelPress}
             style={this.props.labelStyle}>
             {this.props.children}
           </Text>
           : null}
          <Checkbox
            selected={this.props.selected}
            onSelect={this.props.onSelect}
            defaultColor={this.props.defaultColor}
            selectedColor={this.props.selectedColor}
            checkboxStyle={this.props.checkboxStyle}>
            <Text style={Skin.baseline.checkbox.check}>
              {this.onSelect()}
            </Text>
          </Checkbox>
          {this.props.labelSide === 'right' ?
           <Text
             onPress={this.props.onLabelPress}
             style={this.props.labelStyle}>
             {this.props.children}
           </Text>
           : null}
        </View>
      </TouchableOpacity>
    );
  }
};

CheckboxField.propTypes = {
  // CheckboxField
  label: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  labelStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  labelSide: PropTypes.oneOf(['left', 'right']),

  // Checkbox
  defaultColor: PropTypes.string,
  selectedColor: PropTypes.string,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  checkboxStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  children: PropTypes.string,
};

CheckboxField.defaultProps = {
  containerStyle: Skin.baseline.checkbox.container,
  labelStyle: Skin.baseline.checkbox.label,
  checkboxStyle: Skin.baseline.checkbox.base,
  defaultColor: Skin.baseline.checkbox.defaultColor,
  selectedColor: Skin.baseline.checkbox.selectedColor,
  onSelect: () => {},
  labelSide: 'left',
};

export default CheckboxField;













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