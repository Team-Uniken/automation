import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import Skin from '../../Skin';



class BottomMenu extends Component {

  constructor(props) {
    super(props);
    //console.log(props);
    this.state = {
      visible: this.props.bottomMenu.visible,
      active: this.props.bottomMenu.active,
    };
  }


  buildboxes(active) {
    var buildout = [];
    for (let i = 1; i < 4; i++) {
      let hover = false
      if (active == i) {
        hover = true
      }
      buildout.push(
        <View
          key={'menu_' + i}
          style={Skin.layout3.botmenu.boxwrap}>
          <View style={hover ? Skin.layout3.botmenu.bar.hover : Skin.layout3.botmenu.bar.nohover}>
          </View>
          <TouchableHighlight
            style={hover ? Skin.layout3.botmenu.box.hover : Skin.layout3.botmenu.box.nohover}
            underlayColor={Skin.layout3.botmenu.box.underlay}
            onPress={() => this.handleClick(i)}>
            <View style={Skin.layout3.botmenu.inboxwrap}>
              <Text style={[Skin.layout3.botmenu.icon, {
                             color: hover ? Skin.layout3.botmenu.color.hover : Skin.layout3.botmenu.color.nohover
                           }]}>
                {this.props.list[i].icon}
              </Text>
              <Text style={[Skin.layout3.botmenu.title, {
                             color: hover ? Skin.layout3.botmenu.color.hover : Skin.layout3.botmenu.color.nohover
                           }]}>
                {this.props.list[i].title}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
    return buildout;
  }

  handleClick(i) {
    this.props.navigator.push({
      id: this.props.list[i].link
    });
  }

  render() {
    if (this.state.visible) {
      return (
        <View style={Skin.layout3.botmenu.wrap}>
          {this.buildboxes(this.state.active)}
        </View>
        );
    }
    return null;
  }
}


BottomMenu.propTypes = {
  list: PropTypes.object,
  active: PropTypes.number,
  navigator: PropTypes.object,
};
BottomMenu.defaultProps = {
  list: {
    1: {
      icon: '\ue227',
      title: 'DEALS',
      link: 'Screen_3_1_deals',
    },
    2: {
      icon: '\ue8b3',
      title: 'HISTORY',
      link: 'Screen_3_2_history',
    },
    3: {
      icon: '\ue8b4',
      title: 'LOCATIONS',
      link: 'Screen_3_3_locations',
    }
  },
  active: 1
};

module.exports = BottomMenu;
