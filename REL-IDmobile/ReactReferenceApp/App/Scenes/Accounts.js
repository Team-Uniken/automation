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
var Main = require('../Components/Main');
var ListItem = require('../Components/ListItem');
var ListSectionHeader = require('../Components/ListSectionHeader');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
import { FormattedCurrency } from 'react-native-globalize';


/* 
  Instantiaions
*/
var {
    View,
    Text,
    Navigator,
    TextInput,
    TouchableHighlight,
    ActivityIndicatorIOS,
    StyleSheet,
    ListView,
} = React;
var self;
var headers = {1:'Savings',2:'Personal Checking',3:'Credit Cards'};
var icons = {1:'\ue2f7',2:'\ue277',3:'\ue285'};
var iconcolor = {1:Skin.colors.DIVIDER_COLOR,2:Skin.colors.POSITIVE_ACCENT,3:Skin.colors.ACCENT}
class AccountsScene extends React.Component{


    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
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
        this._getAccountDetails()
    }


    render() {
        return (
            <Main 
                drawerState={{
                    open: false, 
                    disabled: false
                }}
                navBar={{
                    title: 'Accounts',
                    visible: true,
                    leftText: '',
                    rightText: '',
                }}
                bottomMenu={{
                    visible: true,
                    active: 1,
                }}
                navigator={this.props.navigator}
            >   
                <View style={{flex:1,backgroundColor:Skin.colors.BACK_GRAY}}>
                  <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderSectionHeader = {this._renderSectionHeader}
                  />
                </View>
            </Main>
        );
    }

    /**
     * Retrieves the account data in a json format
     * @return {[type]} [description]
     */
    _getAccountDetails() {
        console.log('inaccountcall')
        var self = this;
        RDNARequestUtility.doHTTPGetRequest('http://apisdkdev.uniken.com:8080/APIBanking/getAccounts.jsp?userid=10', function(response) {
            //console.log('inrequest')
            

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
            0:{
                error: 0,
                response: 
                    '{"accountList":[ \
                        {"accountID":"2144","accountName":"CANDEMOACT10_01","nickname":"Personal Savings","accountBalance":15565.32,"accountType":1}, \
                        {"accountID":"3146","accountName":"CANDEMOACT10_03","nickname":"Joint Funds","accountBalance":3039.00,"accountType":2}, \
                        {"accountID":"2047","accountName":"CANDEMOACT10_04","nickname":"New Credit","accountBalance":-4074.52,"accountType":3}, \
                        {"accountID":"1445","accountName":"CANDEMOACT10_02","nickname":"","accountBalance":243.22,"accountType":2}, \
                        {"accountID":"1046","accountName":"CANDEMOACT10_03","nickname":"Joint Funds","accountBalance":3039.00,"accountType":2}, \
                        {"accountID":"9447","accountName":"CANDEMOACT10_04","nickname":"New Credit","accountBalance":-4074.52,"accountType":3}], \
                    "error":"", \
                    "status":"success" \
                    }'
                }
            }

            if (response[0].error == 0) {
                console.log(response)
                console.log(this)
                var responseJson = JSON.parse(response[0].response);
                if (responseJson.status === 'success') {
                    var accts = responseJson.accountList;
                    //return data;
                    //self.renderListViewData(accts.sort(self.compare));
                    var {data, sectionIds} = self._renderListViewData(accts.sort(self._compare));
                    //var data = full.data
                    //var sectionIds = full.sectionIds
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRowsAndSections(data, sectionIds),
                        //dataSource: self.state.dataSource.cloneWithRows(data),
                    });
                   console.log(data)
                  return {data}
                } else {
                    alert(responseJson.status);
                }
            } else {
                alert(response[0].response);
            }
        });
    }

    /**
     * Basic sorting function for map calls
     */
    _compare(a, b) {
        if (a.accountName < b.accountName)
            return -1;
        if (a.accountName > b.accountName)
            return 1;
        return 0;
    }

    /**
     * Splits the account data blob into sections and data rows
     * @param  {object} accounts object with accounts information
     * @return {object}          Object with both the data and the sectionIds
     */
    _renderListViewData(accounts) {
        var data = {};
        var sectionIds = [];
        accounts.map((account) => {
            var section = account.accountType;
            if(!data[section]){
                data[section] = [];
                sectionIds.push(section)
            }
            data[section].push(account);
        });
        return { data, sectionIds };
    }


    /**
     * Creates the section header for the various account types
     * @param  {object} data      The data blob of rows
     * @param  {string} sectionId The id of section being applied to this row
     * @return {JSX}              JSX of the row
     */
    _renderSectionHeader(data, sectionId) {
        return (
            <ListSectionHeader>{headers[sectionId]}</ListSectionHeader>
        )
    }

    _renderRow(rowData) {

        var cleanData = self._cleanRowData(rowData);

        return (
            <ListItem>
                <View style={styles.rowwrap}>
                    <View style={styles.iconwrap}>
                        <Text style={[styles.icon,{color: cleanData.iconcolor}]}>{cleanData.icon}</Text>
                    </View>
                    <View style={styles.namewrap}>
                        <Text numberOfLines={1} style={styles.nametext}>{cleanData.title}</Text>
                        <Text numberOfLines={1} style={styles.numtext}>{cleanData.acctnum}</Text>
                    </View>
                    <View style={styles.totalwrap}>
                        <View style={{flex:1}}>
                          <FormattedCurrency
                            value={cleanData.total}
                            currency="USD"
                            style={[styles.totaltext,{color:cleanData.totalcolor}]} />
                        </View>
                    </View>
                </View>
            </ListItem>
        )
    }

    _cleanRowData(rowData){
        var cleanData = {
            title: (rowData.nickname == "") ? rowData.accountName : rowData.nickname,
            icon: icons[rowData.accountType],
            iconcolor: iconcolor[rowData.accountType],
            acctnum: rowData.accountID,
            total: rowData.accountBalance,
            totalcolor: (rowData.accountBalance > 0) ? Skin.colors.POSITIVE_ACCENT :Skin.colors.SECONDARY_TEXT
        }
        //<Text style={{color: iconcolor[rowData.accountType]}}>{icons[rowData.accountType]}</Text>
        return cleanData;
    }



}

module.exports = AccountsScene;

var styles = StyleSheet.create({
    rowwrap:{
        flexDirection:'row',
        alignItems: 'center',
    },
    icon:{
        fontFamily: Skin.font.ICON_FONT,
        fontSize: 20,
    },
    iconwrap:{
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:20,
    },
    namewrap:{
        flex: 3,
        //backgroundColor:'red'
    },
    nametext:{
        fontSize:14,
        color: Skin.colors.PRIMARY_TEXT,
        paddingTop:3
    },
    numtext:{
        fontSize:12,
        color: 'rgba('+Skin.colors.PRIMARY_TEXT_RGB+',0.54)',
        paddingTop:3
    },
    totalwrap:{
        flex:2,
        flexDirection:'column',
        //backgroundColor: 'red'
    },
    totaltext:{
        fontSize:18,
        textAlign: 'right',
        flex:1,
        //backgroundColor:'lightblue'
    }
})