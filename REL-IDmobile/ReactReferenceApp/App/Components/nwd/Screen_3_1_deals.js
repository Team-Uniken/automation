import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, ListView, Image } from 'react-native'
import Skin from '../../Skin';
import Main from '../../Components/Main';
import ListItem from '../../Components/ListItem';
import NavBar from '../view/navbar.js'
import { FormattedCurrency } from 'react-native-globalize';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


class Screen_3_1_deals extends Component {
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

    return { }
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
      title: (rowData.nickname === '') ? rowData.accountName : rowData.nickname,
      icon: this.props.icons[rowData.accountType],
      iconcolor: this.props.iconcolor[rowData.accountType],
      acctnum: rowData.accountID,
      total: rowData.accountBalance,
      totalcolor: (rowData.accountBalance > 0) ? Skin.colors.POSITIVE_ACCENT : Skin.colors.SECONDARY_TEXT,
    }
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
  renderSectionHeader(sectionData, sectionId) {
    return (
      <View style={Skin.layout3.listheader.wrap}>
        <View style={Skin.layout3.listheader.rowwrap}>
          <Text style={Skin.layout3.listheader.text}>
            {this.props.headers[sectionId]}
          </Text>
        </View>
      </View>
      );
  }

  renderRow(rowData) {
    const cleanData = this.cleanRowData(rowData);
    return (
      <ListItem>
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
              numberOfLines={1}
              style={Skin.layout3.row.nametext}>
              {cleanData.title}
            </Text>
            <Text
              numberOfLines={1}
              style={Skin.layout3.row.numtext}>
              {cleanData.acctnum}
            </Text>
          </View>
          <View style={Skin.layout3.row.totalwrap}>
            <View style={{ flex: 1 }}>
              <FormattedCurrency
                value={cleanData.total}
                currency="USD"
                style={[Skin.layout3.row.totaltext, {
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
        drawerState={this.props.drawerState}
        bottomMenu={this.props.menuState}
        navigator={this.props.navigator}>
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
                         backgroundColor: '#ffae00',
                       }}>
            <Image
              source={require('../../img/purse.png')}
              style={Skin.layout3.split.top.bg} />
          </View>
          <NavBar tintColor={'transparent'} />
          <View style={{
                         flex: 1,
                         flexDirection: 'column',
                         alignItems: 'flex-end',
                         justifyContent: 'flex-end',
                       }}>
            <Text style={{
                           color: '#ffffff',
                           fontSize: 20,
                           textTransform: 'uppercase',
                           textAlign: 'right',
                           paddingRight: 15,
                         }}>
              Member Points
            </Text>
            <Text style={{
                           color: '#ffffff',
                           fontSize: 50,
                           textAlign: 'right',
                           paddingRight: 15,
                           paddingBottom: 20,
                         }}>
              1,088
            </Text>
          </View>
        </View>
        <View style={Skin.layout3.split.bottom}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSectionHeader={this.renderSectionHeader.bind(this)} />
        </View>
      </Main>
    )
  }

}

Screen_3_1_deals.propTypes = {
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

Screen_3_1_deals.defaultProps = {
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
    1: '\ue2f7',
    2: '\ue277',
    3: '\ue285',
  },
  iconcolor: {
    1: Skin.colors.DIVIDER_COLOR,
    2: Skin.colors.POSITIVE_ACCENT,
    3: Skin.colors.ACCENT,
  },
  response: {
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
  },
}

export default Screen_3_1_deals