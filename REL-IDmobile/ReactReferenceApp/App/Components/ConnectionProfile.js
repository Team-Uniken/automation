'use strict';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextField from 'react-native-md-textinput';

var React = require('react-native');
var ToolBar = require('./ToolBar');
import Modal from 'react-native-simple-modal';
var Skin = require('../Skin');
var Load = require('./Load');

var {
  Text,
  View,
  ListView,
  TextInput,
  TouchableHighlight,
  Dimensions,
  Component,
  AsyncStorage,
  Alert,
  Image,
  StatusBar,
} = React;

var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var CONNECTION_PROFILES_DATA = [];
var obj;

class ConnectionProfile extends Component {

  constructor(props) {
    super(props);
    obj = this;
    this.state = {
      inputURL: '',
      open: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
    };
  }
  open(){
    this.setState({open: true})
  }

  componentDidMount() {
    AsyncStorage.getItem("ConnectionProfiles").then((profiles) => {
        CONNECTION_PROFILES_DATA = JSON.parse(profiles);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(CONNECTION_PROFILES_DATA)
        });
    }).done();

  }
  onImportPressed() {
    this.open();
  }

  checkURL() {
    var url = this.state.inputURL;
    if (url.length>0) {
      fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        console.log(responseText);
        responseText = JSON.parse(responseText);
        if (responseText != null || responseText.length > 0) {
          var profileArray = responseText.Profiles;
          var relidArray = responseText.RelIds;
          for (let i = 0; i < profileArray.length; i++) {
              var RelIdName = profileArray[i].RelId;
              for(let j = 0; j < relidArray.length; j++) {
                if (RelIdName === relidArray[j].Name) {
                  profileArray[i].RelId = relidArray[j].RelId;
                }
              }
          }
          AsyncStorage.getItem('ConnectionProfiles', (err, oldProfiles) => {
            oldProfiles = JSON.parse(oldProfiles);
            if (oldProfiles != null || oldProfiles > 0) {
              for(var i = 0; i < oldProfiles.length; i++) {
                for(var j = 0; j < profileArray.length; j++) {
                  if (oldProfiles[i].Name == profileArray[j].Name) {
                    oldProfiles[i] = profileArray[j];
                    profileArray.splice(j, 1);
                    break;
                  }
                }
              }

              oldProfiles = oldProfiles.concat(profileArray);
              CONNECTION_PROFILES_DATA = oldProfiles;
              AsyncStorage.setItem('ConnectionProfiles', JSON.stringify(oldProfiles), () => {
                this.setState({
                  open: false,
                  dataSource: this.state.dataSource.cloneWithRows(CONNECTION_PROFILES_DATA)
                });
                alert('Imported connection profiles successfully.');
              });
            }
          });
        } else {
          alert('Invalid connection profile, contact admin');
          this.setState({
            open: false,
          });
        }
      })
      .catch((error) => {
        // console.warn(error);
        alert('Invalid connection profile, contact admin');
        this.setState({
          open: false,
        });
      });
    } else {
        alert('Please enter url');
      }
  }

  onURLChange(event){
		this.setState({inputURL: event.nativeEvent.text});
	}


  render() {
    return (
      <View style={Skin.customeStyle.maincontainer}>
           <StatusBar
           backgroundColor={Skin.colors.STATUS_BAR_COLOR}
           barStyle='light-content'/>
           <ToolBar navigator={this.props.navigator} title="Connection Profile"/>
           <View style={Skin.ConnectionProfile.DeviceListView}>
          <ListView
             dataSource={this.state.dataSource}
             renderRow={this.renderConnectionProfile.bind(this)} />
            </View>
            <TouchableHighlight style={[Skin.appointmentrow.floatbutton]} activeOpacity={1.0} underlayColor={Skin.colors.STATUS_BAR_COLOR}
              onPress={() => this.onImportPressed()}>
          <View>
          {/* BUG
          <Image source={require('./floatimage')} style={Skin.appointmentrow.plus} />
          */}
          </View>
        </TouchableHighlight>

       <Modal
       style={Skin.ConnectionProfile.branchstyle}
       offset={this.state.offset}
       open={this.state.open}
       modalDidOpen={() => console.log('modal did open')}
       modalDidClose={() => this.setState({open: false})}
       >
         <Text style={[Skin.customeStyle.text3,{textAlign:'left',marginTop:0,marginLeft:4}]}>Import file</Text>
         <TextField
         autoCorrect={false}
         ref='inputURL'
           label={'Enter URL'}
           labelColor={Skin.colors.HINT_COLOR}
           highlightColor={'transparent'}
           style={{height:40,textAlignVertical:'top'}}
           onSubmitEditing={this.checkURL.bind(this)}
           onChange={this.onURLChange.bind(this)}
         />
       <View style={Skin.ConnectionProfile.customerow}>
       <TouchableHighlight
       onPress={() => this.setState({open: false})}
       underlayColor={Skin.colors.REPPLE_COLOR}
       style={{height:48,width:70,marginLeft:100}}
       >
       <Text style={[Skin.customeStyle.text1,{width:70,opacity:1}]}>CANCEL</Text>
       </TouchableHighlight>
       <TouchableHighlight
       onPress={this.checkURL.bind(this)}
       underlayColor={Skin.colors.REPPLE_COLOR}
       style={{height:48,width:70}}>
       <Text style={[Skin.customeStyle.text1,{width:70,color:'#007ECE',opacity:1}]}>IMPORT</Text>
       </TouchableHighlight>
</View>
       </Modal>
    </View>
  );
  }

  renderConnectionProfile(connectionprofile1) {
    var cpName = connectionprofile1.Name;
    return (
      <View>
      <View style={Skin.ConnectionProfile.customerow}>
          <TouchableHighlight onPress={() => this.onConnectionProfilePressed(connectionprofile1)}
            underlayColor={Skin.colors.REPPLE_COLOR}>
        	<Text style={[Skin.customeStyle.text1,{width:Skin.SCREEN_WIDTH-72,textAlign:'left',marginLeft:16}]}>{cpName}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.onDeletePressed(connectionprofile1) } style={Skin.ConnectionProfile.button}
          underlayColor={Skin.colors.REPPLE_COLOR}
          >
          {/* BUG
          <Image source={require('./del')} style={Skin.ConnectionProfile.images} />
          */}
          </TouchableHighlight>
      </View>
      <Text style={Skin.customeStyle.div1}> </Text>
      </View>

    );
  }

  onConnectionProfilePressed(connectionprofile1) {
    Alert.alert(
      'Message',
      'Select Profile ' + connectionprofile1.Name + ' ?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          AsyncStorage.setItem('CurrentConnectionProfile', JSON.stringify(connectionprofile1), () => {this.props.navigator.push({id: "Load"})});


      }},
      ]
    )
  }

  onDeletePressed(connectionprofile1) {
    Alert.alert(
      'Message',
      'Delete Profile ' + connectionprofile1.Name + ' ?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {AsyncStorage.getItem('ConnectionProfiles', (err, profiles) => {
          profiles = JSON.parse(profiles);
          if ((profiles != null) || (profiles.length > 0)) {
            for (var i = 0; i < profiles.length; i++) {
              if (connectionprofile1.Name === profiles[i].Name) {
                profiles.splice(i, 1);
                AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
                  currentProfile = JSON.parse(currentProfile);
                  if (connectionprofile1.Name == currentProfile.Name) {
                    AsyncStorage.removeItem('CurrentConnectionProfile', (err) => {});
                  }
                });
                CONNECTION_PROFILES_DATA = profiles;
                AsyncStorage.setItem('ConnectionProfiles', JSON.stringify(profiles), () => {});
                obj.setState({
                  dataSource: obj.state.dataSource.cloneWithRows(CONNECTION_PROFILES_DATA)
                });

              }
            }
          }
        });
      }},
      ]
    )
  }
}

module.exports = ConnectionProfile;
