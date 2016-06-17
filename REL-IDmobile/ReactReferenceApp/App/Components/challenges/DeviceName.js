'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';

const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
} = React;

let responseJson;

export default class DevName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceName: this.props.url.chlngJson.chlng_resp[0].response,
    };
  }

  componentDidMount() {
//    this.state.deviceName = this.props.url.chlngJson.chlng_resp[0].response;
  }

  onDeviceNameChange(event) {
    this.setState({ deviceName: event.nativeEvent.text });
  }

  setDeviceName() {
    const dName = this.state.deviceName;
    if (dName.length > 0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = dName;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Please enter Device Name ');
    }
  }

  onDeviceNameChangeText(event) {
    this.setState({ deviceName: event.nativeEvent.text });
  }

  btnText() {
    console.log('------ devname ' +
      this.props.url.chlngJson.chlng_idx +
      this.props.url.chlngsCount
    );
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }



  render() {
    return (
      <MainActivation>
        <View style={{marginTop:38}}>
          <Text style={Skin.activationStyle.counter}>
            {this.props.url.currentIndex}/{this.props.url.chlngsCount}
          </Text>
          <Text style={Skin.activationStyle.title}>Device Name</Text>
          <Text style={Skin.activationStyle.info}>
            Set a nickname for this device:
          </Text>
        </View>
        <View style={Skin.activationStyle.input_wrap}>
          <View style={Skin.activationStyle.textinput_wrap}>
            <TextInput
              returnKeyType={'next'}
              autoCorrect={false}
              keyboardType={'default'}
              placeholderTextColor={'rgba(255,255,255,0.7)'}
              style={Skin.activationStyle.textinput}
              value={this.state.deviceName}
              ref={'deviceName'}
              placeholder={'Enter Device Nickname'}
              onChange={this.onDeviceNameChange.bind(this)}
              onSubmitEditing={this.setDeviceName.bind(this)}
            />
          </View>
        </View>
        <View style={Skin.activationStyle.input_wrap}>
          <TouchableHighlight
            onPress={this.setDeviceName.bind(this)}
            style={Skin.activationStyle.button}
            activeOpacity={0.8}
          >
            <Text style={Skin.activationStyle.buttontext}>
              {this.btnText()}
            </Text>
          </TouchableHighlight>
        </View>
      </MainActivation>
    );
  }
}

module.exports = DevName;
