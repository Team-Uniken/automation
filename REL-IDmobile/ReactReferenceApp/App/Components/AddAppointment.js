'use strict';

/*
  NEED
 */
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Main';
import Modal from 'react-native-simple-modal';
import DatePicker from 'react-native-datepicker';
import PickerAndroid from 'react-native-picker-android';


const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Animated,
  Platform,
  PickerIOS,
  TouchableOpacity,
} = ReactNative;

const{Component} = React;

const Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;


class AddAppointment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: this.props.url.date,
      time: this.props.url.time,
      location: this.props.url.location,
      message: '',
    };
  }

  componentDidMount() {
    this.setState({ message: this.props.url.msg });
  }

  getOptionList() {
    return this.refs.OPTIONLIST;
  }

  open() {
    this.setState({ open: true });
  }
  render() {
    const make = location[this.state.SelectedBranch];
    return (
      <Main>
        <ScrollView>
          <View style={Skin.addappointment.row}>
            <Text style={Skin.addappointment.textstyle}> Date : </Text>
            <Text style={Skin.addappointment.edittextstyle}>{this.props.url.date}</Text>
            <Animated.View style={[Skin.addappointment.datestyle,{opacity:0}]}>
              <DatePicker
                style={{width: 200}}
                date={this.state.date}
                mode="date"
                format="YYYY-MM-DD"
                minDate="2016-05-03"
                maxDate="2018-12-31"
                onDateChange={(date) => {this.setState({date: date})}}
              />
            </Animated.View>
          </View>
          <View style={Skin.addappointment.row}>
            <Text style={Skin.addappointment.textstyle}> Time : </Text>
            <Text style={Skin.addappointment.edittextstyle}>{this.props.url.time}</Text>
            <Animated.View style={[Skin.addappointment.datestyle,{opacity:0}]}>
              <DatePicker
                style={{width: 200}}
                date={this.state.time}
                mode="time"
                format="HH:mm"
                onDateChange={(time) => {this.setState({time: time})}}
              />
            </Animated.View>
          </View>
          <View style={Skin.addappointment.row}>
            <Text style={Skin.addappointment.textstyle}> Location : </Text>
            <TouchableOpacity onPress={() => this.open()}>
              <Text style={Skin.addappointment.edittextstyle}>{make.name}</Text>
            </TouchableOpacity>
          </View>
          <View style={Skin.addappointment.msgrow}>
            <Text style={Skin.addappointment.msgtextstyle}> Message : </Text>
            <View style={Skin.addappointment.border}>
              <TextInput
                returnKeyType={'next'}
                placeholder={'Enter Message'}
                placeholderTextColor={Skin.colors.HINT_COLOR}
                style={Skin.addappointment.input}
                multiline={true}
              >
            </TextInput>
          </View>
        </View>
        <TouchableHighlight
          style={[Skin.customeStyle.roundcornerbutton]}
          underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
          activeOpacity={0.6}
        >
          <Text style={Skin.customeStyle.button}>{this.props.url.buttontext}</Text>
        </TouchableHighlight>
      </ScrollView>
      <Modal
        style={[Skin.addappointment.branchstyle,{alignItems: 'center'}]}
        offset={this.state.offset}
        open={this.state.open}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={() => this.setState({open: false})}
      >
        <Picker
          selectedValue={this.state.SelectedBranch}
          onValueChange={(SelectedBranch) => this.setState({SelectedBranch, modelIndex: 0})}
        >
          {Object.keys(location).map((index) => (
            <PickerItem
              key={index}
              value={index}
              label={location[index].name}
            />
          ))}
        </Picker>
      </Modal>
    </Main>

            );
  }
}

module.exports = AddAppointment;
