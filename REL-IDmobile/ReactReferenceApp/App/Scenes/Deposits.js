'use strict';
/*
    NEED
 */
import React from 'react-native';
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
} = React;


export default class PayBillsScene extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <Main
                drawerState={{
                    open: false,
                    disabled: false
                }}
                navBar={{
                    title: 'Deposits',
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
                    active: 3,
                }}
                navigator={this.props.navigator}
            >
                <View style={{flex:1,backgroundColor:Skin.colors.BACK_GRAY,width:Skin.SCREEN_WIDTH}}>
                    <Text>This is my Deposits content</Text>
                </View>
            </Main>
        );
    }
}
