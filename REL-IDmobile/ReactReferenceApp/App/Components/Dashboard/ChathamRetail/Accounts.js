'use strict';
/*
    NEED
 */

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, StyleSheet,ListView, Image ,TextInput,Platform,ScrollView,TouchableOpacity} from 'react-native'
import Events from 'react-native-simple-events';
//import { FormattedCurrency } from 'react-native-globalize';
import Skin from '../../../Skin';
import Main from '../../Container/Main';
import ListItem from '../../ListItem';
import ContactScene from './Contact';
import PayBillsScene from './PayBills';
import DepositsScene from './Deposits';
import FindBranchScene from './FindBranch';
import Row from './Row';
//import { SearchBar } from 'react-native-elements'

/*
  CALLED
*/
import ListSectionHeader from '../../ListSectionHeader';
import { FormattedCurrency } from 'react-native-globalize';
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

var titleStringArray = ["ACCOUNTS","PAY BILLS","DEPOSITS","FIND BRANCH","CONTACT"];
/*
  Instantiaions
*/
// const ReactRdna = React.NativeModules.ReactRdnaModule;
const RDNARequestUtility = ReactNative.NativeModules.RDNARequestUtility;

import ControlPanel from '../ControlPanel';
import Config from 'react-native-config';
import NavBar from '../../view/navbar.js';
import PageTitle from '../../view/pagetitle.js';

var sud =0;
let self;
const headers = {
  1: 'Savings',
  2: 'Investments',
  3: 'Credit Cards',
};
const icons = { 1: '\ue2f7',2: '\ue277',3: '\ue285', };

const iconcolor = {
  1: Skin.colors.DIVIDER_COLOR,
  2: Skin.colors.POSITIVE_ACCENT,
  3: Skin.colors.ACCENT,
};

const image1 = require('../../../img/imgFingerPrint.png');
const image2 = require('../../../img/imgFingerPrint.png');
const image3 = require('../../../img/retail.jpg');

var data = [{title:"Shop by Category",image: image2},{title:"Special Offers",image: image2},{title:"Weekly Ad and Catalog",image: image2},{title:"Graphic of some retail shipping items", image: image1},];


export default class AccountsScene extends Component {

  constructor(props) {
    super(props);
    // const ds = new ListView.DataSource({
    //   rowHasChanged: (r1, r2) => r1 !== r2,
    //   sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    // });
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     
    this.state = {
       dataSource: ds.cloneWithRows(data),
        tabChanged:1,
        activeTab :1,
        titleString:"Accounts"
        
      };
    self = this;
    this.tabChanged = this.tabChanged.bind(this);
    //this.getDashboard = this.getDashboard.bind(this);
    this.getComponent = this.getComponent.bind(this);    
  }

  /**
   * Creates the self object for reference later
   * @return {null}
   */
  componentDidMount() {
    this.getMyNotifications();
    //this.getAccountDetails();
      Events.on('tabChanged', 'tabChanged', this.tabChanged);
  }


  getMyNotifications() {

    var recordCount = "0";
    var startIndex = "1";
    var enterpriseID = "";
    var startDate = "";
    var endDate = "";
    ReactRdna.getNotifications(recordCount, startIndex, enterpriseID, startDate, endDate, (response) => {

      console.log('----- NotificationMgmt.getMyNotifications.response ');
      console.log(response);

      if (response[0].error !== 0) {
        console.log('----- ----- response is not 0');
      //                               if (NotificationObtianedResponse !== undefined) {
      //                               // If error occurred reload last response
      //
      //                                                              }
      }

    });
  }



  /**
   * Retrieves the account data in a json format
   * @return {[type]} [description]
   */
  getAccountDetails() {
    //    RDNARequestUtility.doHTTPGetRequest('http://apisdkdev.uniken.com:8080/APIBanking/getAccounts.jsp?userid=10',
    //      (response) => {
    /*
        REAL DATA
     "{
       "accountList":[
        {"accountID":44,"accountName":"CANDEMOACT10_01","accountBalance":5565,"accountType":1},
        {"accountID":45,"accountName":"CANDEMOACT10_02","accountBalance":24322,"accountType":1},
        {"accountID":46,"accountName":"CANDEMOACT10_03","accountBalance":30039,"accountType":1},
        {"accountID":47,"accountName":"CANDEMOACT10_04","accountBalance":40074,"accountType":1}
       ],
       "error":"",
       "status":"success"
      }
    */
    var response = {
      0: {
        error: 0,
        response: '{"accountList":[ \
                  {"accountID":"$35,233","accountName":"CANDEMOACT10_01","nickname":"Personal Savings","accountBalance":"$93,323.00","accountType":1}, \
                  {"accountID":"$93,323","accountName":"CANDEMOACT10_03","nickname":"Equities","accountBalance":20643.00,"accountType":2}, \
                  {"accountID":"$14,199","accountName":"CANDEMOACT10_04","nickname":"Platinum Card","accountBalance":1452111,"accountType":3}, \
                  {"accountID":"$1,452,111","accountName":"Funds","nickname":"","accountBalance":"$93,323","accountType":2}, \
                  {"accountID":"$20,643","accountName":"CANDEMOACT10_03","nickname":"Bonds","accountBalance":0,"accountType":2}, \
                  {"accountID":"$9,912","accountName":"CANDEMOACT10_04","nickname":"Gold Card","accountBalance":117987,"accountType":3}], \
              "error":"", \
              "status":"success" \
            }',
      },
    };
    if (response[0].error === 0) {
      const responseJson = JSON.parse(response[0].response);
      if (responseJson.status === 'success') {
        const accts = responseJson.accountList;
        const {data, sectionIds} = self.renderListViewData(accts.sort(self.compare));
        self.setState({
          dataSource: self.state.dataSource.cloneWithRowsAndSections(data, sectionIds),
        });
        return { data };
      } else {
        alert(responseJson.status);
      }
    } else {
      alert(response[0].response);
    }
  //      }
  //    );
  }

  /**
   * Basic sorting function for map calls
   */
  compare(a, b) {
    if (a.accountName < b.accountName) {
      return -1;
    }
    if (a.accountName > b.accountName) {
      return 1;
    }
    return 0;
  }

  // cleanRowData(rowData) {
  //   const cleanData = {
  //     title: (rowData.nickname === '') ? rowData.accountName : rowData.nickname,
  //     icon: icons[rowData.accountType],
  //     iconcolor: iconcolor[rowData.accountType],
  //     acctnum: rowData.accountID,
  //     total: rowData.accountBalance,
  //     totalcolor: (rowData.accountBalance > 0) ? Skin.colors.POSITIVE_ACCENT : Skin.colors.SECONDARY_TEXT,
  //   };
  //   // <Text style={{color: iconcolor[rowData.accountType]}}>{icons[rowData.accountType]}</Text>
  //   return cleanData;
  // }

  /**
   * Splits the account data blob into sections and data rows
   * @param  {object} accounts object with accounts information
   * @return {object}          Object with both the data and the sectionIds
   */
  renderListViewData(accounts) {
    const data = { };
    const sectionIds = [];
    accounts.map((account) => {
      const section = account.accountType;
      if (!data[section]) {
        data[section] = [];
        sectionIds.push(section);
      }
      data[section].push(account);
      return account;
    });
    return { data,sectionIds };
  }


  /**
   * Creates the section header for the various account types
   * @param  {object} data      The data blob of rows
   * @param  {string} sectionId The id of section being applied to this row
   * @return {JSX}              JSX of the row
   */
  renderSectionHeader(data, sectionId) {
    return (
      <ListSectionHeader>
        {headers[sectionId]}
      </ListSectionHeader>
      );
  }
  triggerDrawer() {
    console.log('trigger')
    Events.trigger('toggleDrawer')
  }
  // renderRow(rowData) {
  //   const cleanData = self.cleanRowData(rowData);
  //   return (
  //     <ListItem>
  //       <View style={styles.rowwrap}>
  //         <View style={styles.iconwrap}>
  //           <Text style={[styles.icon, {
  //                          color: cleanData.iconcolor
  //                        }]}>
  //             {cleanData.icon}
  //           </Text>
  //         </View>
  //         <View style={styles.namewrap}>
  //           <Text
  //             numberOfLines={1}
  //             style={styles.nametext}>
  //             {cleanData.title}
  //           </Text>
  //           <Text
  //             numberOfLines={1}
  //             style={styles.numtext}>
  //             {cleanData.acctnum}
  //           </Text>
  //         </View>
  //         <View style={styles.totalwrap}>
  //           <View style={{ flex: 1 }}>
      
  //           </View>
  //         </View>
  //       </View>
  //     </ListItem>
  //     );
  // }
  
  tabChanged(e){
  
    this.setState({ tabChanged: e ,activeTab:e,titleString :titleStringArray[e-1]});
  }

 
  
  getComponent(){
    if(this.state.tabChanged===1){
      return([
        <View style={{flex:1,flexDirection:'column',alignItems:'stretch',justifyContent:'flex-start'}}>
        <View style={{}}>
      <ListView
        style={{}} //Don't forget this too
        contentContainerStyle={{ flexDirection: 'column', flexWrap: 'wrap' }}
        dataSource={this.state.dataSource}
        renderRow={(data) => <Row {...data} />} /> 
        </View>
        <View style={{ backgroundColor: 'gray',marginTop:5,marginBottom:5, height: 0.7 }}></View>
        <Image source={image3} style={{alignSelf: 'center',resizeMode:'stretch'}}>  
    </Image>
    </View>
      ]);
    }else{
      return (<View style={{backgroundColor:'white',flex:1}}></View>);
    }
  }

  render() {

    return (
      <Main
        controlPanel={ControlPanel}
        navigator={this.props.navigation}
        defaultNav={false}
        bottomMenu={{
          visible: true,
          active: this.state.tabChanged,
        }}>


        <View style={{ height: Platform.OS === 'android' ? 140 : 156}}>
          <NavBar
            tintColor={Skin.BUTTON_BG_COLOR}
            statusBarTint={Skin.STATUS_BAR_TINT_COLOUR}
            statusBarLight={'light-content'}
            titleStyle={Skin.navbar.title.titleStyle}
            title={''}
            titleTint={Config.LOGO_COLOR}
            right={''}
            left={{
              text: this.props.isBackBtnText ? 'Back' : '',
              icon: this.props.isBackBtnText ? '' : Skin.icon.hamburger,
              iconStyle: this.props.isBackBtnText ? '' : {
                fontSize: 50,
                paddingLeft: 17,
                width: 50,
                color: 'white',
              },
              handler: this.props.handler
            }} />

          <View style={{ width: 300, height: 50, position: 'absolute', left: 60, top: Platform.OS=='android'?8:30 }}>
            <Text style={{ fontSize: 18, color: 'white',fontWeight:'bold' ,backgroundColor: 'transparent' }}>
              {"Your Store: Chatham"}
            </Text>
            <Text style={{ fontSize: 13, color: 'white', backgroundColor: 'transparent' }}>
              {"Open now until 9 PM"}
            </Text>
          </View>

        <View style={{backgroundColor:Skin.BUTTON_BG_COLOR}}>
          <View style={{ backgroundColor: 'white', height: 60, margin: 10, flexDirection: 'row' }}>
            <Text style={[styles.searchIcons, { marginLeft: 15 }]}>{Skin.icon.bell}</Text>
            <TextInput style={styles.searchBar} underlineColorAndroid='transparent' placeholder="Search"></TextInput>
            <Text style={styles.searchIcons}>{Skin.icon.bell}</Text>
            <Text style={[styles.searchIcons, { marginRight: 15 }]}>{Skin.icon.bell}</Text>
          </View>
        </View>

          <View style={{ width: 50, height: 50, position: 'absolute', right: 10 }}>
            <TouchableOpacity underlayColor='transparent' onPress={this.onPressNotificationView}>
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 35,
                height: 50,
                fontWeight: 'normal',
                top: Platform.OS === 'android' ? 12 : 32.5,
                backgroundColor: 'transparent',
                fontFamily: Skin.font.ICON_FONT
              }}>{Skin.icon.bell}</Text>

              {this.state.badgeValue > 0 && <Badge style={{
                top: Platform.OS === 'android' ? -45 : -24,
                right: -25,
              }} minWidth={12} minHeight={12} extraPaddingHorizontal={2} textStyle={{ color: '#fff', }} >
                {this.state.badgeValue > 9 ? "9+" : this.state.badgeValue}

              </Badge>}
            </TouchableOpacity>
          </View>
        </View>
        {/* <PageTitle title={this.state.titleString}
                handler={this.triggerDrawer}/> */}
        <ScrollView style={{backgroundColor:'white'}}>
        <View style={{
          flex: 1,
          backgroundColor: Skin.main.BACKGROUND_COLOR}}>

          {this.getComponent()}
        </View>
        </ScrollView>
      </Main>
    );
  }

}

const styles = StyleSheet.create({
  searchBar:{
    flex:1,
    backgroundColor:'transparent'
  },
  searchIcons:{
    fontFamily: Skin.font.ICON_FONT,
    fontSize: 25,
    width:30,
    marginTop:15,
    height:30,
    marginRight:5,
    color:Skin.BUTTON_BG_COLOR,
    textAlign:'center'
  },
  rowwrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontFamily: Skin.font.ICON_FONT,
    fontSize: 20,
  },
  iconwrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  namewrap: {
    flex: 3,
  },
  nametext: {
    fontSize: 14,
    color: Skin.colors.PRIMARY_TEXT,
    paddingTop: 3,
  },
  numtext: {
    fontSize: 12,
    color: ('rgba(' + Skin.colors.PRIMARY_TEXT_RGB + ',0.54)'),
    paddingTop: 3,
  },
  totalwrap: {
    flex: 2,
    flexDirection: 'column',
  },
  totaltext: {
    fontSize: 18,
    textAlign: 'right',
    flex: 1,
  },
});
