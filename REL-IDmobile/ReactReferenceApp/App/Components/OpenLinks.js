'use strict';

/*
  ALWAYS NEED
*/
import React from 'react-native';
import Skin from '../Skin';
import Communications from 'react-native-communications';

/*
  CALLED
*/
const {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} = React;


const styles = StyleSheet.create({
  openlink_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 80,
    marginTop: 100,
  },
  openlink_wrap: {
    backgroundColor: Skin.colors.DARK_PRIMARY,
    width: 80,
    height: 80,
    flexDirection: 'column',
  },
  openlink_text: {
    color: Skin.colors.TEXT_COLOR,
    textAlign: 'center',
    fontSize: 13,
    flex: 1,
  },
  openlink_icon: {
    color: Skin.colors.TEXT_COLOR,
    fontFamily: 'icomoon',
    flex: 2,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
    fontSize: 33,
  },
});


export default class OpenLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.openlink_row}>
        <TouchableOpacity
          style={styles.openlink_wrap}
          onPress={() => Communications.web(Skin.open.BRANCH_SEARCH_LINK)}
        >
          <Text style={styles.openlink_icon}>
            {Skin.text.LINK_1_ICON}
          </Text>
          <Text style={styles.openlink_text}>
            {Skin.text.LINK_1_TEXT}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.openlink_wrap}
          onPress={
            () => Communications.email(
              ['info@uniken.com'],
              null,
              null,
              'I\'m interested in REL-IDmobile!',
              'Hello, <br> I\'m interested in REL-IDmobile.  Please send me more details! <br><br> Sincerely,<br>--{Put your name}'
            )
          }
        >
          <Text style={styles.openlink_icon}>
            {Skin.text.LINK_2_ICON}
          </Text>
          <Text style={styles.openlink_text}>
            {Skin.text.LINK_2_TEXT}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.openlink_wrap}
          onPress={() => Communications.web(Skin.open.WEBSITE_LINK)}
        >
          <Text style={styles.openlink_icon}>
            {Skin.text.LINK_3_ICON}
          </Text>
          <Text style={styles.openlink_text}>
            {Skin.text.LINK_3_TEXT}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = OpenLinks;
