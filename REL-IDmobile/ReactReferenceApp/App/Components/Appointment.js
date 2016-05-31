var React = require('react-native');
var AddAppointment = require('./AddAppointment');
var ToolBar = require('./ToolBar');

var obj;
var dataPoints;
var Dimensions = require('Dimensions');
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var Dimensions = require('Dimensions');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';

var CORE_FONT = 'Century Gothic';
var NAV_BAR_TINT = '#FFFFFF'
var NAV_SHADOW_BOOL = true;
var MENU_TXT_COLOR = '#2579A2';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';
var MID_COL = '#2579A2';
var LIGHT_COL = '#50ADDC';
var DARK_COL = '#10253F';
var Spd = 0.1;
var LoadSpd = 0.2;
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;



  var appointmentData =[{"date":"2016-05-06","time":"20:00","location":"Nagpur","msg":"React native demo ..."},
{"date":"2016-03-07","time":"18:00","location":"pune","msg":"Meeting with Robbert"},
{"date":"2016-03-07","time":"08:00","location":"mumbai","msg":"REL_ID Demo ...."},
{"date":"2016-09-08","time":"19:00","location":"pune","msg":"Team Lunch .."}];



  function compare(a,b) {
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
		if(a.date==b.date){
			if (a.time < b.time)
				return -1;
			if (a.time > b.time)
				return 1;
		}
  return 0;
}

var SampleRow = React.createClass({
  render() {

    return (
      <View style={styles.customerow}>

					 <TouchableHighlight  activeOpacity={1.0} underlayColor={MENU_HVR_COLOR}
					 onPress={()=>{obj.props.navigator.push({id: "AddAppointment", title:"Add Appointment",url:{'date':this.props.date,
					 'time':this.props.time,'location':this.props.location,'msg':this.props.msg,'buttontext':'Update'}});}}
					 >
					 <View style={styles.col}>
						<View style={styles.row }>
							<Text style={styles.date}>{this.props.date}</Text>
							<Text style={styles.time}>{this.props.time}</Text>
						</View>
						<View style={styles.row }>
						<Image source={require('image!location')} style={styles.location} />
						<Text style={styles.locatontext}>{this.props.location}</Text>
						</View>
						<Text style={styles.msg}>{this.props.msg}</Text>


					</View>
					 </TouchableHighlight>

      </View>
    );
  }
});

var MENU_HVR_COLOR = 'rgba(13, 23, 38, 1.0)';
var DATE_TIME = '#757575';
var MSG = '#A9A9A9';

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
} = React;

var Appointment = React.createClass({


  getInitialState: function() {
		obj=this;
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });

   	var {data, sectionIds} = this.renderListViewData(appointmentData.sort(compare));

    return {
      dataSource: ds.cloneWithRowsAndSections(data, sectionIds)
    };
  },

  componentDidMount() {
    var listViewScrollView = this.refs.listView.getScrollResponder();
  },

  renderListViewData(users) {
    var data = {};
    var sectionIds = [];

    users.map((user) => {
      var section = user.date.charAt(0);
      if (sectionIds.indexOf(section) === -1) {
        sectionIds.push(section);
        data[section] = [];
      }
      data[section].push(user);
    });
    return {data, sectionIds};
  },


  renderRow(rowData) {
    return <SampleRow {...rowData} style={styles.row} />
  },

  render() {
    return (
						<View style={styles.container}>
            <View style={styles.navbar}>
            <TouchableHighlight
            style={[styles.navButton,styles.navLeft]}
            underlayColor={'#FFFFFF'}
            activeOpacity={0.6}
            >
            <View style={styles.navButtonText}>
            </View>
            </TouchableHighlight>
            
            <Text style={styles.navTitle}>{this.props.title}</Text>
            
            <TouchableHighlight
            style={[styles.navButton,styles.navRight]}
            onPress={()=>{
            this.props.navigator.pop();
            }}
            underlayColor={'#FFFFFF'}
            activeOpacity={0.6}
            >
            <Text
            style={[styles.navButtonText,{textAlign: 'right',fontSize:22}]}
            >X</Text>
            </TouchableHighlight>
            </View>
            <View style={{borderColor:"#D0D0D0",borderStyle:'solid',borderWidth:0.5,width:SCREEN_WIDTH}}></View>


		 <ListView
       ref="listView"
       automaticallyAdjustContentInsets={false}
       dataSource={this.state.dataSource}
       renderRow={this.renderRow}
     />

		 <TouchableHighlight style={[styles.button]} activeOpacity={1.0} underlayColor={MENU_HVR_COLOR}
		 onPress={()=>{obj.props.navigator.push({id: "AddAppointment", title:"Add Appointment",url:{'date':'2016-05-06','time':'20:00','location':'Select Location','msg':'','buttontext':'Save'}});}}

		 >

			 <View>
			 <Image source={require('image!plus')} style={styles.plus} />

			 </View>
		 </TouchableHighlight>



                    </View>
    );
  },
});

var styles = {
	container: {
			flex: 1,
			alignItems: 'center',
			backgroundColor: 'rgba(8,26,60,0.9)'
		},
		customerow: {
			backgroundColor:'#122941',
			marginTop:8,
			width:Dimensions.get('window').width,
		},
		location: {
			width: 24,
			height: 24,
		},
		button: {
			width: 56,
		height: 56,
		borderRadius: 30,
		backgroundColor: '#fff',
		position: 'absolute',
		bottom: 24,
		right: 24,
		},
		toolbarrow: {
							flexDirection:'row',
							backgroundColor: '#fff',
							width:Dimensions.get('window').width,
		},
		plus: {
			width: 24,
			height: 24,
			margin:16,
		},



  row: {
          margin:4,
            flexDirection:'row',
  },

  col: {
    marginRight:20,
            flexDirection:'column'
  },

     date: {
          fontSize: 20,
          color : DATE_TIME,
					width:Dimensions.get('window').width/2,
					textAlign:'left',
        },
				msg: {
						 fontSize: 16,
						 color : MSG,
						 width:Dimensions.get('window').width,
						 marginRight:8,
						 marginLeft: 8,
					 },
					 locatontext: {
								fontSize: 16,
								color : MSG,
								width:Dimensions.get('window').width,
								marginRight:8,
							},
        time: {
             fontSize: 20,
             color :DATE_TIME,
						 width:Dimensions.get('window').width/2-16,
textAlign:'right',
        marginRight:16,

           },
bar:{
backgroundColor: MID_COL,
width: 20,
height:3,
marginTop:3,
},
navbar:{
backgroundColor: '#ffffff',
height: 65,
flexDirection: 'row',
padding: 10,
paddingTop:30
},
navButton:{
  //backgroundColor:'#D43B43',
backgroundColor: 'transparent',
  //    width: 100,
  //    height: 20,
},
navButtonText:{
  //textAlign: 'left',
  //fontFamily: CORE_FONT,
  // color: MID_COL,
  // paddingRight:10
},
navButtonIcon:{
fontFamily: CORE_FONT,
},
navRight:{
  //textAlign: 'right'
  // right: 0,
  // position: 'absolute'
},
navLeft:{
  //left: 0,
  // position: 'absolute',
  //flex:1
},
navTitle:{
flex:2,
fontFamily: CORE_FONT,
textAlign: 'center',
  // color: MID_COL,
fontSize: 20,
},

};
module.exports = Appointment;
