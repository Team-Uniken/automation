
import React, { Component, } from 'react';
import { ReactNative, View, Modal, Image, Text } from 'react-native';

import Finger from 'react-native-touch-id-android'
import Skin from '../../Skin';

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
                        Touch sensor to verify your identity
                    </Text>
                </View>
            </View>
        )
    }

}