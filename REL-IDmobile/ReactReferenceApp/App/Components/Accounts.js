

var React = require('react-native');
var Web = require('./Web');
var QBank = require('./Qbank');
var Appointment = require('./Appointment');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

//var Main = require('./Main');

var CORE_FONT = 'Century Gothic';
var NAV_BAR_TINT = '#FFFFFF'
var NAV_SHADOW_BOOL = true;
var MENU_TXT_COLOR = '#2579A2';
var MENU_HVR_COLOR = 'rgba(13, 23, 38, 1.0)';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';



var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StyleSheet
} = React;

var styles = StyleSheet.create({
	mainContainer: {
	    flex: 1,
	    flexDirection: 'column',
	    justifyContent: 'center',
	    backgroundColor: '#48BBEC'
	},
	row: {
		flex: 4,
		flexDirection: 'row'
	},
	grid:{
		flexDirection: 'column',
		flex:2,
		backgroundColor: 'rgba(100,0,70,0.5)'
	},
	icon:{
		color: ICON_COLOR,
		fontFamily: ICON_FAMILY,
		fontSize: 50,
		marginTop: 40,
		marginBottom: 10,
		textAlign: 'center',
		//backgroundColor: 'rgba(100,0,70,0.5)'
	},
	iconText:{
		color: ICON_COLOR,
		fontFamily: CORE_FONT,
		textAlign: 'center',
		fontSize: 20,
		//backgroundColor: 'rgba(100,50,70,0.5)'
	},
	A:{backgroundColor: '#2A799F'},
	B:{backgroundColor: '#267196'},
	C:{backgroundColor: '#226082'},
	D:{backgroundColor: '#205877'},
	E:{backgroundColor: '#1B4A69'},
	F:{backgroundColor: '#183F5B'},
	G:{backgroundColor: '#163651'},
	H:{backgroundColor: '#122941'},
});


var route1 = {component: Web, title:'Wikie'}

class Accounts extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			username: '',
			isLoading: false,
			error: false
		}
	}

	openRoute(route){
		this.props.navigator.push(route)
	}


	render() {
		return (
			<View style={styles.mainContainer}>

				<View style={styles.row}>
					<TouchableHighlight
						onPress={()=>{
							this.props.navigator.push(
								{id: "Web",title:"Uniken Wiki",url:"http://unikenwiki.com:1111"}
							);}
						}
						style={[styles.grid,styles.A]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>
						<View>
							<Text style={styles.icon}>(</Text>
							<Text style={styles.iconText}>Wiki</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={[styles.grid,styles.B]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}
					onPress={()=>{this.props.navigator.push({id: "Appointment", title:"Appointments"});}}
					>
						<View>
							<Text style={styles.icon}>)</Text>
							<Text style={styles.iconText}>Appointment</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={styles.row}>
					<TouchableHighlight style={[styles.grid,styles.C]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}
						onPress={()=>{this.props.navigator.push({id: "QBank", title:"QuickBank"});}}
					>
						<View>
							<Text style={styles.icon}>n</Text>
							<Text style={styles.iconText}>QuickBank</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={[styles.grid,styles.D]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}
						onPress={()=>{
							
							this.props.navigator.push(
								{id: "Device",title:"Device",url:"https://mail.google.com/mail/u/0/#inbox"}
							);}
						}
					>
						<View>
							<Text style={styles.icon}>o</Text>
							<Text style={styles.iconText}>Device</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={styles.row}>
					<TouchableHighlight style={[styles.grid,styles.E]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}
						onPress={()=>{
							this.props.navigator.push(
								{id: "Web",title:"Local ATMs",url:"https://www.google.com.hk/maps/search/atm/@22.3000942,114.1679975,15z?hl=en"}
							);}
						}
					>
						<View>
							<Text style={styles.icon}>q</Text>
							<Text style={styles.iconText}>ATMs</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={[styles.grid,styles.F]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}
						onPress={()=>{
							this.props.navigator.push(
								{id: "Web",title:"Dashboard",url:"http://minetheme.com/simplify1.0/"}
							);}
						}
					>
						<View>
							<Text style={styles.icon}>z</Text>
							<Text style={styles.iconText}>Dashboard</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={styles.row}>
					<TouchableHighlight style={[styles.grid,styles.G]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}
						onPress={()=>{
							this.props.navigator.push(
								{id: "Web",title:"Uniken",url:"http://unikenwiki.com:1111"}
							);}
						}
					>
						<View>
							<Text style={styles.icon}>}</Text>
							<Text style={styles.iconText}>Website</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={[styles.grid,styles.H]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}
						onPress={()=>{this.props.navigator.push({id: "SecureChat", title:"Chat"});}}
					>
						<View>
							<Text style={styles.icon}>v</Text>
							<Text style={styles.iconText}>Chat</Text>
						</View>
					</TouchableHighlight>
				</View>
			</View>
		);
	}
};

module.exports = Accounts;
