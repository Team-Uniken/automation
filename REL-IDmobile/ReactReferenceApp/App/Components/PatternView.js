var ReactNative = require('react-native');
var React = require('react');
var {
  requireNativeComponent,
  UIManager,
  View,
} = ReactNative;

const{PropTypes,Component} = React;

var RCTPatternView = requireNativeComponent('RCTPatternView', PatternView, {
  nativeOnly: { onChange: true }
});
// var iface = {
//   name: 'PatternView',
//   propTypes: {
//     pathColor: PropTypes.string,
//     circleColor: PropTypes.string,
//     dotColor: PropTypes.string,
//     gridRows: PropTypes.string,
//     gridColumns: PropTypes.string,
//     ...View.propTypes,
//   },
// };

class PatternView extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    console.log('Pattern = ' + event.nativeEvent.text);

    if (!this.props.onGetPattern) {
      return;
    }

    this.props.onGetPattern({
      pattern: event.nativeEvent.text,
      size:event.nativeEvent.size,
    });

    this.clearPattern = this.clearPattern.bind(this);
    this.getPatternString = this.getPatternString.bind(this);
    this.disableInput = this.disableInput.bind(this);
    this.enableInput =this.enableInput.bind(this);
  }

  render() {
    return (<RCTPatternView {...this.props} onChange={this.onChange}/>);
  }

  enableInput(){
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.RCTPatternView.Commands.enableInput,
      [],
    );
  }

  disableInput(){
     UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.RCTPatternView.Commands.disableInput,
      [],
    );
  }

  getPatternString() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.RCTPatternView.Commands.getPatternString,
      [],
    );
  }

  clearPattern(){
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.RCTPatternView.Commands.clearPattern,
      [],
    );
  }
}

PatternView.propTypes = {
  pathColor: PropTypes.string,
  circleColor: PropTypes.string,
  dotColor: PropTypes.string,
  gridRows: PropTypes.string,
  gridColumns: PropTypes.string,
  enablePatternDetection:PropTypes.bool,
  ...View.propTypes,
};

module.exports = PatternView;
