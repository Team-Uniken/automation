
import React, { Component, } from 'react';
import { ReactNative, View, Modal, Image, Text } from 'react-native';

import Finger from 'react-native-touch-id-android'
import Skin from '../../Skin';
import Config from 'react-native-config';

export default class AndroidTouch extends Component {

    constructor(props) {
        super(props);
        this.state = { isSensorAvailable: false }; 
    }

    render() {
        return (
            <View style={Skin.layout0.wrap.modalContainer}>
                
                <Image
                    style={{ width: 50, height: 50 }}
                    source={require('../../img/imgFingerPrint.png')} />
                <View style={Skin.layout0.wrap.connectionTypeContainer}>
                    <Text style={Skin.layout0.wrap.connectionType}>
                            {this.props.msg != undefined ? this.props.msg : "Set up TouchID to Log In" }
                    </Text>
                </View>
            </View>
        )
    }

}