/*
 *Custome Title Component.
 *it is a simple row with title text in middle and cross on left side.
 */

/*
 *ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';
import NavBar from './navbar.js';

/*
 Required for this js
 */
import { Text, View, } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';


 
class PageTitle extends Component {
  render() {
    return (
   
     <View style={{height:107}}>
           <NavBar
            tintColor={'#fff'}
            statusBarTint={Skin.STATUS_BAR_TINT_COLOUR}
            statusBarLight={'light-content'}
            titleStyle={Skin.navbar.title.titleStyle}
            title={Skin.icon.logo}
            titleTint={'#146cc0'}
            right={''}
            left={{
              icon: Skin.icon.hamburger,
              iconStyle: {
                fontSize: 35,
                paddingLeft: 17,
                width: 100,
                color: '#146cc0',
              },
              handler:this.props.handler
            }} />
        <Text style={Skin.navbar.title.titleText}>
          {this.props.title}
              </Text>
     </View>

     );
  }
}
module.exports = PageTitle;