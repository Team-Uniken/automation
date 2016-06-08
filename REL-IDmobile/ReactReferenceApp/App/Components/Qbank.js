
/*
  ALWAYS NEED
*/
'use strict';

var React = require('react-native');
var Skin = require('../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var Drawer = require('react-native-drawer');
var DrawerQbank = require('./DrawerQbank');
var QbankOptions = require('./QbankOptions');
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;


var CORE_FONT = 'Century Gothic';
var NAV_BAR_TINT = '#FFFFFF'
var NAV_SHADOW_BOOL = true;
var MENU_TXT_COLOR = '#2579A2';
var MENU_HVR_COLOR = 'rgba(13, 23, 38, 1.0)';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';
var obj;
var androidBackPressListener;


const DRAWER_REF = 'drawer';

  function compare(a,b) {
  if (a.accountName < b.accountName)
    return -1;
  if (a.accountName > b.accountName)
    return 1;
  return 0;
}

var SampleRow = React.createClass({
  render() {
    return (
      <View style={styles.wrapper}>

                   <View style={styles.row}>

                   <View style={styles.col }>
                   <Text style={styles.account}>####</Text>
<Text style={styles.account}>{this.props.accountName}</Text>
                 </View>


          <Text style={styles.doller}>$ {this.props.accountBalance}</Text>
        </View>
      </View>
    );
  }
});


var {
Dimensions,
    AsyncStorage,
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    StatusBar,
    ToolbarAndroid,
    DrawerLayoutAndroid,
    ListView,
    Image,
    DeviceEventEmitter,
    TouchableHighlight,
 TouchableHighlight,
 BackAndroid,
} = React;

androidBackPressListener = BackAndroid.addEventListener('hardwareBackPress', function() {
  console.log("------ addEventListener");
  obj.props.navigator.pop();
  androidBackPressListener.remove();
  return true;
});

var ListViewRowsAndSections = React.createClass({

    toggleControlPanel(){
      if(this.state.controlPanelOpen){
        this.refs.drawer.close();
        this.setState({controlPanelOpen:false});
      }else{
        this.refs.drawer.open();
        this.setState({controlPanelOpen:true});
      }
    },

  getInitialState: function() {
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });

   	//var {data, sectionIds} = this.renderListViewData(accountData.sort(compare));

    return {
      dataSource: ds
    };
  },

  componentDidMount() {
    obj = this;
    var listViewScrollView = this.refs.listView.getScrollResponder();
    this.getAccountDetails();
  //  listViewScrollView.scrollTo(1); // Hack to get ListView to render fully
  },



  getAccountDetails(){

      RDNARequestUtility.doHTTPGetRequest('http://apisdkdev.uniken.com:8080/APIBanking/getAccounts.jsp?userid=10', function (response) {
          if(response[0].error == 0){
             var responseJson = JSON.parse(response[0].response);
             if(responseJson.status === 'success'){
                var accountData = responseJson.accountList;
                var {data, sectionIds} = obj.renderListViewData(accountData.sort(compare));

                obj.setState({
                    dataSource: obj.state.dataSource.cloneWithRowsAndSections(data, sectionIds),
                });

             } else {
                alert(responseJson.status);
             }
          } else {
            alert(response[0].response);
          }
      });
  },

  renderListViewData(users) {
    var data = {};
    var sectionIds = [];

    users.map((user) => {
      var section = user.accountName.charAt(0);
      if (sectionIds.indexOf(section) === -1) {
        sectionIds.push(section);
        data[section] = [];
      }
      data[section].push(user);
    });

    return {data, sectionIds};
  },

  renderSectionHeader(data, sectionId) {
    var text;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionId}</Text>
      </View>
    );
  },

  renderRow(rowData) {
    return <SampleRow {...rowData} style={styles.row} />
  },

  render() {
    return (
      <Drawer
      ref={DRAWER_REF}
        type="static"
        content={<DrawerQbank navigator={this.props.navigator} toggle={this.toggleControlPanel}/>}
        openDrawerOffset={50}
        styles={{main: {shadowColor: "#000000", shadowOpacity: 1, shadowRadius: 20}}}
        tweenHandler={Drawer.tweenPresets.parallax}
      >
      <View style={styles.toolbarrow}>
      <TouchableHighlight
             onPress={this.toggleControlPanel}
        underlayColor={'#FFFFFF'}
        activeOpacity={0.6}
      >
<Image source={require('image!ic_navigation')} style={styles.hamburger} />
      </TouchableHighlight>

      <Text
        style={{fontSize:22,color: '#2579a2',margin:12,fontWeight: 'bold', width:Dimensions.get('window').width-120,}}
      >QuickBank</Text>
      <TouchableHighlight
        onPress={()=>{
                this.props.navigator.pop();
        }}
        underlayColor={'#FFFFFF'}
        activeOpacity={0.6}
      >
        <Text
          style={{textAlign: 'right',fontSize:24,color: '#2579a2',margin:12,}}
        >X</Text>
      </TouchableHighlight>
      </View>

                            <View style={styles.qbankbg}>

                            <View style={styles.listStyle}>
                            <ListView
                              ref="listView"
                              automaticallyAdjustContentInsets={false}
                              dataSource={this.state.dataSource}
                              renderRow={this.renderRow}
                            />
                                 </View>

                        <View style={styles.bottom}>
                          <QbankOptions navigator={this.props.navigator}/>
                                           </View>
                                           </View>
      </Drawer>
    );

  },
});

var {height, width} = Dimensions.get('window');
var styles = {
  A:{backgroundColor: '#2A799F'},
  B:{backgroundColor: '#267196'},
  C:{backgroundColor: '#226082'},
  D:{backgroundColor: '#205877'},
  E:{backgroundColor: '#1B4A69'},
  F:{backgroundColor: '#183F5B'},
  G:{backgroundColor: '#163651'},
  H:{backgroundColor: '#122941'},
  I:{backgroundColor: '#082340'},
  navButton:{
    //backgroundColor:'#D43B43',
    backgroundColor: 'transparent',
//    width: 100,
//    height: 20,
  },
  navTitle:{
    flex:2,
    fontFamily: CORE_FONT,
    textAlign: 'center',
    // color: MID_COL,
    fontSize: 20,
  },
  icon:{
		color: ICON_COLOR,
		fontFamily: ICON_FAMILY,
		fontSize: 50,
		marginTop: 10,
		marginBottom: 10,
    height: 60,
    width:Dimensions.get('window').width/3,

		textAlign: 'center',

		//backgroundColor: 'rgba(100,0,70,0.5)'
	},
	iconText:{
		color: ICON_COLOR,
		fontFamily: CORE_FONT,
		textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
		fontSize: 20,
    width:100,
		//backgroundColor: 'rgba(100,50,70,0.5)'
	},
  listStyle:
  {
    height: Dimensions.get('window').height-344,
    justifyContent: 'center',
    alignItems: 'center',
            backgroundColor: 'rgba(8,26,60,0.9)'

  },
  qbankbg: {
    flex: 1,
		backgroundColor: '#082340'
    },
  image: {
    width: 48,
    height: 48
  },
  hamburger: {
    width: 24,
    height: 24,
    margin:16,
  },
  row: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'row',
            marginLeft:30,
  },
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#fff',


  },
  col: {
    marginRight:20,
            flexDirection:'column'
  },
  bottom: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBar: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
       fontSize: 20,
       textAlign: 'center',
       color : '#fff',

     },
     account: {
          fontSize: 20,
          color : '#fff',
          width: 200,

        },
        doller: {
             fontSize: 20,
             color : '#fff',
             width: 120,
             marginBottom:16,
             marginTop:16,
           },
};
module.exports = ListViewRowsAndSections;
