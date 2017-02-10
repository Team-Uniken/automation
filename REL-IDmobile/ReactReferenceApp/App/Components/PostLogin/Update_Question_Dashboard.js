/**
 *  Update Password screen. 
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
import {View, Text, TouchableHighlight, TouchableOpacity, ListView, TextInput, StyleSheet, StatusBar, InteractionManager, BackAndroid, } from 'react-native';
import dismissKeyboard from 'dismissKeyboard';
import Events from 'react-native-simple-events';
import KeyboardSpacer from 'react-native-keyboard-spacer';

/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import MainActivation from '../Container/MainActivation';

/*
 Custom View
 */
import Margin from '../view/margin';
import Input from '../view/input';
import Button from '../view/button';
import Title from '../view/title';

/*
  INSTANCES
 */

let obj;


export default class UpdateQuestionSet extends Component {

  constructor(props) {
    super(props);
    dismissKeyboard();
    obj = this;
    this.close = this.close.bind(this);
    const ds = new ListView.DataSource({
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds,
      secQue: '',
      secAnswer: '',
    };
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.close);
  }
  /*
     This is life cycle method of the react native component.
     This method is called when the component is Mounted/Loaded.
   */
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.close);
    // console.log('----- QuestionSet - componentDidMount');
    // console.log(this.props);
    const { data, sectionIds } = this.renderListViewData(this.props.url.chlngJson.chlng_prompt[0]);
    this.setState({
      dataSource: obj.state.dataSource.cloneWithRowsAndSections(data, sectionIds),
    });
  }

  /*
      onTextchange method for Question TextInput
    */
  onQuestionChange(event) {
    this.setState({ secQue: event.nativeEvent.text });
  }
  /*
      onTextchange method for Answer TextInput
    */
  onAnswerChange(event) {
    this.setState({ secAnswer: event.nativeEvent.text });
  }
  /*
    This method is used to get the users entered question and answer,
     and submit as a challenge response key and response value respectively.
  */
  setSecrets() {
    //console.log(this);
    const kSecQ = this.state.secQue;
    const vSecA = this.state.secAnswer;
    let responseJson;
    if (kSecQ.length > 0 && vSecA.length > 0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].challenge = kSecQ;
      responseJson.chlng_resp[0].response = vSecA;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      dismissKeyboard();
      InteractionManager.runAfterInteractions(() => {
        alert('Please enter a Question & Answer');
      });
    }
  }
  /*
   This method is used to return the text Submit/Continue for submit button.
 */
  btnText() {
    if (this.props.url.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }

  renderListViewData(questionData) {
    const data = {};
    const sectionIds = [];
    questionData.map((question) => {
      const qData = { msg: question };
      const section = qData.msg.charAt(0);
      if (sectionIds.indexOf(section) === -1) {
        sectionIds.push(section);
        data[section] = [];
      }
      data[section].push(qData);
      return null;
    });
    return { data, sectionIds };
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        style={styles.row}
        onPress={() => {
          this.setState({ secQue: rowData.msg });
          this.refs.secAnswer.focus();
          // this.quesInput.setNativeProps({ text: rowData.msg });
        } }
        underlayColor={Skin.colors.REPPLE_COLOR}
        activeOpacity={0.6}
        >
        <Text style={styles.rowtext} numberOfLines={2}>{rowData.msg}</Text>
      </TouchableHighlight>
    );
  }

  renderSeperator() {
    return (
      <View style={styles.divider} />
    );
  }
  /*
       This method is used to handle the cancel button click or back button.
     */
  close() {
    this.props.parentnav.pop();
    return true;
  }

  /*
       This method is used to render the componenet with all its element.
     */
  render() {

    /**
     * SCROLL VIEW ADDED HERE IN LIEU OF MAINACTIVATION
     * When react-native-keyboard-scroll-view is updated and bug patch is rolled into React Native we can swop to that.
     <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
     */

    return (
      <Main
        ref={'main'}
        drawerState={{
          open: false,
          disabled: true,
        }}
        navBar={{
          title: 'Change Secret',
          visible: true,
          tint: Skin.main.NAVBAR_TINT,
          left: {
            text: 'Back',
            icon: '',
            iconStyle: {},
            textStyle: {},
            handler: this.close,
          },
        }}
        bottomMenu={{
          visible: false,
        }}
        navigator={this.props.navigator}
        >
        <View style={{ backgroundColor: Skin.main.BACKGROUND_COLOR }}>
          <MainActivation>
            <View
              style={{ justifyContent: 'center' }}>
              <View>
                <View style={Skin.layout0.top.container}>
                  <Text style={Skin.layout0.top.subtitle}>Secret Question and Answer</Text>
                  <Margin
                    space={16}/>
                  <Input
                    value={this.state.secQue}
                    style = {Skin.baseline.textinput.base}
                    autoCorrect={false}
                    placeholder={'Type/Select question'}
                    returnKeyType = {"next"}
                    placeholderTextColor={Skin.baseline.textinput.placeholderTextColor}
                    onChange={this.onQuestionChange.bind(this) }
                    onSubmitEditing={() => {
                      this.refs.secAnswer.focus();
                    } }
                    />
                  <Margin
                    space={8}/>
                  <View style={styles.listViewWrap}>
                    <ListView
                      ref="listView"
                      automaticallyAdjustContentInsets={false}
                      dataSource={this.state.dataSource}
                      renderRow={this.renderRow.bind(this) }
                      renderSeperator={this.renderSeperator.bind(this) }
                      style={styles.listView}
                      showsVerticalScrollIndicator
                      />
                  </View>
                  <Margin
                    space={16}/>
                  <Input
                    ref={'secAnswer'}
                    placeholder={'Enter your secret answer'}
                    onSubmitEditing={this.setSecrets.bind(this) }
                    onChange={this.onAnswerChange.bind(this) }
                    />
                  <KeyboardSpacer topSpacing={-30}/>
                  <View style={Skin.layout0.bottom.container}>
                    <Button
                      label= {this.btnText() }
                      onPress={this.setSecrets.bind(this) }/>
                  </View>
                </View>
              </View>
            </View>
          </MainActivation>
        </View>
      </Main >
    );


  }
}

module.exports = UpdateQuestionSet;

const styles = StyleSheet.create({
  listViewWrap: {
    backgroundColor: 'white',
    height: 105,
    width: 260,
  },
  row: {
    backgroundColor: Skin.colors.TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 48,
    borderTopColor: Skin.colors.TEXT_COLOR,
    borderLeftColor: Skin.colors.TEXT_COLOR,
    borderRightColor: Skin.colors.TEXT_COLOR,
    borderBottomColor: Skin.colors.DIVIDER_COLOR,
    borderWidth: 1,
  },
  rowtext: {
    color: Skin.colors.PRIMARY_COLOR,
    textAlign: 'left',
    flex: 1,
    //backgroundColor: 'pink',
    fontSize: 15,
    padding: 5,
  },
  divider: {
    height: 5,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
  }

});
