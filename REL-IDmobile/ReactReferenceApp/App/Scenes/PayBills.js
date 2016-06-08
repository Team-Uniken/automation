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
var BottomMenu = require('../Components/BottomMenu');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var NavigationBar = require('react-native-navbar');
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;

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
	StyleSheet
} = React;


class PayBillsScene extends React.Component{
	constructor(props){
		super(props);
	}
	render() {
		return (
            <Main
                drawerState={{
                    open: false, 
                    disabled: false
                }}
                navBar={{
                    title: 'Pay Bills',
                    visible: true,
                    tint: Skin.colors.TEXT_COLOR,
                    left:{
                        text: '',
                        icon: '\ue20e',
                        iconStyle: {
                            fontSize:30,
                            marginLeft:8,
                        },
                        textStyle:{},
                    }
                }}
                bottomMenu={{
                    visible: true,
                    active: 2,
                }}
                navigator={this.props.navigator}
            >  	
                <View style={{flex:1,backgroundColor:Skin.colors.BACK_GRAY}}>
					<Text>This is my Pay Bills content</Text>
				</View>
			</Main>
		);
	}
}

module.exports = PayBillsScene;
/*

			*/