/*
 *Provide checkbox for nexttime login like with facebook, pattern, touchid.
 defaultLogin, rememberuser etc.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';
import { NavigationActions } from 'react-navigation';
/*
 Required for this js
 */
import { Text, View, ScrollView, StatusBar, DeviceEventEmitter, AsyncStorage, Alert, AlertIOS, Platform, BackHandler, } from 'react-native';
import Events from 'react-native-simple-events';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import TouchID from 'react-native-touch-id';
import ModalPicker from 'react-native-modal-picker'
import { NativeModules, NativeEventEmitter } from 'react-native';


/*
 Use in this js
 */
import Skin from '../../Skin';
import MainActivation from '../../Components/Container/MainActivation';
import Main from '../../Components/Container/Main';
import Util from "../../Components/Utils/Util";
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const onUpdateChallengeStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);

/*
 Custome View
 */
import Title from '../../Components/view/title';
import Button from '../../Components/view/button';
import Checkbox from '../../Components/view/checkbox';
import Input from '../../Components/view/input';
import Margin from '../../Components/view/margin';

/*
  INSTANCES
 */

let subscriptions;



var obj;
let onUpdateChallengeStatusSubscription;
class VerifyAuth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verify_auth: false,
            enterprise_register: false,

        };
        this.close = this.close.bind(this);
        this.submit = this.submit.bind(this);
    }
    /*
    This is life cycle method of the react native component.
    This method is called when the component will start to load
    */
    componentWillMount() {
        Events.trigger('hideLoader', true);
        obj = this;
    }
    //on press of close button it navigate to dashboard without saveing the recent change.
    close() {
        Events.trigger('showPreviousChallenge');
    }

    selectVerifyAuth() {
        if (this.state.verify_auth == true) {
            this.setState({ verify_auth: false });
        } else {
            this.setState({ verify_auth: true, enterprise_register: false });
        }
    }

    selectEnterpriseRegister() {
        if (this.state.enterprise_register == true) {
            this.setState({ enterprise_register: false });
        } else {
            this.setState({ enterprise_register: true, verify_auth: false });
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            return true;
        }.bind(this));
    }

    submit() {

        if(this.state.verify_auth == false && this.state.enterprise_register ==false){
                alert("Please select registration option");
            return;
        }


        var responseJson = this.props.url.chlngJson;
        if (this.state.verify_auth == true) {
            responseJson.chlng_resp[0].response = 'true';
            Events.trigger('showNextChallenge', { response: responseJson });
            return;
        }

        if (this.enterprise_register == true) {
            Events.trigger("forgotPassowrd");
        }
    }


    render() {
        var indents = [];
     
        indents.push(
            <Checkbox
                onSelect={this.selectEnterpriseRegister.bind(this)}
                selected={this.state.enterprise_register}
                labelSide={"right"}>
                Enterprise Registration
      </Checkbox>
        );

        indents.push(
            <Checkbox
                onSelect={this.selectVerifyAuth.bind(this)}
                selected={this.state.verify_auth}
                labelSide={"right"}>
                REL-ID Verify Authentication
      </Checkbox>
        );

        return (
            <MainActivation>
                <View style={Skin.layout0.wrap.container}>
                    <StatusBar
                        style={Skin.layout1.statusbar}
                        backgroundColor={Skin.main.STATUS_BAR_BG}
                        barStyle={'default'}
                    />
                    <View style={Skin.layout1.title.wrap}>
                        <Title onClose={() => { this.close(); }}
                        >Registration</Title>
                    </View>
                    <ScrollView style={Skin.layout1.content.scrollwrap}>
                        <View style={Skin.layout1.content.wrap}>
                            <View style={Skin.layout1.content.container}>
                            <Margin
                                    space={10} />
                                {indents}
                                <Margin
                                    space={4} />
                            </View>
                        </View>
                    </ScrollView>
                    <View
                        style={Skin.layout1.bottom.wrap}>
                        <View style={Skin.layout1.bottom.container}>
                            <Button
                                label={Skin.text['1']['1'].submit_button}
                                onPress={this.submit.bind(this)}
                            />
                        </View>
                    </View>
                    <KeyboardSpacer topSpacing={-55} />
                </View >

            </MainActivation>
        );
    }
}

module.exports = VerifyAuth;


