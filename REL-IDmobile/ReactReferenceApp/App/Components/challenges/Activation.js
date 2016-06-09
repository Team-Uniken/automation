'use strict';

/*
  NEEDED
*/
import React  from 'react-native'
import Skin   from '../../Skin'
/*
  CALLED
*/
import Main   from '../Main'


/* 
  Instantiaions
*/
var {
  View,
  Text,
  Navigator,
} = React

export default class ActivationScene extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <Main 
        drawerState={{
          open: false, 
          disabled: false
        }}
        navBar={{
                    title: 'Contact',
                    visible: true,
                    tint: Skin.colors.TEXT_COLOR,
                    left:{
                        text: '',
                        icon: '\ue20e',
                        iconStyle: {
                            fontSize:30,
                            marginLeft:8,
                        },
                        textStyle:{},
                    }
                }}
            bottomMenu={{
              visible: true,
              active: 5,
            }}
            navigator={this.props.navigator}
      >
        <View style={{flex:1,backgroundColor:Skin.colors.BACK_GRAY}}>
          <Text>This is my challenges content</Text>
        </View>
      </Main>
    );
  }
}

//module.exports = ActivationScene;