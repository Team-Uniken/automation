'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

var ToolBar = require('../ToolBar');
var Events = require('react-native-simple-events');
var obj;

  function compare(a,b) {
  if (a.msg < b.msg)
    return -1;
  if (a.msg > b.msg)
    return 1;
	else
  return 0;
}

var SampleRow = React.createClass({
  render() {

    return (
			<TouchableHighlight
      style={Skin.questionrow.customerow}
        onPress={()=>{
          obj._textInput.setNativeProps({text: this.props.msg});
          obj.setState({secQA: this.props.msg});
        }}
        underlayColor={Skin.colors.REPPLE_COLOR}
        activeOpacity={0.6}
      >
      <Text style={Skin.questionrow.questyle}>{this.props.msg}</Text>
      </TouchableHighlight>
    );
  }
});


var {
    View,
    Text,
    TouchableHighlight,
    StatusBar,
    ListView,
	Navigator,
	TextInput,
  TextInput,
  ScrollView,
} = React;

var SetQue = React.createClass({

  btnText(){
  	if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
  		return "Submit";
  	}else{
  		return "Continue";
  	}},

  getInitialState: function() {
    obj=this;
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });

   	//var {data, sectionIds} = this.renderListViewData(que.sort(compare));

    return {
      dataSource: ds,
      secQA: '',
      secAnswer: '',
    };
  },

  componentWillMount() {
  },

  componentDidMount() {
    var listViewScrollView = this.refs.listView.getScrollResponder();

    var {data, sectionIds} = obj.renderListViewData(this.props.url.chlngJson.chlng_prompt[0]);

    obj.setState({
                  dataSource: obj.state.dataSource.cloneWithRowsAndSections(data, sectionIds),
    });
  },

  renderListViewData(users) {
    var data = {};
    var sectionIds = [];

    users.map((user) => {
      var qData = {"msg":user};
      var section = qData.msg.charAt(0);
      if (sectionIds.indexOf(section) === -1) {
        sectionIds.push(section);
        data[section] = [];
      }
      data[section].push(qData);
    });
    return {data, sectionIds};
  },

  onQuestionChange(event){
    this.setState({secQA: event.nativeEvent.text});
  },

  onAnswerChange(event){
    this.setState({secAnswer: event.nativeEvent.text});
  },

  setSecrets(){
    var kSecQ = this.state.secQA;
    var vSecA = this.state.secAnswer;
    var responseJson;
    if(kSecQ.length>0 && vSecA.length>0){
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].challenge = kSecQ;
      responseJson.chlng_resp[0].response = vSecA;
      Events.trigger('showNextChallenge', {response: responseJson});
    }
    else{
      alert('Please enter valid data');
    }
  },

  renderRow(rowData) {
    return <SampleRow {...rowData} style={Skin.questionrow.row} />
  },

  render() {


    return (
      <View style={Skin.customeStyle.maincontainer}>
                <StatusBar
                backgroundColor={Skin.colors.STATUS_BAR_COLOR}
                barStyle='light-content'
                />
                <ToolBar navigator={this.props.navigator} title="Activation"/>
	              <ScrollView >
                <Text style={Skin.customeStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
                <Text style={Skin.customeStyle.text2}>Question and Answer</Text>
                <Text style={Skin.customeStyle.div}> </Text>
                <View
               style={[Skin.customeStyle.roundcornerinput]}
                activeOpacity={0.6}>
                <KeyboardAwareScrollView>
               <TextInput
               ref={component => this._textInput = component}
               autoCorrect={false}
               placeholder={'Type/Select question'}
               	placeholderTextColor={Skin.colors.HINT_COLOR}
               	style={Skin.customeStyle.input}
                onChange={this.onQuestionChange}
               />
               </KeyboardAwareScrollView>

               </View>
               <View style={Skin.questionrow.que}>
               <ListView
               ref="listView"
               automaticallyAdjustContentInsets={false}
               dataSource={this.state.dataSource}
               renderRow={this.renderRow}
               />
               </View>
               <View
      style={[Skin.customeStyle.roundcornerinput]}
       activeOpacity={0.6}
      >
      <KeyboardAwareScrollView>
      <TextInput
        autoCorrect={false}
        placeholder={'Enter your secret answer'}
        placeholderTextColor={Skin.colors.HINT_COLOR}
        style={Skin.customeStyle.input}
        onChange={this.onAnswerChange}
      />
      </KeyboardAwareScrollView>

      </View>
      <Text style={Skin.customeStyle.div}> </Text>
      <TouchableHighlight
      style={[Skin.customeStyle.roundcornerbutton]}
      onPress={this.setSecrets}
     	 underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
     	 activeOpacity={0.6}
      >
      <Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
      </TouchableHighlight>
      </ScrollView >
			</View>
		);
  },
});

module.exports = SetQue;
