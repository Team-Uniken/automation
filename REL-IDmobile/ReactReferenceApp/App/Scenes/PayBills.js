'use strict';
/*
    NEED
 */
import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Main';
import ListItem from '../Components/ListItem';
import ListSectionHeader from '../Components/ListSectionHeader';
import { FormattedCurrency } from 'react-native-globalize';

/*
  Instantiaions
*/
// const ReactRdna = React.NativeModules.ReactRdnaModule;
const RDNARequestUtility = React.NativeModules.RDNARequestUtility;
const {
    View,
    Text,
    StyleSheet,
    ListView,
} = React;
let self;
const headers = {
  1: 'Upcoming Bills',
  2: 'Recent Payments',
};
const icons = {
  1: '\ue08c',
  2: '\ue0c1',
};
const iconcolor = {
  1: Skin.colors.DIVIDER_COLOR,
  2: Skin.colors.POSITIVE_ACCENT,
};

export default class PayBillsScene extends React.Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      dataSource: ds.cloneWithRowsAndSections([]),
    };
    self = this;
  }

    /**
     * Creates the self object for reference later
     * @return {null}
     */
  componentDidMount() {
    this.getAccountDetails();
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
            response:
              '{"accountList":[ \
                  {"accountID":"2144","accountName":"CANDEMOACT10_01","nickname":"Capital Credit Card","accountBalance":-165.32,"accountType":1}, \
                  {"accountID":"3146","accountName":"CANDEMOACT10_03","nickname":"Signature Platinum Card","accountBalance":-39.00,"accountType":1}, \
                  {"accountID":"2047","accountName":"CANDEMOACT10_04","nickname":"Macy\'s Card","accountBalance":-474.52,"accountType":1}, \
                  {"accountID":"1445","accountName":"CANDEMOACT10_02","nickname":"UHEAA Loan","accountBalance":-43.22,"accountType":1}, \
                  {"accountID":"1046","accountName":"CANDEMOACT10_03","nickname":"Capital Credit Card","accountBalance":3039.00,"accountType":2}, \
                  {"accountID":"9447","accountName":"CANDEMOACT10_04","nickname":"UHEAA Loan","accountBalance":174.52,"accountType":2}], \
              "error":"", \
              "status":"success" \
            }',
          },
        };
        if (response[0].error === 0) {
          const responseJson = JSON.parse(response[0].response);
          if (responseJson.status === 'success') {
            const accts = responseJson.accountList;
            const { data, sectionIds } = self.renderListViewData(accts.sort(self.compare));
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
      //}
    //);
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
  renderSectionHeader(data, sectionId) {
    return (
      <ListSectionHeader>{headers[sectionId]}</ListSectionHeader>
    );
  }

  renderRow(rowData) {
    const cleanData = self.cleanRowData(rowData);
    return (
      <ListItem>
        <View style={styles.rowwrap}>
          <View style={styles.iconwrap}>
            <Text style={[styles.icon, { color: cleanData.iconcolor }]}>{cleanData.icon}</Text>
          </View>
          <View style={styles.namewrap}>
            <Text numberOfLines={1} style={styles.nametext}>{cleanData.title}</Text>
            <Text numberOfLines={1} style={styles.numtext}>{cleanData.acctnum}</Text>
          </View>
          <View style={styles.totalwrap}>
            <View style={{ flex: 1 }}>
              <FormattedCurrency
                value={cleanData.total}
                currency="USD"
                style={[styles.totaltext, { color: cleanData.totalcolor }]}
              />
            </View>
          </View>
        </View>
      </ListItem>
    );
  }

  render() {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: false,
        }}
        navBar={{
          title: 'Pay Bills',
          visible: true,
          tint: Skin.colors.TEXT_COLOR,
          left: {
            text: '',
            icon: '\ue20e',
            iconStyle: {
              fontSize: 30,
              marginLeft: 8,
            },
            textStyle: {},
          },
        }}
        bottomMenu={{
          visible: true,
          active: 2,
        }}
        navigator={this.props.navigator}
      >
        <View style={{ flex: 1, backgroundColor: Skin.colors.BACK_GRAY }}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSectionHeader={this.renderSectionHeader}
          />
        </View>
      </Main>
    );
  }
}

module.exports = PayBillsScene;

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
        // backgroundColor:'red'
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
        // backgroundColor: 'red'
  },
  totaltext: {
    fontSize: 18,
    textAlign: 'right',
    flex: 1,
        //backgroundColor:'lightblue'
  },
});
