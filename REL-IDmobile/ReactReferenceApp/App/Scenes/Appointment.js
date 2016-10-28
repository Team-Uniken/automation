var React = require('react');
var ReactNative = require('react-native');
var AddAppointment = require('./AddAppointment');
var ToolBar = require('./ToolBar');
var Skin = require('../Skin');
var obj;

var appointmentData = [{
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
          } }>
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

var {View, Text, TouchableHighlight, StatusBar, ListView, Image, Navigator, TextInput, TouchableHighlight, } = React;

var Appointment = React.createClass({


  getInitialState: function () {
    obj = this;
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
    return {
      data,
      sectionIds
    };
  },
  renderRow(rowData) {
    return <SampleRow
      {...rowData}
      style={Skin.appointmentrow.row} />
  },
  render() {
    return (
      <View style={Skin.customeStyle.maincontainer}>
        <StatusBar
          backgroundColor={Skin.colors.STATUS_BAR_COLOR}
          barStyle='light-content' />
        <ToolBar
          navigator={this.props.navigator}
          title={this.props.title} />
        <ListView
          ref="listView"
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
        <TouchableHighlight
          style={[Skin.appointmentrow.floatbutton]}
          activeOpacity={1.0}
          underlayColor={Skin.colors.STATUS_BAR_COLOR}
          onPress={() => {
            obj.props.navigator.push({
              id: "AddAppointment",
              title: "Add Appointment",
              url: {
                'date': '2016-05-06',
                'time': '20:00',
                'location': 'Select Location',
                'msg': '',
                'buttontext': 'Save'
              }
            });
          } }>
          <View>
            BUG
            {/* BUG
                             <Image source={require('image!floatimage')} style={Skin.appointmentrow.plus} />
                              */}
          </View>
        </TouchableHighlight>
      </View>
    );
  },
});

module.exports = Appointment;
