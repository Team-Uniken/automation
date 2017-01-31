'use strict';

import ReactNative from 'react-native';
import React from 'react';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Container/Main';

/*
  Instantiaions
*/
const {
  View,
  Text,
} = ReactNative;

const{Component} =  React;

export default class AppointmentsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pop: () => {
        this.props.navigator.pop();
      },
    };
  }
  render() {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: false,
        }}
        navBar={{
          title: 'Appointments',
          visible: true,
          tint: Skin.colors.TEXT_COLOR,
          left: {
            text: 'Back',
            icon: '',
            iconStyle: {},
            textStyle: {},
            handler: this.props.navigator.pop
          },
        }}
        bottomMenu={{
          visible: true,
          active: 5,
        }}
        navigator={this.props.navigator}
      >
        <View 
          style={{
              flex:1,
              backgroundColor:Skin.colors.TEXT_COLOR,
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
              Appointments Feature Coming Soon!
          </Text>
      </View>
      </Main>
    );
  }
}

module.exports = AppointmentsScene;
