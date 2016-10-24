'use strict';

/*
  NEEDED
*/
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../../Skin';

/*
  CALLED
*/
import dismissKeyboard from 'dismissKeyboard';
import MainActivation from '../MainActivation';
import Events from 'react-native-simple-events';

import Margin from '../view/margin';
import Input from '../view/input';
import Button from '../view/button';

let obj;
const {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  TextInput,
  StyleSheet,
  InteractionManager,
} = ReactNative;

const{Component} = React;

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
    
    this._props = {
      url: {
        chlng_idx: 1,
        sub_challenge_index: 0,
        chlng_name: "secqa",
        chlng_type: 2,
        challengeOperation: 1,
        chlng_prompt: [[
          "What is the last name of your third grade teacher?",
          "What was the name of the boy/girl you had your second kiss with?",
          "What was the name of your second dog/cat/goldfish/etc?",
          "Where were you when you had your first alcoholic drink (or cigarette)?",
          "When you were young, what did you want to be when you grew up?",
        ]],
        chlng_info:[
          {
            key:"Prompt label",
            value:"Secret Question",
          }, {
            key: "Response label",
            value: "Secret Answer",
          }, {
            key: "Description",
            value: "Choose your secret question and then provide answer",
          }, {
            key: "Reading",
            value: "Set secret question and answer",
          },
        ],
        chlng_resp: [
          {
            challenge: '',
            response: '',
          },
        ],
        challenge_response_policy: [],
        chlng_response_validation: false,
        attempts_left: 3,
        currentIndex: 1,
      },
    };
  }

  componentDidMount() {
    // console.log('----- QuestionSet - componentDidMount');
    // console.log(this.props);
    const prompts = [
      'What is the last name of your third grade teacher?',
      'What was the name of the boy/girl you had your second kiss with?',
      'What was the name of your second dog/cat/goldfish/etc?',
      'Where were you when you had your first alcoholic drink (or cigarette)?',
      'When you were young, what did you want to be when you grew up?',
    ];
    //const { data, sectionIds } = this.renderListViewData(this.props.url.chlngJson.chlng_prompt[0]);
    const { data, sectionIds } = this.renderListViewData(prompts);
    this.setState({
      dataSource: obj.state.dataSource.cloneWithRowsAndSections(data, sectionIds),
    });
  }

  onQuestionChange(event) {
    this.setState({ secQue: event.nativeEvent.text });
  }

  onAnswerChange(event) {
    this.setState({ secAnswer: event.nativeEvent.text });
  }

  setSecrets() {
    //console.log(this);
    const kSecQ = this.state.secQue;
    const vSecA = this.state.secAnswer;
    let responseJson;
    if (kSecQ.length > 0 && vSecA.length > 0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].challenge = kSecQ;
      responseJson.chlng_resp[0].response = vSecA;
      Events.trigger('showNextChallenge', {response: responseJson});
    } else {
      dismissKeyboard();
      InteractionManager.runAfterInteractions(() => {
        alert('Please enter a Question & Answer');
      });
    }
  }

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
          this.setState({secQue:rowData.msg});
          this.quesInput.setNativeProps({ text: rowData.msg });
        }}
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

  render() {

    /**
     * SCROLL VIEW ADDED HERE IN LIEU OF MAINACTIVATION
     * When react-native-keyboard-scroll-view is updated and bug patch is rolled into React Native we can swop to that.
     <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
     */

    return (
     <View style={Skin.layout0.wrap.container}>
         <View style={Skin.layout0.top.container}>
         <Text style={Skin.activationStyle.counter}>
             {this.props.url.currentIndex}/{this.props.url.chlngsCount}
             </Text>
         <Text style={Skin.layout0.top.subtitle}>Secret Question and Answer</Text>
           <Margin
      space={16}/>
          <View
          style={[
            Skin.baseline.textinput.wrap,
              this.state.hasFocus ? Skin.baseline.textinput.wrapfocus : {}
          ]}>
          <TextInput 
           multiline
           style = {Skin.baseline.textinput.base}
           autoCorrect={false}
            placeholder={'Type/Select question'}
           ref={(component) => { this.quesInput = component; return this.quesInput; }}
           returnKeyType = {"next"}
           placeholderTextColor={Skin.baseline.textinput.placeholderTextColor} 
            onChange={this.onQuestionChange.bind(this)}
           />
         </View>
           <Margin
      space={8}/>
          <View style={styles.listViewWrap}>
            <ListView
              ref="listView"
              automaticallyAdjustContentInsets={false}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
              renderSeperator={this.renderSeperator.bind(this)}
              style={styles.listView}
              showsVerticalScrollIndicator
            />
          </View>
            <Margin
      space={8}/>
       <View style={Skin.layout0.bottom.container}>   
         <Input
                placeholder={'Enter your secret answer'}
                onSubmitEditing={this.setSecrets.bind(this)}
                onChange={this.onAnswerChange.bind(this)}
              />    
              <Button
                label= {this.btnText()}
                onPress={this.setSecrets.bind(this)}/> 
      </View>
        </View>
      </View>
		);


  }
}

module.exports = QuestionSet;

const styles = StyleSheet.create({
  listViewWrap:{
    backgroundColor:'white',
    height: 105,
     width: 260,
  },
  row:{
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
  rowtext:{
    color: Skin.colors.PRIMARY_COLOR,
    textAlign: 'left',
    flex: 1,
    //backgroundColor: 'pink',
    fontSize: 15,
    padding: 5,
  },
  divider:{
    height:5, 
    backgroundColor: Skin.colors.DIVIDER_COLOR,
  }

});
