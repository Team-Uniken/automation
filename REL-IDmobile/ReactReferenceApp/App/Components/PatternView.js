var React = require('react-native');
var {
  PropTypes,
  requireNativeComponent,
  UIManager,
  View,
} = React;

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

class PatternView extends React.Component {
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
  }

  render() {
    return (<RCTPatternView {...this.props} onChange={this.onChange}/>);
  }

  enableInput(){
    UIManager.dispatchViewManagerCommand(
      React.findNodeHandle(this),
      UIManager.RCTPatternView.Commands.enableInput,
      [],
    );
  }

  disableInput(){
     UIManager.dispatchViewManagerCommand(
      React.findNodeHandle(this),
      UIManager.RCTPatternView.Commands.disableInput,
      [],
    );
  }

  getPatternString() {
    UIManager.dispatchViewManagerCommand(
      React.findNodeHandle(this),
      UIManager.RCTPatternView.Commands.getPatternString,
      [],
    );
  }

  clearPattern(){
    UIManager.dispatchViewManagerCommand(
      React.findNodeHandle(this),
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
