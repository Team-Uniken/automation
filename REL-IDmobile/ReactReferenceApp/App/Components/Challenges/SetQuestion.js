/**
 *  set Question and Answer screen comes in activation flow. 
 * allow you to select or write your own question and answer.
 */

'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import dismissKeyboard from 'dismissKeyboard';
import {View, Text, TouchableHighlight, TouchableOpacity, ListView, TextInput, StyleSheet, StatusBar, InteractionManager, BackAndroid, } from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer';


/*
 Use in this js
 */
import Skin from '../../Skin';
import MainActivation from '../Container/MainActivation';


/*
 Custome View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';


/*
  INSTANCED
 */
let obj;





export default class QuestionSet extends Component {

  constructor(props) {
    super(props);
    dismissKeyboard();
    obj = this;
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
  /*
     This is life cycle method of the react native component.
     This method is called when the component is Mounted/Loaded.
   */
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
    // console.log('----- QuestionSet - componentDidMount');
    // console.log(this.props);
    const prompts = [
      'What is the last name of your third grade teacher?',
      'What was the name of the boy/girl you had your second kiss with?',
      'What was the name of your second dog/cat/goldfish/etc?',
      'Where were you when you had your first alcoholic drink (or cigarette)?',
      'When you were young, what did you want to be when you grew up?',
    ];
    const { data, sectionIds } = this.renderListViewData(this.props.url.chlngJson.chlng_prompt[0]);
    //const { data, sectionIds } = this.renderListViewData(prompts);
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
    if (kSecQ.trim().length > 0 && vSecA.trim().length > 0) {
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
          // this.quesInput.setNativeProps({ text: rowData.msg });
          this.refs.secAnswer.focus();
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
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }


  /*
      This method is used to render the componenet with all its element.
    */
  render() {
    return (
      <MainActivation>
        <View style={Skin.layout1.wrap}>
          <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'} />
          <View style={Skin.layout1.title.wrap}>
            <Title onClose={() => {
              this.close();
            } }>
              Activation
            </Title>

          </View>
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
                   autoCorrect={false}
                  onSubmitEditing={this.setSecrets.bind(this) }
                  onChange={this.onAnswerChange.bind(this) }
                  />
            
                <View style={Skin.layout0.bottom.container}>
                  <Button
                    label= {this.btnText() }
                    onPress={this.setSecrets.bind(this) }/>
                </View>
            <KeyboardSpacer topSpacing={-30}/>
              </View>
            </View>

          </View>

        </View>
      </MainActivation>
    );


  }
}

module.exports = QuestionSet;

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
