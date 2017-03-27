/**
 *  return platform specific webview.
 */

'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Communications from 'react-native-communications';
import Config from 'react-native-config'

/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';
import WebViewAndroid from '../android_native_modules/nativewebview';
import {Platform, StyleSheet, Text, TouchableOpacity, View, WebView, } from 'react-native'
import { NativeModules, NativeEventEmitter } from 'react-native'
/*
  INSTANCES
 */
const WEBVIEW_REF = 'webview';
const DEFAULT_URL = 'http://www.google.com';

let onResumeCompletedSubscription = null;
const onResumeCompletedModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);

export default class Web extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url || DEFAULT_URL,
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      error:false,
      scalesPageToFit: this.props.scale || true,
    };

    this.close = this.close.bind(this);
    this.onResume = this.onResume.bind(this);
    this.onError = this.onError.bind(this);

    if (this.props.secure) {
      if (onResumeCompletedSubscription) {
        onResumeCompletedSubscription.remove();
        onResumeCompletedSubscription = null;
      }

      onResumeCompletedSubscription = onResumeCompletedModuleEvt.addListener('onResumeCompleted', this.onResume);
    }
  }
  /**
     *This is life cycle method of the react native component.
     *This method is called when the component will start to load
     */
  componentWillMount() {
    console.log('************ Component Will Mount');
  }

  /**
   * Returns the back and forward button of the toolbar if navigation is allowed
   * @return {[type]} [description]
   */
  renderBottomBar() {
    if (this.props.navigate) {
      return (
        <View style={[styles.addressBarRow]}>
          <TouchableOpacity
            onPress={this.goBack.bind(this) }
            style={this.state.backButtonEnabled ? styles.navButton : styles.disabledButton}>
            <Text style={this.state.backButtonEnabled ? styles.navButtonText : styles.disabledButtonText}>
              {'<'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.goForward.bind(this) }
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

  close() {
    if (onResumeCompletedSubscription) {
        onResumeCompletedSubscription.remove();
        onResumeCompletedSubscription = null;
    }
    this.props.navigator.pop();
  }

  onResume() {
    if(this.state.error === true){
      this.state.error = false;
      this.reload();
    }
  }

  onError(event){
    this.state.error = true;
  }

  //Return platform specific webview.
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
          onNavigationStateChange={this.onNavigationStateChange.bind(this) }
          onLoad={() => { console.log('loaded') } }
          onError={this.onError}
          scalesPageToFit={this.state.scalesPageToFit}
          />
      );
    } else {

      if (!this.props.secure) {
        return (
          <WebViewAndroid
            ref={WEBVIEW_REF}
            automaticallyAdjustContentInsets={false}
            style={styles.webView}
            source={{ uri: this.state.url }}
            javaScriptEnable
            domStorageEnabled
            decelerationRate="normal"
            //onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            onLoad={() => { console.log('loaded') } }
            scalesPageToFit={this.state.scalesPageToFit}
            javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
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
            onNavigationStateChange={this.onNavigationStateChange.bind(this) }
            onLoad={() => { console.log('loaded') } }
            webViewClient={{ params: null }}
            scalesPageToFit={this.state.scalesPageToFit}
            onError={this.onError}
            proxy={{ host: "127.0.0.1", port: this.props.proxy }}
            javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
            />
        );
      }
    }
  }
  /*
    This method is used to render the componenet with all its element.
  */
  render() {
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
            icon: '',
            iconStyle: {},
            textStyle: {},
            handler: this.close,
          },
        }}
        bottomMenu={{
          visible: false,
        }}
        navigator={this.props.navigator}
        >
        <View style={{ backgroundColor: Skin.colors.BACK_GRAY, flex: 1 }}>
          {this.getWebView() }
          {this.renderBottomBar() }
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
    if (!this.props.secure) {
      //this.props.navigator.pop();
      //Communications.web(this.props.url);
    }
    
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
  webView: {
    backgroundColor: Skin.colors.BACK_GRAY,
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
  navButtonText: {
    fontSize: 20,
    color: Config.THEME_COLOR,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    fontSize: 20,
    color: Config.THEME_COLOR,
    opacity:0.65,
    fontWeight: 'bold',
  },

});
