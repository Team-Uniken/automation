import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, ListView, Image } from 'react-native'
import Skin from '../../../Skin';
import Main from '../../Container/Main';
import ControlPanel from '../ControlPanel';
import ListItem from '../../../Components/ListItem';
import Events from 'react-native-simple-events'
import NavBar from '../../view/navbar.js'
import { FormattedCurrency } from 'react-native-globalize';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


class History extends Component {
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

  cleanRowData(rowData) {
    const cleanData = {
      title: rowData.title,
      date: rowData.date,
      location: rowData.location,
      bal: rowData.bal,
      pts: rowData.pts
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
          <View style={Skin.layout3.row.namewrap}>
            <Text
              numberOfLines={1}
              style={Skin.layout3.row.nametext}>
              {cleanData.title}
            </Text>
            <Text
              numberOfLines={1}
              style={Skin.layout3.row.numtext}>
              {cleanData.location}
            </Text>
            <Text
              numberOfLines={1}
              style={Skin.layout3.row.numtext}>
              {cleanData.date}
            </Text>
          </View>
          <View style={Skin.layout3.row.totalwrap}>
            <View style={{ flex: 1 }}>
              <FormattedCurrency
                value={cleanData.bal}
                currency="USD"
                style={Skin.layout3.row.baltext} />
              <Text
                numberOfLines={1}
                style={Skin.layout3.row.ptstext}>
                {cleanData.pts} pts
              </Text>
            </View>
          </View>
        </View>
        <View style={Skin.layout3.row.border} />
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
        defaultNav={false}>
        <NavBar
          title={'History'}
          right={''}
          titleTint={Skin.main.TITLE_COLOR}
          tintColor={'#ffffff'}
          left={{
            icon: Skin.icon.hamburger,
            iconStyle: {
              fontSize: 35,
              paddingLeft: 17,
              width: 100,
              color: Skin.navbar.icon.color,
            },
            handler: this.triggerDrawer
          }} />
        <View style={{ height: 1, backgroundColor: Skin.main.TITLE_COLOR }}/>
        <View style={Skin.layout3.split.bottom}>
          <ListView
            contentContainerStyle={{ paddingTop: 12 }}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this) }
            renderSectionHeader={this.renderSectionHeader.bind(this) } />
        </View>
      </Main>
    )
  }

}

History.propTypes = {
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

History.defaultProps = {
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
    active: 2,
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
                  {"date":"10/1/16","location":"New York City, NY","title":"Brocade Country","pts":150,"bal":15565.32}, \
                  {"date":"10/1/16","location":"Central, HK","title":"Express","pts":77,"bal":3039.00}, \
                  {"date":"10/1/16","location":"San Francisco, CA","title":"Philip Le Bac","pts":10,"bal":-4074.52}, \
                  {"date":"10/1/16","location":"London, UK","title":"Mian Hua Tian","pts":24,"bal":243.22}, \
                  {"date":"10/1/16","location":"Shanghai, CH","title":"Alibaba","pts":30,"bal":1357.98}, \
                  {"date":"10/1/16","location":"Austin, TX","title":"Tiffany & Co.","pts":80,"bal":-403.12}], \
              "error":"", \
              "status":"success" \
            }',
    },
  },
}

export default History