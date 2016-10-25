
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Title from '../view/title';
import Button from '../view/button';
import CheckBox from '../view/checkbox';
import Input from '../view/input';
import Margin from '../view/margin';
import KeyboardSpacer from 'react-native-keyboard-spacer';



const {
      Text,
      View,
      ScrollView,
      StatusBar,
} = ReactNative;
const {Component} = React;

class Register extends Component {

      constructor(props) {
            super(props);
            this.state = {
                  device: '',
                  touchid: '',
                  wechat: '',
                  rememberusername: '',
                  welcomescreen: '',

            };
      }

      selectdevice() {
            if (this.state.device.length == 0) {
                  this.setState({ device: '\u2714' });
            } else {
                  this.setState({ device: '' });
            }
      }
      selecttouchid() {
            if (this.state.touchid.length == 0) {
                  this.setState({ touchid: '\u2714' });
            } else {
                  this.setState({ touchid: '' });
            }
      }
      selectwechat() {
            if (this.state.wechat.length == 0) {
                  this.setState({ wechat: '\u2714' });
            } else {
                  this.setState({ wechat: '' });
            }
      }
      selectrememberusername() {
            if (this.state.rememberusername.length == 0) {
                  this.setState({ rememberusername: '\u2714' });
            } else {
                  this.setState({ rememberusername: '' });
            }
      }
      selectwelcomescreen() {
            if (this.state.welcomescreen.length == 0) {
                  this.setState({ welcomescreen: '\u2714' });
            } else {
                  this.setState({ welcomescreen: '' });
            }
      }

      render() {
            //     return (  
            //         <View style={Skin.nwd.container}>
            //       <Title
            //       tital="Registration"></Title>
            //       <ScrollView
            //       scrollEnabled={true}
            //       showsVerticalScrollIndicator={false}
            //       >
            // <View style={Skin.nwd.scrollcontainer}>

            // <View>


            // </View>
            //       </ScrollView>
            //      </View>
            //             );

            return (
                  <View style={Skin.layout1.wrap}>
                        <StatusBar
                              style={Skin.layout1.statusbar}
                              backgroundColor={Skin.main.STATUS_BAR_BG}
                              barStyle={'default'}
                              />
                        <View style={Skin.layout1.title.wrap}>
                              <Title
                                    >Registration</Title>
                        </View>
                        <ScrollView style={Skin.layout1.content.scrollwrap}>
                              <View style={Skin.layout1.content.wrap}>
                                    <View style={Skin.layout1.content.container}>
                                          <View>
                                                {
                                                      // <CheckBox
                                                      //       value={this.state.device}
                                                      //       onSelect={this.selectdevice.bind(this) }
                                                      //       lable="Make Device Permanent"/>
                                                }

                                                <CheckBox
                                                      value={this.state.touchid}
                                                      onSelect={this.selecttouchid.bind(this) }
                                                      lable="Enable TouchID Login"/>

                                                <CheckBox
                                                      value={this.state.wechat}
                                                      onSelect={this.selectwechat.bind(this) }
                                                      lable="Enable FaceBook Login"/>

                                                {
                                                      // <CheckBox
                                                      //       value={this.state.rememberusername}
                                                      //       onSelect={this.selectrememberusername.bind(this) }
                                                      //       lable="Remember Username"/>

                                                      // <CheckBox
                                                      //       value={this.state.welcomescreen}
                                                      //       onSelect={this.selectwelcomescreen.bind(this) }
                                                      //       lable="Skip welcome screen"/>
                                                }


                                          </View>

                                          <Margin
                                                space={16}/>
                                          {
                                                // <Text >Default Login Credential</Text>

                                                // <Input
                                                //       placeholder={'Device Name'}
                                                //       />
                                          }


                                    </View>
                              </View>
                        </ScrollView>
                        <View
                              style={Skin.layout1.bottom.wrap}>
                              <View style={Skin.layout1.bottom.container}>
                                    <Button
                                          label={Skin.text['1']['1'].submit_button}
                                          />
                              </View>
                        </View>
                        <KeyboardSpacer topSpacing={-55}/>
                  </View >
            );
      }




}

module.exports = Register;
