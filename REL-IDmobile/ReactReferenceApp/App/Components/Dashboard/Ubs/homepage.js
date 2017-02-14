import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, ListView, Image } from 'react-native'
import Skin from '../../../Skin';
import Main from '../../Container/Main';
import ListItem from '../../ListItem';
import Events from 'react-native-simple-events'
import NavBar from '../../view/navbar.js'
import { FormattedCurrency } from 'react-native-globalize';

import Config from 'react-native-config'

import ControlPanel from '../ControlPanel';

const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


class HomePage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = { dataSource: ds.cloneWithRowsAndSections([]), };
  }


  componentDidMount() {
    this.getMyNotifications();
    this.getAccountDetails();
  }


  getMyNotifications() {
    ReactRdna.getNotifications(this.props.recordCount, this.props.startIndex, this.props.enterpriseID, this.props.startDate, this.props.endDate, (response) => {
      //console.log('----- NotificationMgmt.getMyNotifications.response ');
      //console.log(response);
      if (response[0].error !== 0) {
        console.log('----- ----- response is not 0');
      }
    });
  }

  getAccountDetails() {
    //
    // THIS IS WHERE YOU SWAP OUT FOR A REAL API CALL FOR DATA
    //
    const response = this.props.response
    if (response[0].error === 0) {
      const responseJson = JSON.parse(response[0].response);
      if (responseJson.status === 'success') {
        const accts = responseJson.accountList;
        const {data, sectionIds} = this.renderListViewData(accts.sort(this.compare));
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(data, sectionIds),
        });
        return { data };
      } else {
        alert(responseJson.status);
      }
    } else {
      alert(response[0].response);
    }

    return {}
  }

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
      title: rowData.title,
      icon: this.props.icons[rowData.accountType],
      iconcolor: this.props.iconcolor[rowData.accountType],
    }
    return cleanData;
  }

  /**
   * Splits the account data blob into sections and data rows
   * @param  {object} accounts object with accounts information
   * @return {object}          Object with both the data and the sectionIds
   */
  renderListViewData(accounts) {
    const data = {};
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
    return { data, sectionIds };
  }

  /**
   * Creates the section header for the various account types
   * @param  {object} data      The data blob of rows
   * @param  {string} sectionId The id of section being applied to this row
   * @return {JSX}              JSX of the row
   */
  renderSectionHeader(sectionData, sectionId) {
    return (<View></View>);
  }

  renderRow(rowData) {
    const cleanData = this.cleanRowData(rowData);
    return (
      <ListItem
        wrapstyle={{
          flex: 1,
          alignItems: 'center'
        }}
        rowstyle={{
          backgroundColor: Skin.colors.TEXT_COLOR,
          paddingTop: 0,
          paddingBottom: 0,
          width: Skin.magicwidth,
          marginBottom: 0,
        }}>
        <View style={Skin.layout3.row.rowwrap}>
          <View style={Skin.layout3.row.iconwrap}>
            <Text style={[Skin.layout3.row.icon, {
              color: cleanData.iconcolor
            }]}>
              {cleanData.icon}
            </Text>
          </View>
          <View style={Skin.layout3.row.namewrap}>
            <Text
              numberOfLines={2}
              style={Skin.layout3.row.nametext}>
              {cleanData.title}
            </Text>
            <View style={Skin.layout3.row.border}>
            </View>
          </View>
        </View>
      </ListItem>
    );
  }
  triggerDrawer() {
    console.log('trigger')
    Events.trigger('toggleDrawer')
  }
  render() {
    return (
      <Main
        controlPanel={ControlPanel}
        drawerState={this.props.drawerState}
        bottomMenu={this.props.menuState}
        navigator={this.props.navigator}
        defaultNav={true}
        navBar={{
          title: Skin.admin.MENU_TITLE,
          visible: true,
          navBarLine: false,
          left: {
            icon: Skin.icon.user,
            iconStyle: {
              fontSize: 35,
              paddingLeft: 17,
              width: 100,
              color: Config.THEME_COLOR,
            },

            textStyle: {},
            handler: this.triggerDrawer
          },
        }}
        bottomMenu={{
          visible: false,
        }}>
        <View style={[Skin.layout3.split.top.wrap, {
          justifyContent: 'space-between'
        }]}>
          <View style={{
            position: 'absolute',
            flex: 1,
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            backgroundColor: '#ffffff',
          }}>

            <Text style={{
              color: Config.THEME_COLOR,
              fontSize: 24,
              textAlign: 'center',
              marginTop: Skin.SCREEN_HEIGHT / 2 - 30
            }}>
              Welcome to {Skin.admin.MENU_TITLE}
            </Text>

          </View>
        </View>
      </Main>)
  }
}

HomePage.propTypes = {
  icons: PropTypes.object,
  headers: PropTypes.object,
  iconcolor: PropTypes.object,
  recordCount: PropTypes.string,
  startIndex: PropTypes.string,
  enterpriseID: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  response: PropTypes.object,
  drawerState: PropTypes.object,
  navState: PropTypes.object,
}

HomePage.defaultProps = {
  headers: {
    1: 'Savings',
    2: 'Personal Checking',
    3: 'Credit Cards',
  },
  drawerState: {
    open: false,
    disabled: false,
  },
  menuState: {
    visible: true,
    active: 1,
  },
  recordCount: '0',
  startIndex: '1',
  enterpriseID: '',
  startDate: '',
  endDate: '',
  icons: {
    1: Skin.icon.store,
    2: Skin.icon.gift,
    3: Skin.icon.timer,
  },
  iconcolor: {
    1: Skin.colors.POSITIVE_ACCENT,
    2: Skin.colors.ACCENT,
    3: Skin.colors.NEGATIVE_ACCENT,
  },
  response: {
    0: {
      error: 0,
      response: '{"accountList":[ \
                  {"title":"25% off in-store jeans purchase at Express","accountType":1},\
                  {"title":"25% off in-store purchase at Dong Liang","accountType":1},\
                  {"title":"10% off purchase at Philip Le Bac","accountType":2},\
                  {"title":"5% off any purchase at Mian Hua Tian","accountType":2},\
                  {"title":"10% off in-store purchase at Brocade Country (29:57min)","accountType":3}\
                 ], \
              "error":"", \
              "status":"success" \
            }',
    },
  },
}

export default HomePage
