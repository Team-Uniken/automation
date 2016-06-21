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

export default class ComingSoonScene extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props);
    }
    render() {
        return (
            <Main
                drawerState={{
                    open: false,
                    disabled: true,
                }}
                navBar={{
                  title: this.props.title || 'Coming Soon',
                  visible: true,
                  tint: Skin.colors.TEXT_COLOR,
                  left: {
                    text: 'Back',
                    icon: 'x',
                    iconStyle: {},
                    textStyle: {},
                    handler: this.props.navigator.pop
                  },
                }}
                bottomMenu={{
                    visible: false,
                    active: 3,
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
                        padding:15,
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            alignSelf: 'center',
                            fontSize: 30,
                            color: Skin.colors.PRIMARY,
                            fontWeight: 'bold',
                            alignItems: 'center',
                        }}
                    >
                        {this.props.title} Feature Coming Soon!
                    </Text>
                </View>
            </Main>
        );
    }
}

module.exports = ComingSoonScene;