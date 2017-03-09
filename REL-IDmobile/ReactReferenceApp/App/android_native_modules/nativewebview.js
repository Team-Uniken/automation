var React = require('react');
var ReactNative = require('react-native');
var invariant = require('invariant');
var keyMirror = require('keymirror');
var merge = require('merge');
var resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

var {
  ReactNativeViewAttributes,
  UIManager,
  EdgeInsetsPropType,
  StyleSheet,
  Text,
  View,
  WebView,
  requireNativeComponent,
  DeviceEventEmitter,
  NativeModules: {
    WebViewBridgeManager
  }
} = ReactNative;

const {PropTypes, Component} = React;

var RCT_WEBVIEWBRIDGE_REF = 'webviewbridge';

var WebViewBridgeState = keyMirror({
  IDLE: null,
  LOADING: null,
  ERROR: null,
});

/**
 * Renders a native WebView.
 */
class WebViewBridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: WebViewBridgeState.IDLE,
      lastErrorEvent: null,
      startInLoadingState: true,
    };

    this.goForward = this.goForward.bind(this);
    this.goBack = this.goBack.bind(this);
    this.reload = this.reload.bind(this);
    this.sendToBridge = this.sendToBridge.bind(this);
    this.injectBridgeScript = this.injectBridgeScript.bind(this);
    this.updateNavigationState = this.updateNavigationState.bind(this);
    this.getWebViewBridgeHandle = this.getWebViewBridgeHandle.bind(this);
    this.onLoadingStart = this.onLoadingStart.bind(this);
    this.onLoadingError = this.onLoadingError.bind(this);
    this.onLoadingFinish = this.onLoadingFinish.bind(this);
    this.clear = this.clear.bind(this);
    //this.onChange= this.onChange.bind(this);
  }

  componentWillMount() {
    DeviceEventEmitter.addListener("webViewBridgeMessage", (body) => {
      const { onBridgeMessage } = this.props;
      const message = body.message;
      if (onBridgeMessage) {
        onBridgeMessage(message);
      }
    });

    if (this.props.startInLoadingState) {
      this.setState({ viewState: WebViewBridgeState.LOADING });
    }
  }

  render() {
    var otherView = null;

    if (this.state.viewState === WebViewBridgeState.LOADING) {
      otherView = this.props.renderLoading && this.props.renderLoading();
    } else if (this.state.viewState === WebViewBridgeState.ERROR) {
      var errorEvent = this.state.lastErrorEvent;
      otherView = this.props.renderError && this.props.renderError(
        errorEvent.domain,
        errorEvent.code,
        errorEvent.description);
    } else if (this.state.viewState !== WebViewBridgeState.IDLE) {
      console.error('RCTWebViewBridge invalid state encountered: ' + this.state.loading);
    }

    var webViewStyles = [styles.container, this.props.style];
    if (this.state.viewState === WebViewBridgeState.LOADING ||
      this.state.viewState === WebViewBridgeState.ERROR) {
      // if we're in either LOADING or ERROR states, don't show the webView
      webViewStyles.push(styles.hidden);
    }
    else {
      webViewStyles.push(styles.visible);
    }

    var {javaScriptEnabled, domStorageEnabled} = this.props;
    if (this.props.javaScriptEnabledAndroid) {
      console.warn('javaScriptEnabledAndroid is deprecated. Use javaScriptEnabled instead');
      javaScriptEnabled = this.props.javaScriptEnabledAndroid;
    }
    if (this.props.domStorageEnabledAndroid) {
      console.warn('domStorageEnabledAndroid is deprecated. Use domStorageEnabled instead');
      domStorageEnabled = this.props.domStorageEnabledAndroid;
    }

    let {source, ...props} = {...this.props };

    var webView =
      <RCTWebViewBridge
        ref={RCT_WEBVIEWBRIDGE_REF}
        key="webViewKey"
        {...props}
        proxy={this.props.proxy}
        source={resolveAssetSource(source) }
        style={webViewStyles}
        webViewClient={null}
        onLoadingError={this.onLoadingError}
        onLoadingStart={this.onLoadingStart}
        />;

    return (
      <View style={styles.container}>
        {webView}
        {otherView}
      </View>
    );
  }

  goForward() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewBridgeHandle(),
      UIManager.RCTWebViewBridge.Commands.goForward,
      null
    );
  }

  goBack() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewBridgeHandle(),
      UIManager.RCTWebViewBridge.Commands.goBack,
      [],
    );
  }

  reload() {
    if(this.state.viewState ===  WebViewBridgeState.ERROR){
      this.clear();
    }

    this.setState({
      viewState: WebViewBridgeState.IDLE
    }, () => {
      UIManager.dispatchViewManagerCommand(
        this.getWebViewBridgeHandle(),
        UIManager.RCTWebViewBridge.Commands.reload,
        null
      );
    });
  }

  clear(){
     UIManager.dispatchViewManagerCommand(
      this.getWebViewBridgeHandle(),
      UIManager.RCTWebViewBridge.Commands.clear,
      []
    );
  }

  sendToBridge(message) {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewBridgeHandle(),
      UIManager.RCTWebViewBridge.Commands.sendToBridge,
      [message]
    );
  }

  injectBridgeScript() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewBridgeHandle(),
      UIManager.RCTWebViewBridge.Commands.injectBridgeScript,
      null
    );
  }

  updateNavigationState(event) {
    if (this.props.onNavigationStateChange) {
      this.props.onNavigationStateChange(event.nativeEvent);
    }
  }

  getWebViewBridgeHandle() {
    return ReactNative.findNodeHandle(this.refs[RCT_WEBVIEWBRIDGE_REF]);
  }

  onLoadingStart(event) {
    this.injectBridgeScript();
    var onLoadStart = this.props.onLoadStart;
    onLoadStart && onLoadStart(event);
    this.updateNavigationState(event);
  }

  onLoadingError(event) {
    this.clear();
    event.persist(); // persist this event because we need to store it
    var {onError, onLoadEnd} = this.props;
    onError && onError(event);
    onLoadEnd && onLoadEnd(event);
    
    this.setState({
      lastErrorEvent: event.nativeEvent,
      viewState: WebViewBridgeState.ERROR
    });
  }

  onLoadingFinish(event) {
    var {onLoad, onLoadEnd} = this.props;
    onLoad && onLoad(event);
    onLoadEnd && onLoadEnd(event);
    this.setState({
      viewState: WebViewBridgeState.IDLE,
    });
    this.updateNavigationState(event);
  }

  // onChange(event) {
  //   if (event.nativeEvent.name === "onReceivedError")
  //     this.onLoadingError(event);
  //   else if (event.nativeEvent.name === "onPageFinished")
  //     this.onLoadingFinish(event);
  //   else if(event.nativeEvent.name === "onPageStarted")
  //     this.onLoadingStart(event);
  // }
}

WebViewBridge.propTypes = {
  /**
   * Will be called once the message is being sent from webview
   */
  onBridgeMessage: PropTypes.func,
  /**
  * Sets the proxy for this WebView. 
  */
  proxy: PropTypes.object,
  webViewClient: PropTypes.object,
  ...WebView.propTypes,
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1
  },
});

var RCTWebViewBridge = requireNativeComponent('RCTWebViewBridge', WebViewBridge);

module.exports = WebViewBridge;
