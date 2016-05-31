var React = require('react-native');
var ToolBar = require('../ToolBar');
var Events = require('react-native-simple-events');

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
			<View style={styles.Container}>
			<ToolBar navigator={this.props.navigator} title="Activation"/>
			<ScrollView >

      <Text style={styles.step}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
         <Text style={styles.Varification}>Question and Answer</Text>
<Text style={styles.div}> </Text>

<TextInput
 ref={component => this._textInput = component}
 autoCorrect={false}
 placeholder={'Type/Select question'}
 placeholderTextColor={'rgba(255,255,255,0.5)'}
 onChange={this.onQuestionChange.bind(this)}
 style={styles.input}
/>

 <View style={styles.que}>
 <ListView
   ref="listView"
   automaticallyAdjustContentInsets={false}
   dataSource={this.state.dataSource}
   renderRow={this.renderRow}
 />
 </View>
<Text style={styles.div}> </Text>


<TextInput
 autoCorrect={false}
 placeholder={'Enter your secret answer'}
 placeholderTextColor={'rgba(255,255,255,0.5)'}
 style={styles.input}
 onChange={this.onAnswerChange.bind(this)}
/>

 <Text style={styles.div}> </Text>

 <TouchableHighlight
 style={styles.roundcorner}
	 onPress={this.setSecrets.bind(this)}
	 underlayColor={'#082340'}
	 activeOpacity={0.6}
 >
 <Text style={styles.button}>{this.btnText()}</Text>
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
  Container: {
      flex: 1,
      backgroundColor: 'rgba(8,26,60,0.9)'
  },


  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#fff',
            width:Dimensions.get('window').width,
  },
  step:{
     textAlign: "center",
    marginTop:16,
    color: TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    width:Dimensions.get('window').width,

  },
  Varification:{
     textAlign: "center",
    marginTop:16,
    color: TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    width:Dimensions.get('window').width,
  },
  match:{
     textAlign: "center",
    marginTop:16,
    color: '#cdcdc1',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    width:Dimensions.get('window').width,
  },
  Varificationkey:{
     textAlign: "center",
    marginTop:16,
    color: TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    width:Dimensions.get('window').width,
  },
  div:{
    marginTop:16,
    width:Dimensions.get('window').width,
    backgroundColor: '#fff',
    height:1,
  },

  button: {
      fontFamily: 'Century Gothic',
    backgroundColor:'transparent',
  flex:1,
  fontSize: 16,
  margin:1,
  textAlign:'center',
  textAlignVertical:'center',
  color: '#FFF',
  marginTop:16,
  },
	roundcorneredittext: {
		height: 56,
		width: 280,
	marginTop:16,
	marginLeft:Dimensions.get('window').width/2-140,
	backgroundColor:'#fff',
	borderRadius: 10,
	},
	formInput: {
		height: 56,
		width: 280,
	fontSize: 16,
	textAlign:'center',
	color: "#555555",
	backgroundColor:'transparent'
	},
  roundcorner: {
    height: 56,
    width: 280,
  marginTop:16,
  marginBottom:16,
  marginLeft:Dimensions.get('window').width/2-140,
  borderWidth: 1,
  borderColor: "#fff",
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: 30,
  },
  input: {
		fontFamily: 'Century Gothic',
		backgroundColor: 'rgba(255,255,255,0.1)',
		height: 56,
		fontSize:16,
		width: 280,
		marginTop:16,
		color: 'rgba(255,255,255,1)',
		marginLeft:Dimensions.get('window').width/2-140,
		textAlign:'center',
		alignItems: 'center',
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
