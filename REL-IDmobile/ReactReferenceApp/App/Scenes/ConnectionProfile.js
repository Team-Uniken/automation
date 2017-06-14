/**
 * import new connection profile or select existing profile for initialization.
 */
'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Modal from 'react-native-simple-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Text, View, ListView, TouchableHighlight, AsyncStorage, TextInput, Alert, Image, StyleSheet, BackHandler} from 'react-native'



/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';


/*
  INSTANCES
 */
let CONNECTION_PROFILES_DATA = [];
let CURRENT_CONNECTION_PROFILES_DATA = [];
let obj;



class ConnectionProfileScene extends Component {

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
  /*
    This is life cycle method of the react native component.
    This method is called when the component is Mounted/Loaded.
  */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function() {
      this.props.navigator.resetTo({
                id: 'Load'
              });
      return true;
    }.bind(this));

    AsyncStorage.getItem("ConnectionProfiles").then((profiles) => {
      CONNECTION_PROFILES_DATA = JSON.parse(profiles);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(CONNECTION_PROFILES_DATA)
      });
    }).done();

    AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
      CURRENT_CONNECTION_PROFILES_DATA = JSON.parse(currentProfile);
      console.log(CURRENT_CONNECTION_PROFILES_DATA);
    });
  }


//open import connection profile dialog.
  onImportPressed() {
    this.setState({
      open: true
    });
  }
//Validate entered connection profile is valide or not.
  validateURL(textval) {
    var urlregex = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/;
    return urlregex.test(textval);
  }
//check entered url is valid or not if it is valide than get connectionprofile from entered url and store it into database.
  checkURL() {
    const url = this.state.inputURL;
    if (url.length > 0) {
      if (this.validateURL(url)) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            const responseText = JSON.parse(text);
            if (responseText != null || responseText.length > 0) {
              const profileArray = responseText.Profiles;
              const relidArray = responseText.RelIds;
              for (let i = 0; i < profileArray.length; i++) {
                const RelIdName = profileArray[i].RelId;
                for (let j = 0; j < relidArray.length; j++) {
                  if (RelIdName === relidArray[j].Name) {
                    profileArray[i].RelId = relidArray[j].RelId;
                  }
                }
              }
              AsyncStorage.getItem('ConnectionProfiles', (err, profiles) => {
                let oldProfiles = JSON.parse(profiles);
                if (oldProfiles != null || oldProfiles > 0) {
                  for (let i = 0; i < oldProfiles.length; i++) {
                    for (let j = 0; j < profileArray.length; j++) {
                      if (oldProfiles[i].Name === profileArray[j].Name) {
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
              alert('Invalid connection profile.');
              this.setState({
                inputURL: '', open: false,
              });
            }
          })
          .catch((error) => {
            console.warn(error);
            alert('Invalid connection profile.');
            this.setState({
              inputURL: '',
              open: false,
            });
          });
      } else {
        alert('Invalid connection profile.');
        this.setState({
          inputURL: '',
        });
      }
    } else {
      alert('Please enter url');
    }
  }
  //onTextchange method for URLChange TextInput
  onURLChange(event) {
    var newstate = this.state;
    newstate.inputURL = event.nativeEvent.text;
    this.setState(newstate);
  }
/*
  This method is used to render the componenet with all its element.
*/
  renderConnectionProfile(connectionprofile1) {
    var cpName = connectionprofile1.Name;
    if (CURRENT_CONNECTION_PROFILES_DATA.Name == connectionprofile1.Name) {
      return (
        <View>
          <View style={Skin.ConnectionProfile.selectederow}>
            <TouchableHighlight>
              <Text style={[Skin.customeStyle.text1, {
                width: Skin.SCREEN_WIDTH - 72,
                textAlign: 'left',
                marginLeft: 16,
                opacity: 1
              }]}>
                {cpName}
              </Text>
            </TouchableHighlight>
          </View>
          <Text style={Skin.customeStyle.div1}>
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <View style={Skin.ConnectionProfile.customerow}>
            <TouchableHighlight
              onPress={() => this.onConnectionProfilePressed(connectionprofile1) }
              underlayColor={Skin.colors.REPPLE_COLOR}>
              <Text style={[Skin.customeStyle.text1, {
                width: Skin.SCREEN_WIDTH - 72,
                textAlign: 'left',
                marginLeft: 16,
                opacity: 1
              }]}>
                {cpName}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.onDeletePressed(connectionprofile1) }
              style={Skin.ConnectionProfile.button}
              underlayColor={Skin.colors.REPPLE_COLOR}>
              <Image
                source={{ uri: "del.png" }}
                style={Skin.ConnectionProfile.images} />
            </TouchableHighlight>
          </View>
          <Text style={Skin.customeStyle.div1}>
          </Text>
        </View>

      );
    }
  }
    //call when click on any connection profile row.
  onConnectionProfilePressed(connectionprofile1) {
    Alert.alert(
      'Message',
      'Select Profile ' + connectionprofile1.Name + ' ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            AsyncStorage.setItem('CurrentConnectionProfile', JSON.stringify(connectionprofile1), () => {
              this.props.navigator.replace({
                id: "Load"
              });
            });
          }
        },
      ]
    )
  }

  onDeletePressed(connectionprofile1) {
    Alert.alert(
      'Message',
      'Delete Profile ' + connectionprofile1.Name + ' ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            AsyncStorage.getItem('ConnectionProfiles', (err, _profiles) => {
              const profiles = JSON.parse(_profiles);
              if ((profiles != null) || (profiles.length > 0)) {
                for (let i = 0; i < profiles.length; i++) {
                  if (connectionprofile1.Name === profiles[i].Name) {
                    profiles.splice(i, 1);
                    AsyncStorage.getItem('CurrentConnectionProfile', (err, _currentProfile) => {
                      const currentProfile = JSON.parse(_currentProfile);
                      if (connectionprofile1.Name === currentProfile.Name) {
                        AsyncStorage.removeItem('CurrentConnectionProfile', (err) => {
                        });
                      }
                    });
                    CONNECTION_PROFILES_DATA = profiles;
                    AsyncStorage.setItem('ConnectionProfiles', JSON.stringify(profiles), () => {
                    });
                    obj.setState({
                      dataSource: obj.state.dataSource.cloneWithRows(CONNECTION_PROFILES_DATA),
                    });
                  }
                }
              }
            });
          }
        },
      ]
    );
  }
/*
  This method is used to render the componenet with all its element.
*/
  render() {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: true,
        }}

        navBar={{
          title: 'Connection Profiles',
          visible: true,
          tint: Skin.colors.TEXT_COLOR,
          left: {
            text: 'Back',
            icon: '',
            iconStyle: {},
            textStyle: {},
            handler: () => {
              console.log('inside'); this.props.navigator.resetTo({
                id: 'Load'
              });
            },
          },
        }}
        bottomMenu={{
          visible: false,
        }}
        navigator={this.props.navigator}>
        <View style={{
          flex: 1,
          backgroundColor: Skin.colors.BACK_GRAY
        }}>
          <View style={Skin.ConnectionProfile.DeviceListView}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderConnectionProfile.bind(this) } />
          </View>
          <TouchableHighlight
            style={{
              backgroundColor: Skin.login.CONNECTION_BUTTON_BG,
              width: 50,
              height: 50,
              borderRadius: 25,
              position: 'absolute',
              bottom: 70,
              right: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={1}
            underlayColor={Skin.colors.DARK_PRIMARY}
            onPress={() => this.onImportPressed() }>
            <Text style={{
              color: Skin.login.CONNECTION_BUTTON_ICON_COLOR,
              backgroundColor: 'transparent',
              fontSize: 30,
              fontWeight: 'bold',
              marginLeft: 0,
              marginTop: -2,
              fontFamily: Skin.font.ICON_FONT,
            }}>
              {'\u002b'}
            </Text>
          </TouchableHighlight>
        </View>
        <Modal
          style={styles.modalwrap}
          overlayOpacity={0.75}
          offset={100}
          open={this.state.open}
          modalDidOpen={() => console.log('modal did open') }
          modalDidClose={() => this.setState({
            open: false
          }) }>
          <View style={styles.modalTitleWrap}>
            <Text style={styles.modalTitle}>
              Import Profile
            </Text>
          </View>
          <TextInput
            autoCorrect={false}
            ref='inputURL'
            label={'Enter URL'}
            style={styles.modalInput}
            placeholder={'Enter url'}
            value={this.state.inputURL}
            placeholderTextColor={Skin.colors.HINT_COLOR}
            onSubmitEditing={this.checkURL.bind(this) }
            onChange={this.onURLChange.bind(this) } />
          <View style={styles.border}></View>
          <View style={{
            flex: 1,
            flexDirection: 'row'
          }}>
            <TouchableHighlight
              onPress={() => this.setState({
                inputURL: '', open: false
              }) }
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
                CANCEL
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.checkURL.bind(this) }
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
                IMPORT
              </Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </Main>
    );
  }
}


const styles = StyleSheet.create({
  modalwrap: {
    height: 130,
    flexDirection: 'column',
    borderRadius: 15,
  },
  modalTitleWrap: {
    justifyContent: 'center',
    flex: 1,
  },
  modalTitle: {
    color: Skin.colors.PRIMARY_TEXT,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  modalButtonText: {
    textAlign: 'center',
  },
  modalInput: {
    textAlign: 'left',
    color: Skin.colors.PRIMARY_TEXT,
    height: 32,
    padding:0,
    fontSize: 16,
    backgroundColor: null,
  },
  border: {
    height: 1,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
    marginBottom: 10,
  },
  DeviceListView: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    height: 48,
    width: 48,
    opacity: 0.6,
    justifyContent: "center",
    marginTop: 4,
  },
  images: {
    width: 18,
    height: 18,
    margin: 16,
  },
  customerow: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'transparent',
  },
});


module.exports = ConnectionProfileScene;
