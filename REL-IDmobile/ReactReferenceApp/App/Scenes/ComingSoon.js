/**
 * Just A simple text UI to show this feature is coming soon. 
 */
'use strict';

/*
 ALWAYS NEED
 */
import ReactNative from 'react-native';
import React, { Component, } from 'react';

/*
 Required for this js
 */
import {View, Text, } from 'react-native'


/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';


export default class ComingSoonScene extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }
    /*
  This method is used to render the componenet with all its element.
*/
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
                        icon: '',
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
                        flex: 1,
                        backgroundColor: Skin.colors.TEXT_COLOR,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 15,
                    }}
                    >
                    <Text
                        style={{
                            textAlign: 'center',
                            alignSelf: 'center',
                            fontSize: 30,
                            color: Skin.PLACEHOLDER_TEXT_COLOR_RGB,
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