'use strict';

import React from 'react';
import ReactNative from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/


/*
  Instantiaions
*/
const {
  View,
  Text,
  TouchableHighlight,
  ListView,
} = ReactNative;

const{Component} =  React;

let obj;
const appointmentData = [{
  "date": "2016-05-06",
  "time": "20:00",
  "location": "Nagpur",
  "msg": "React native demo ..."
},
  {
    "date": "2016-03-07",
    "time": "18:00",
    "location": "pune",
    "msg": "Meeting with Robbert"
  },
  {
    "date": "2016-03-07",
    "time": "08:00",
    "location": "mumbai",
    "msg": "REL_ID Demo ...."
  },
  {
    "date": "2016-09-08",
    "time": "19:00",
    "location": "pune",
    "msg": "Team Lunch .."
  }];

function compare(a, b) {
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
  if (a.date == b.date) {
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
      <View style={Skin.appointmentrow.customerow}>
        <TouchableHighlight
          activeOpacity={1.0}
          underlayColor={Skin.colors.REPPLE_COLOR}
          onPress={() => {
           obj.props.navigator.push({
             id: "AddAppointment",
             title: "Add Appointment",
             url: {
               'date': this.props.date,
               'time': this.props.time,
               'location': this.props.location,
               'msg': this.props.msg,
               'buttontext': 'Update'
             }
           });
         }}>
          <View style={Skin.appointmentrow.col}>
            <View style={Skin.appointmentrow.row}>
              <Text style={Skin.appointmentrow.date}>
                {this.props.date}
              </Text>
              <Text style={Skin.appointmentrow.time}>
                {this.props.time}
              </Text>
            </View>
            <View style={Skin.appointmentrow.row}>
              {/* BUG
                                                                                                                                                    <Image source={require('./location')} style={Skin.appointmentrow.locationimage} />
                                                                                                                                                    */}
              <Text style={Skin.appointmentrow.locatontext}>
                {this.props.location}
              </Text>
            </View>
            <Text style={Skin.appointmentrow.msg}>
              {this.props.msg}
            </Text>
            <Text style={Skin.appointmentrow.div1}>
            </Text>
          </View>
        </TouchableHighlight>
      </View>
      );
  }
});


export default class Appointment extends Component {

  constructor(props) {
    super(props);
    obj = this;
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    var {data, sectionIds} = this.renderListViewData(appointmentData.sort(compare));
    this.state ={
      dataSource: ds.cloneWithRowsAndSections(data, sectionIds)
    } 
  }

  renderListViewData(users) {
    const data = {};
    const sectionIds = [];
    users.map((user) => {
      const section = user.date.charAt(0);
      if (sectionIds.indexOf(section) === -1) {
        sectionIds.push(section);
        data[section] = [];
      }
      data[section].push(user);
    });
    return {
      data,
      sectionIds,
    };
  }

  renderRow(rowData) {
    return (
      <SampleRow
        {...rowData}
        style={Skin.appointmentrow.row}
      />
    );
  }

  render() {
    return (
      <Main>
        <ListView
          ref={'listView'}
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
        <TouchableHighlight
          style={[Skin.appointmentrow.floatbutton]}
          activeOpacity={1.0}
          underlayColor={Skin.colors.STATUS_BAR_COLOR}
          onPress={() => {
            obj.props.navigator.push({
              id: 'AddAppointment',
              title: 'Add Appointment',
              url: {
                date: '2016-05-06',
                time: '20:00',
                location: 'Select Location',
                msg: '',
                buttontext: 'Save',
              },
            });
          }}
        >
          <View>
            BUG
          </View>
        </TouchableHighlight>
      </Main>
    );
  }
}

module.exports = Appointment;
