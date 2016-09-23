'use strict';
/*
  NEED
 */
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Main';

/*
  Instantiaions
*/
const {
  View,
  Text,
} = ReactNative;

const{Component}=React;


export default class DepositsScene extends Component {

  render () {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: false,
        }}
        navBar={{
          title: 'Deposits',
          visible: true,
          tint: Skin.colors.TEXT_COLOR,
          left:{
            text: '',
            icon: '\ue20e',
            iconStyle: {
              fontSize: 30,
              marginLeft: 8,
            },
            textStyle: {},
          },
        }}
        bottomMenu={{
          visible: true,
          active: 3,
        }}
        navigator={this.props.navigator}
      >
        <View
          style={{
            flex:1,
            backgroundColor: Skin.colors.TEXT_COLOR,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              //backgroundColor: 'red',
              fontSize: 30,
              color: Skin.colors.PRIMARY,
              fontWeight: 'bold',
              alignItems: 'center',
            }}
          >
            Photo Deposit Feature Coming Soon!
          </Text>
        </View>
      </Main>
    );
  }
}

module.exports = DepositsScene;
