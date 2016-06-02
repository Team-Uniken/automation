var React = require('react-native');
var ToolBar = require('../ToolBar');
var Events = require('react-native-simple-events');
var {customeStyle, styles} = require("../MainStyleSheet");

var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';
var MSG = '#A9A9A9';

var selectedque='nikhil';
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
      style={styles.customerow}

        onPress={()=>{
          obj._textInput.setNativeProps({text: this.props.msg});
          obj.setState({secQA: this.props.msg});
        }}

        underlayColor={'#163651'}
        activeOpacity={0.6}
      >
      <Text style={styles.questyle}>{this.props.msg}</Text>

      </TouchableHighlight>

    );
  }
});


var {
Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    StatusBar,
    ListView,
    Image,
	Navigator,
	TextInput,
	TouchableHighlight,
	Dimensions,
  TextInput,
  ActivityIndicatorIOS,
  Dimensions,
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
    return <SampleRow {...rowData} style={styles.row} />
  },

  render() {


    return (
      <View style={customeStyle.maincontainer}>
                <StatusBar
                backgroundColor='#1976d2'
                barStyle='light-content'
                />
                			<ToolBar navigator={this.props.navigator} title="Activation"/>
			<ScrollView >

      <Text style={customeStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
         <Text style={customeStyle.text2}>Question and Answer</Text>
<Text style={customeStyle.div}> </Text>


<View
               style={[customeStyle.roundcorner,{backgroundColor:'#fff',borderColor:'#2196F3'}]}
                activeOpacity={0.6}
               >
               <TextInput
               ref={component => this._textInput = component}
               autoCorrect={false}
               placeholder={'Type/Select question'}
               	placeholderTextColor={'#8F8F8F'}
               	style={customeStyle.input}
                onChange={this.onQuestionChange.bind(this)}
               />
               </View>


 <View style={styles.que}>
 <ListView
   ref="listView"
   automaticallyAdjustContentInsets={false}
   dataSource={this.state.dataSource}
   renderRow={this.renderRow}
 />
 </View>
 <View
      style={[customeStyle.roundcorner,{backgroundColor:'#fff',borderColor:'#2196F3'}]}
       activeOpacity={0.6}
      >
      <TextInput
        autoCorrect={false}
        placeholder={'Enter your secret answer'}
        placeholderTextColor={'#8F8F8F'}
        style={customeStyle.input}
        onChange={this.onAnswerChange.bind(this)}
      />
      </View>


 <Text style={customeStyle.div}> </Text>

 <TouchableHighlight
      style={[customeStyle.roundcorner,{backgroundColor:'#2196F3'}]}
      onPress={this.setSecrets.bind(this)}
     	 underlayColor={'#1976d2'}
     	 activeOpacity={0.6}
      >
      <Text style={customeStyle.button}>{this.btnText()}</Text>
      </TouchableHighlight>
</ScrollView >
			</View>
		);
  },
});

var styles = {
  que: {
      flex: 1,
      marginTop:16,
      width:Dimensions.get('window').width,
      height:150,
      backgroundColor:'#183F5B',

      },
	customerow: {
			backgroundColor:'#122941',
			marginTop:2,
			width:Dimensions.get('window').width,
		  },
	questyle:{
			fontSize: 16,
			color : MSG,
      height:40,
			marginTop:6,
			width:Dimensions.get('window').width,
			textAlign:'center',
			textAlignVertical:'center',
			},

};
module.exports = SetQue;
