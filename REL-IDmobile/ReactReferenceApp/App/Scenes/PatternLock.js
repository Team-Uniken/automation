'use strict';

/*
  ALWAYS NEED
*/
import React from 'react-native';
import Skin from '../Skin';

import PatternView from '../Components/PatternView';


const {
    View,
    TouchableHighlight,
    Text,
} = React;

class PatternLock extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }
   
  onOkPressed(){
    this.refs["pattenView"].getPatternString();
  }

  onGetPattern(result){
    alert(result.pattern);
  }

  render() {
    return (
      <View>
        <PatternView 
        ref="pattenView"
        style={Skin.PatternLockStyle.patternlockview} pathColor="#000000" circleColor="#303F9F" dotColor="#3F51B5" gridRows='3' gridColumns='3' onGetPattern = {this.onGetPattern}/>
           <TouchableHighlight
              onPress={this.onOkPressed.bind(this)}
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={Skin.activationStyle.button}>
              <Text style={Skin.activationStyle.buttontext}>
                SAVE
              </Text>
            </TouchableHighlight>
      </View>);
  }
}


module.exports = PatternLock;