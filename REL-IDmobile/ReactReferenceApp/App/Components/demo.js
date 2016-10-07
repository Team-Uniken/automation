
import React from 'react';
import ReactNative from 'react-native';
import MainActivation from './MainActivation';
import Skin from '../Skin';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Events from 'react-native-simple-events';
const {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
} = ReactNative;
const{Component} =  React;


var challenges = [{
		"chlng_idx": 1,
		"sub_challenge_index": 0,
		"chlng_name": "secqa",
    "chlng_type":"compulsory"
	}, {
		"chlng_idx": 2,
		"sub_challenge_index": 0,
		"chlng_name": "pass",
     "chlng_type":"compulsory"
	},{
		"chlng_idx": 3,
		"sub_challenge_index": 0,
		"chlng_name": "password",
     "chlng_type":"optional",
	}, {
		"chlng_idx": 4,
		"sub_challenge_index": 0,
		"chlng_name": "devbind",
     "chlng_type":"compulsory"
	}, {
		"chlng_idx": 5,
		"sub_challenge_index": 0,
		"chlng_name": "devname",
     "chlng_type":"optional",
	}]


var arr = [];
var optional=false;


var styles = StyleSheet.create({                             
  
    labelStyle: {
        flex: 1
    },
    checkboxStyle: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 5
    }                                                        
  });


var OptionalRow = React.createClass({
  selectCheckbox() {
       if(arr[this.props.chlng_idx-1]==0){
           arr[this.props.chlng_idx-1]=1;
           challenges[this.props.chlng_idx-1].chlng_type="compulsory";
         }else{
           arr[this.props.chlng_idx-1]=0;
           challenges[this.props.chlng_idx-1].chlng_type="optional";
         }
        this.setState({ });  
    },
render() {
  var check='';
          if(arr[this.props.chlng_idx-1]==1){
           check='\u2714';
          }
 return (
      <CheckboxField
                label={this.props.chlng_name}
                defaultColor='tranprant'
                onSelect={this.selectCheckbox}
                selectedColor="#247fd2"
                labelStyle={Skin.AccountActivationStep.optional_chlng_name}
                checkboxStyle={styles.checkboxStyle}
                labelSide="right">
                <Text style={{ color: '#fff' }}>{check}</Text>
            </CheckboxField>
    )
  }
});

class ActivationStep extends Component {
  constructor(props) {
    super(props);
    for(var i=0; i<challenges.length;i++){
      arr[i]=0;
      if(challenges[i].chlng_type=='optional'){
          optional=true;
      }
    }
    this.state = {
    dataSource: new ListView.DataSource({
                                       rowHasChanged: (r1, r2) => r1 !== r2,
                                        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
                                        }),
    };
  }
checkStep(){
  var selected=false;
        for (var i = 0; i <= arr.length; i++) {
          if(arr[i]==1){
           selected=true;
           break;
          }
        }
        if(i==arr.length+1 && optional==true)
        {
          alert('Select atleast 1 optional challenge.');
        }else{
            responseJson = this.props.url.chlngJson;
     // responseJson.chlng_resp[0].response = un;
      Events.trigger('showCurrentChallenge', { response: responseJson });
        }
}
convertChallengeArrayToMap() {
  var challengeMap = {}; // Create the blank map
  challenges.forEach(function(chlng) {
    if (!challengeMap[chlng.chlng_type]) {
      // Create an entry in the map for the category if it hasn't yet been created
      challengeMap[chlng.chlng_type] = [];
    }
    challengeMap[chlng.chlng_type].push(chlng);
  });
  return challengeMap;
}
  componentDidMount() {
    this.setState({
                  dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertChallengeArrayToMap())
                  });    
  }
  render() {
    return (  
                <MainActivation
                navigator={this.props.navigator}>
                 <Text style={Skin.AccountActivationStep.title}>Account Activation Steps</Text>
                 <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow}
                  renderSectionHeader={this.renderSectionHeader}
                  />
                  <View style={Skin.activationStyle.input_wrap}>
                    <TouchableHighlight
                     onPress={this.checkStep.bind(this)}
                       style={Skin.activationStyle.button}
                       underlayColor={'#082340'}
                      activeOpacity={0.6}>
                    <Text style={Skin.activationStyle.buttontext}>Continue</Text>
                  </TouchableHighlight>
                </View>
                </MainActivation>
            );
  }
renderRow(challenge) {
  if(challenge.chlng_type=="optional"){
 return <OptionalRow
    {...challenge}
    />
  }else{
 return (
      <Text style={Skin.AccountActivationStep.compulsory_chlng_name}>{challenge.chlng_name}</Text>
    )
  }
}

renderSectionHeader(sectionData, chlng_type) {
  return (
    <View>
    <Text style={Skin.AccountActivationStep.header}>{chlng_type}</Text>
        <View style={Skin.AccountActivationStep.seprator}/>
</View>
  )
}

}

module.exports = ActivationStep;