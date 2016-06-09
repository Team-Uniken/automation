'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import Main from '../Main';
import { KeyboardAwareScrollView } from 'react-native-smart-scroll-view';

/*
  Instantiaions
*/
const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Events,
  ScrollView,
} = React;

export default class ActivationScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activatonCode: '',
    };
  }

  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }

  checkActivationCode() {
    const vkey = this.state.activatonCode;
    if (vkey.length > 0) {
      const responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Please enter Verification Key');
    }
  }
  render() {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: false,
        }}
        navBar={{
          title: 'Contact',
          visible: true,
          tint: Skin.colors.TEXT_COLOR,
          left: {
            text: '',
            icon: '\ue20e',
            iconStyle: {
              fontSize: 30,
              marginLeft: 8,
            },
            textStyle: {},
          },
        }}
        bottomMenu={{
          visible: true,
          active: 5,
        }}
        navigator={this.props.navigator}
      >
          <ScrollView>
            <Text style={Skin.customeStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
            <Text style={Skin.customeStyle.text2}>Verify and Activate</Text>
            <Text style={Skin.customeStyle.div}> </Text>
            <Text style={Skin.customeStyle.text3}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
            <Text style={Skin.customeStyle.text2}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
            <Text style={[Skin.customeStyle.note, { width: 200, marginLeft: Skin.SCREEN_WIDTH / 2 - 100 }]}>{this.props.url.chlngJson.chlng_info[2].value}</Text>
            <Text style={Skin.customeStyle.div}> </Text>
            <Text style={Skin.customeStyle.text2}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
            <View style={[Skin.customeStyle.roundcornerinput]} activeOpacity={0.6}>
              <KeyboardAwareScrollView>
                <TextInput
                  autoCorrect={false}
                  ref="activatonCode" 
                  placeholder={'Enter Activation Code'}
                  placeholderTextColor={Skin.colors.HINT_COLOR}
                  style={Skin.customeStyle.input}
                  secureTextEntry
                  onChange={this.onActivationCodeChange.bind(this)}
                />
              </KeyboardAwareScrollView>
            </View>
            <Text style={Skin.customeStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
            <TouchableHighlight
              style={[Skin.customeStyle.roundcornerbutton]}
              onPress={this.checkActivationCode.bind(this)}
              underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
              activeOpacity={0.6}
            >
              <Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
            </TouchableHighlight>
          </ScrollView>
      </Main>
    );
  }
}
