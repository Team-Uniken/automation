/*
  ALWAYS NEED
*/
'use strict';

import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/

/*
  INSTANCES
*/
const {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} = React;


class WebViewMenu extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    };
  }

  handleClick(i) {
    this.props.navigator.push({ id:this.props.list[i].link });
  }

  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  goForward() {
    this.refs[WEBVIEW_REF].goForward();
  }

  reload() {
    this.refs[WEBVIEW_REF].reload();
  }


  render() {
    return (
      <View style={[styles.addressBarRow]}>
        <TouchableOpacity
          onPress={this.goBack}
          style={this.state.backButtonEnabled ? styles.navButton : styles.disabledButton}>
          <Text>
             {'<'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goForward}
          style={this.state.forwardButtonEnabled ? styles.navButton : styles.disabledButton}>
          <Text>
            {'>'}
          </Text>
        </TouchableOpacity>
        <TextInput
          ref={TEXT_INPUT_REF}
          autoCapitalize="none"
          defaultValue={this.state.url}
          onSubmitEditing={this.onSubmitEditing}
          onChange={this.handleTextInputChange}
          clearButtonMode="while-editing"
          style={styles.addressBarTextInput}
        />
        <TouchableOpacity onPress={this.pressGoButton}>
          <View style={styles.goButton}>
            <Text>
               Go!
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = WebViewMenu;


Skin.botmenu = StyleSheet.create({
  hoverbar: {
    backgroundColor: 'rgba(' + Skin.colors.PRIMARY_RGB + ',0.25)',
    height: 10,
  },
  hoverbar_empty: {
    backgroundColor: 'transparent',
    height: 10,
  },
  boxwrap: {
    flexDirection: 'column',
    marginTop: -10,
    flex: 1,
  },
  boxwraphover: {
    flexDirection: 'column',
    marginTop: -10,
    flex: 1,
  },
  box: {
    flex: 1,
    backgroundColor: Skin.colors.DARK_PRIMARY,
  },
  boxhover: {
    backgroundColor: Skin.colors.PRIMARY,
    flex: 1,
  },
  wrap: {
    flexDirection: 'row',
    height: 80,
  },
  icon: {
    fontFamily: 'icomoon',
    fontSize: 30,
    paddingTop: 15,
    color: Skin.colors.TEXT_COLOR,
    flex: 2,
    textAlign: 'center',

  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Skin.colors.TEXT_COLOR,
    flex: 1,
    textAlign: 'center',
  }
});
