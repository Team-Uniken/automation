'use strict';

import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Main';

const {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
  WebViewAndroid,
} = React;

const WEBVIEW_REF = 'webview';
//var DEFAULT_URL = 'http://wiki.uniken.com';
const DEFAULT_URL = 'http://www.google.com';


export default class Web extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      url:  this.props.url || DEFAULT_URL,
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: this.props.scale || true,
    };
  }

  /**
   * Returns the back and forward button of the toolbar if navigation is allowed
   * @return {[type]} [description]
   */
  renderBottomBar() {
    if (this.props.navigate){
      return (
        <View style={[styles.addressBarRow]}>
          <TouchableOpacity
            onPress={this.goBack.bind(this)}
            style={this.state.backButtonEnabled ? styles.navButton : styles.disabledButton}>
            <Text style={this.state.backButtonEnabled ? styles.navButtonText : styles.disabledButtonText}>
               {'<'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.goForward.bind(this)}
            style={this.state.forwardButtonEnabled ? styles.navButton : styles.disabledButton}>
            <Text style={this.state.forwardButtonEnabled ? styles.navButtonText : styles.disabledButtonText}>
              {'>'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  getWebView() {
    if (Platform.OS === 'ios') {
      return (
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{ uri: this.state.url }}
          javaScriptEnable
          domStorageEnabled
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          onLoad={()=>{console.log('loaded')}}
          scalesPageToFit={this.state.scalesPageToFit}
        />
      );
    } else {
      return (
        <WebViewAndroid
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{ uri: this.state.url }}
          javaScriptEnable
          domStorageEnabled
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          onLoad={()=>{console.log('loaded')}}
          scalesPageToFit={this.state.scalesPageToFit}
          source={this.props.source}
          proxy={this.props.proxy}
          javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
        />
      );
    }
  }

  render() {
    console.log(this.props)
    return (
      <Main
        drawerState={{
          open: false,
          disabled: true,
        }}
        navBar={{
          title: this.props.title,
          visible: true,
          tint: Skin.colors.TEXT_COLOR,
          left: {
            text: 'Back',
            icon: 'x',
            iconStyle: {},
            textStyle: {},
            handler: this.props.navigator.pop,
          },
        }}
        bottomMenu={{
          visible: false,
        }}
        navigator={this.props.navigator}
      >
        <View style={{backgroundColor:Skin.colors.BACK_GRAY,flex:1}}>
          {this.getWebView()}
          {this.renderBottomBar()}
        </View>
      </Main>
    );
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

  onShouldStartLoadWithRequest(event) {
    return true;
  }

  onNavigationStateChange(navState) {
    console.log('navstatechange');
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: this.state.scalesPageToFit,
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressBarRow: {
    flexDirection: 'row',
    backgroundColor: Skin.colors.PRIMARY,
  },
  webView:{
    backgroundColor: 'red',
  },
  navButton: {
    width: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabledButton: {
    width: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  navButtonText:{
    fontSize: 20,
    color: Skin.colors.TEXT_COLOR,
    fontWeight: 'bold',
  },
  disabledButtonText:{
    fontSize: 20,
    color: 'rgba(' + Skin.colors.TEXT_COLOR_RGB + ', 0.3)',
    fontWeight: 'bold',
  },

});