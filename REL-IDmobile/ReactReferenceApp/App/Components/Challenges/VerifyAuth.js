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
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'


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
            selectedOption : 0

        };
        this.close = this.close.bind(this);
        this.onSelect = this.onSelect.bind(this);
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
        //alert(`Selected index: ${this.state.selectedOption}`);

        //return;
        var responseJson = this.props.url.chlngJson;
        if (this.state.selectedOption == 0) {
            responseJson.chlng_resp[0].response = 'true';
            Events.trigger('showNextChallenge', { response: responseJson });
            return;
        }

        if (this.state.selectedOption == 1) {
            Events.trigger("forgotPassowrd");
        }
    }
    onSelect(index, value){
       // alert(`Selected index: ${index} , value: ${value}`);
       this.state.selectedOption = index;
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
            /*{<MainActivation>
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
                        <View style={[Skin.layout1.content.wrap, { justifyContent: "center", alignItems: 'center' }]}>
                            <View style={Skin.layout1.content.container}>
                                <Margin
                                    space={45} />
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

            </MainActivation>}*/
            <MainActivation>
                <View style={[Skin.layout0.wrap.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}  >
                    <StatusBar
                        style={Skin.layout1.statusbar}
                        backgroundColor={Skin.main.STATUS_BAR_BG}
                        barStyle={'default'} />
                    <View style={Skin.layout1.title.wrap}>
                        <Title onClose={() => {
                            this.close();
                        }}>Registration
                           </Title>
                    </View>
                    <View style={[Skin.layout1.wrap, { flex: 1 }, { justifyContent: 'center', alignItems: 'center' }]}>


                        <View style={[{ height: 500, justifyContent: 'center', alignItems: 'center' }]}>

                            <Text style={[Skin.layout0.top.icon]}>
                                {Skin.icon.logo}
                            </Text>
                            <Text style={Skin.layout0.top.subtitle}>Please select option for</Text>
                            <Text style={[Skin.layout1.content.top.text, { marginBottom: 8 }]}> Secondary Device Activation</Text>
                            <ScrollView style={Skin.layout1.content.scrollwrap}>
                                <View style={[Skin.layout1.content.wrap, { justifyContent: "center", alignItems: 'center' }]}>
                                    <View style={Skin.layout1.content.container}>
                                        <Margin
                                            space={20} />
                                        <RadioGroup
                                            onSelect={(index, value) => this.onSelect(index, value)}
                                            selectedIndex ={this.state.selectedOption}
                                        >
                                            <RadioButton value={'item1'} >
                                                <Text>REL-ID Verify Authentication</Text>
                                            </RadioButton>

                                            <RadioButton value={'item2'}>
                                                <Text>Enterprise Registration</Text>
                                            </RadioButton>
                                        </RadioGroup>
                                        <Margin
                                            space={4} />
                                    </View>
                                </View>
                                <View
                                    style={Skin.layout1.bottom.wrap}>
                                    <View style={Skin.layout1.bottom.container}>
                                        <Margin
                                            space={10} />
                                        <Button
                                            label={Skin.text['1']['1'].submit_button}
                                            onPress={this.submit.bind(this)}
                                        />
                                    </View>
                                </View>
                            </ScrollView>


                        </View>

                    </View>
                </View>
            </MainActivation>
        );
    }
}

module.exports = VerifyAuth;


