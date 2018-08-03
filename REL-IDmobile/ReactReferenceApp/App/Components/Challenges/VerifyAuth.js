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
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';

const Constants = require('../Utils/Constants');


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
            selectedOption : 0,
        selectedOptionText: this.props.url.chlngJson.chlng_info[0].value,
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

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            Events.trigger('showPreviousChallenge');
            return true;
        }.bind(this));
    }

    submit() {
        //alert(`Selected index: ${this.state.selectedOption}`);
        //return;

        var responseJson = this.props.url.chlngJson;
        if (this.state.selectedOption == 0) {
            Constants.USER_T0 = 'YES';
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
        if(index===0){
            if(this.props.url.chlngJson.chlng_info && 
                this.props.url.chlngJson.chlng_info.length > 0 &&
                this.props.url.chlngJson.chlng_info[0].value.length > 0){

                    this.setState({ selectedOptionText:this.props.url.chlngJson.chlng_info[0].value});
                }
        }else{
            if(this.props.url.chlngJson.chlng_info && 
                this.props.url.chlngJson.chlng_info.length > 1 &&
                this.props.url.chlngJson.chlng_info[1].value.length > 0){
            
                    this.setState({ selectedOptionText:this.props.url.chlngJson.chlng_info[1].value});
                }
        }
      }

    render() {
        return (
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
                            <Text style={[Skin.layout1.content.top.text, { marginBottom: 8 }]}> New Device Activation</Text>
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
                                    <Text style={{color:'grey',marginTop:5,marginLeft:20,marginRight:20,alignSelf:'center',textAlign:'center'}}>{this.state.selectedOptionText} </Text>
                                </View>
                                <View
                                    style={Skin.layout1.bottom.wrap}>
                                    <View style={Skin.layout1.bottom.container}>
                                        <Margin
                                            space={20} />
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


