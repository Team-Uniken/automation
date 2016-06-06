

var React = require('react-native');
var Skin = require('./Skin');
var BottomMenu = require('./BottomMenu');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var NavigationBar = require('react-native-navbar');

var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StyleSheet
} = React;


class Accounts extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			username: '',
			isLoading: false,
			error: false,
		}
	}

	openRoute(route){
		this.props.navigator.push(route)
	}

	buildAccounts(){
		return (
			<View style={{backgroundColor: 'white', flex:1}}>
			
			</View>
		);
	}

	render() {
		return (
			<View style={{ flex: 1, }}>
				<NavigationBar
		            title={{title:'Accounts',tintColor:Skin.colors.TEXT_COLOR}}
		            tintColor={Skin.colors.PRIMARY}
		            statusBar={{tintColor:Skin.colors.DARK_PRIMARY,style:'light-content'}}
		            leftButton={{
		              tintColor: Skin.colors.TEXT_COLOR,
		              textStyle: Skin.nav.icon,
		              title: "\ue20e",
		              handler: this.props.toggle,
		            }} 
	            />
	            {this.buildAccounts()}
				<BottomMenu navigator={this.props.navigator} />
			</View>
		);
	}
};

module.exports = Accounts;
