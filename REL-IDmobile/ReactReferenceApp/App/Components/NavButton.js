import Skin from '../Skin';
import React from 'react-native';
const {
  Component,
  Image,
  TouchableOpacity,
  Text,
  View,
  PropTypes,
  StyleSheet,
} = React;

export default class NavButton extends Component {

  render() {
    const { icon, title, tint, iconStyle, textStyle, handler, left} = this.props;
    if (left){
      return (
        <TouchableOpacity style={styles.navBarButton} onPress={handler}>
          <View style={styles.navBarButtonTextWrap}>
            <Text style={[styles.navBarButtonIcon,{color:tint,marginLeft:-5},iconStyle]}>{icon}</Text>
            <Text style={[styles.navBarButtonText,{color:tint},textStyle]}>{title}</Text>
          </View>
        </TouchableOpacity>
      );
    }else{
      return (
        <TouchableOpacity style={styles.navBarButton} onPress={handler}>
          <View style={styles.navBarButtonTextWrap}>
            <Text style={[styles.navBarButtonText,{color:tint},textStyle]}>{title}</Text>
            <Text style={[styles.navBarButtonIcon,{color:tint},iconStyle]}>{icon}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }
  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    title: PropTypes.string,
    icon: PropTypes.string,
    tint: PropTypes.string,
    left: PropTypes.bool,
  };
  static defaultProps = {
    style: {},
    title: '',
    icon: '',
    tint: '#000000',
    left: true,
  };
}


const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;

var styles = StyleSheet.create({
  navBarContainer: {
    backgroundColor: 'white',
  },
  navBarButtonTextWrap:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  navBarButtonText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  navBarButtonIcon: {
    fontSize: 42,
    fontWeight: '200',
    width: 33,
    letterSpacing: 0.2,
    fontFamily: Skin.font.ICON_FONT,
  },
  navBarTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: '#333',
    fontWeight: '500',
  },
});
