import React, { Component } from 'react';
import Util from "../Utils/Util";
import ReactNative,{StyleSheet,View,Platform, TouchableHighlight,Text, TouchableOpacity, ScrollView,Dimensions} from 'react-native';
import Skin from '../../Skin';
import HTML from 'react-native-render-html';
import Modal from 'react-native-simple-modal';



export default class PasswordPolicyModal extends Component {
    constructor(props){
        super(props);

        this.state={
            showAlert:false
        }
        
        this.state.showAlert = this.props.show;
        this.selectedAlertOp = false;
        this.alertModal = this.alertModal.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.state.showAlert = nextProps.show;
    }

    alertModal() {
        return (<Modal
          style={styles.modalwrap}
          overlayOpacity={0.75}
          offset={100}
          open={this.state.showAlert}
          modalDidOpen={() => console.log('modal did open')}
          modalDidClose={() => {
            if (this.selectedAlertOp) {
              this.selectedAlertOp = false;
              this.props.onAlertModalOk();
            } else {
              this.selectedAlertOp = false;
              this.props.onAlertModalDismissed();
            }
          }}>
          <View style={styles.modalTitleWrap}>
            <Text style={styles.modalTitle}>
              Password Policy
            </Text>
          </View>
          
            <ScrollView >
                <HTML html={this.props.html} imagesMaxWidth={Dimensions.get('window').width} containerStyle={{ marginLeft: -10 }} />
            </ScrollView>
             
          <View style={styles.border}></View>
    
          <TouchableHighlight
            onPress={() => {
              this.selectedAlertOp = true;
              this.setState({
                showAlert: false
              });
            }}
            underlayColor={Skin.colors.REPPLE_COLOR}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>
              OK
            </Text>
          </TouchableHighlight>
        </Modal>);
      }
    
    render(){
        return this.alertModal();
    }
}

//Styles for alert modal
const styles = StyleSheet.create({
    modalwrap: {
     
      flexDirection: 'column',
      borderRadius: 15,
      backgroundColor: '#fff',
    },
    modalTitleWrap: {
      marginTop:10,
      justifyContent: 'center',
      marginBottom:15
    },
    modalTitle: {
      color: Skin.colors.PRIMARY_TEXT,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 15,
      fontWeight: 'bold',
      backgroundColor: 'transparent',
    },
    modalButton: {
      height: 40,
      alignItems: 'center',
      alignSelf: 'stretch',
      justifyContent: 'center',
    },
    modalButtonText: {
      textAlign: 'center',
      color: '#268CFE', 
      fontSize: 16,
    },
    border: {
      height: 1,
      marginTop: 16,
      backgroundColor: Skin.colors.DIVIDER_COLOR,
    },
  
    modalInput: {
      textAlign: 'center',
      color: Skin.colors.PRIMARY_TEXT,
      height: 32,
      padding: 0,
      fontSize: 16,
      backgroundColor: null,
    },
    listEmptyMessage: {
      justifyContent: 'center',
      alignItems: 'center',
      color: 'grey',
      fontSize: 18,
      textAlign: 'center'
  
    },
    listEmptyView: {
      flex: 1,
      alignSelf: 'center',
      marginBottom: 80,
    }
  });
  
