'use strict';
/*
    NEED
 */

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, StyleSheet,ListView, Image } from 'react-native'

import Skin from '../../../Skin';
import Main from '../../Container/Main';
import ListItem from '../../ListItem';
/*
  CALLED
*/
import ListSectionHeader from '../../ListSectionHeader';
import { FormattedCurrency } from 'react-native-globalize';
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
/*
  Instantiaions
*/
// const ReactRdna = React.NativeModules.ReactRdnaModule;
const RDNARequestUtility = ReactNative.NativeModules.RDNARequestUtility;

import ControlPanel from '../ControlPanel';
import Config from 'react-native-config';
import NavBar from '../../view/navbar.js';


let self;
const headers = {
  1: 'Savings',
  2: 'Personal Checking',
  3: 'Credit Cards',
};
const icons = { 1: '\ue2f7',2: '\ue277',3: '\ue285', };
const iconcolor = {
  1: Skin.colors.DIVIDER_COLOR,
  2: Skin.colors.POSITIVE_ACCENT,
  3: Skin.colors.ACCENT,
};


export default class AccountsScene extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = { dataSource: ds.cloneWithRowsAndSections([]), };
    self = this;
  }

  /**
   * Creates the self object for reference later
   * @return {null}
   */
  componentDidMount() {
    this.getMyNotifications();
    this.getAccountDetails();
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
                  {"accountID":"2144","accountName":"CANDEMOACT10_01","nickname":"Personal Savings","accountBalance":15565.32,"accountType":1}, \
                  {"accountID":"3146","accountName":"CANDEMOACT10_03","nickname":"Joint Funds","accountBalance":3039.00,"accountType":2}, \
                  {"accountID":"2047","accountName":"CANDEMOACT10_04","nickname":"Platinum Credit","accountBalance":-4074.52,"accountType":3}, \
                  {"accountID":"1445","accountName":"CANDEMOACT10_02","nickname":"","accountBalance":243.22,"accountType":2}, \
                  {"accountID":"1046","accountName":"CANDEMOACT10_03","nickname":"Direct Deposit Acct","accountBalance":1357.98,"accountType":2}, \
                  {"accountID":"9447","accountName":"CANDEMOACT10_04","nickname":"New Credit","accountBalance":-403.12,"accountType":3}], \
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

  cleanRowData(rowData) {
    const cleanData = {
      title: (rowData.nickname === '') ? rowData.accountName : rowData.nickname,
      icon: icons[rowData.accountType],
      iconcolor: iconcolor[rowData.accountType],
      acctnum: rowData.accountID,
      total: rowData.accountBalance,
      totalcolor: (rowData.accountBalance > 0) ? Skin.colors.POSITIVE_ACCENT : Skin.colors.SECONDARY_TEXT,
    };
    // <Text style={{color: iconcolor[rowData.accountType]}}>{icons[rowData.accountType]}</Text>
    return cleanData;
  }

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

  renderRow(rowData) {
    const cleanData = self.cleanRowData(rowData);
    return (
      <ListItem>
        <View style={styles.rowwrap}>
          <View style={styles.iconwrap}>
            <Text style={[styles.icon, {
                           color: cleanData.iconcolor
                         }]}>
              {cleanData.icon}
            </Text>
          </View>
          <View style={styles.namewrap}>
            <Text
              numberOfLines={1}
              style={styles.nametext}>
              {cleanData.title}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.numtext}>
              {cleanData.acctnum}
            </Text>
          </View>
          <View style={styles.totalwrap}>
            <View style={{ flex: 1 }}>
              <FormattedCurrency
                value={cleanData.total}
                currency="USD"
                style={[styles.totaltext, {
                         color: cleanData.totalcolor
                       }]} />
            </View>
          </View>
        </View>
      </ListItem>
      );
  }

  render() {
    return (
     <Main
        controlPanel={ControlPanel}
        drawerState={this.props.drawerState}
        navigator={this.props.navigator}
        defaultNav={false}
            navBar={{
            title: '',
            visible: true,
            navBarLine:false,
            left: {
            icon: Skin.icon.user,
            iconStyle: {
            fontSize: 35,
            paddingLeft: 17,
            width: 100,
            color: Config.THEME_COLOR,
            },
            handler: this.triggerDrawer
            },
            }}
         bottomMenu={{
          visible: false,
            
        }}>
            
          <NavBar
            tintColor={'#fff'}
            statusBarTint={'transparent'}
            statusBarLight={'light-content'}
            title={'Accounts'}
            titleTint={'#000000'}
            right={''}
            left={{
              icon: Skin.icon.user,
              iconStyle: {
                fontSize: 35,
                paddingLeft: 17,
                width: 100,
                color: '#000000',
              },
              handler: this.triggerDrawer
            }} />
            
        <View style={{
                       flex: 1,
                       backgroundColor: Skin.main.BACKGROUND_COLOR
                     }}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSectionHeader={this.renderSectionHeader} />
        </View>
      </Main>
      );
  }

}

const styles = StyleSheet.create({
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
