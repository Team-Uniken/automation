var React = require('react-native');
var Skin = require('../Skin');
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



class BottomMenu extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			username: '',
			isLoading: false,
			error: false,
			active: 1,
		}
	}

	openRoute(route){
		this.props.navigator.push(route)
	}

	buildboxes(active){
		var list={
			1:{
				icon:'%',
				title:'ACCOUNTS'
			},
			2:{
				icon:'\ue285',
				title:'PAY BILLS'				
			},
			3:{
				icon:'\ue21a',
				title:'DEPOSITS'				
			},
			4:{
				icon:'t',
				title:'FIND BRANCH'				
			},
			5:{
				icon:'$',
				title:'CONTACT'				
			},

		}

		buildout = [];
		for (var i=1; i < 6; i++) {
			if(active == i){
	 			buildout.push(
					<View key={'menu_'+i} style={Skin.botmenu.boxwraphover}>
						<View style={Skin.botmenu.hoverbar}>
						</View>
						<TouchableHighlight style={Skin.botmenu.boxhover}>
							<View style={{flex:1,flexDirection:'column'}}>
								<Text style={Skin.botmenu.icon}>{list[i]['icon']}</Text>
								<Text style={Skin.botmenu.title}>{list[i]['title']}</Text>
							</View>
						</TouchableHighlight>
					</View>
	 			);
	 		}else{
	 			buildout.push(
					<View key={'menu_'+i} style={Skin.botmenu.boxwrap}>
						<View style={Skin.botmenu.hoverbar_empty}>
						</View>
						<TouchableHighlight style={Skin.botmenu.box}>
							<View style={{flex:1,flexDirection:'column'}}>
								<Text style={Skin.botmenu.icon}>{list[i]['icon']}</Text>
								<Text style={Skin.botmenu.title}>{list[i]['title']}</Text>
							</View>
						</TouchableHighlight>
					</View>
	 			);
	 		}
		}
		return buildout;

	}


	render() {
		return (
			<View style={Skin.botmenu.wrap}>
				{this.buildboxes(this.state.active)}
			</View>
		);
	}
};


module.exports = BottomMenu;



Skin.botmenu = StyleSheet.create({
	hoverbar:{
		backgroundColor: 'rgba('+Skin.colors.PRIMARY_RGB+',0.25)',
		height: 10
	},
	hoverbar_empty:{
		backgroundColor: 'transparent',
		height: 10
	},
	boxwrap:{
		flexDirection:'column',
		marginTop:-20,
		flex:1,
	},
	boxwraphover:{
		flexDirection:'column',
		marginTop:-20,
		flex:1,
	},
	box:{
		flex: 1,
		backgroundColor: Skin.colors.DARK_PRIMARY,
	},
	boxhover:{
		backgroundColor: Skin.colors.PRIMARY,
		flex: 1,
	},
	wrap:{
		flexDirection:'row',
		height: 70
	},
	icon:{
		fontFamily: 'icomoon',
		fontSize: 30,
		paddingTop: 15,
		color: Skin.colors.TEXT_COLOR,
		flex:2,
		textAlign:'center'

	},
	title:{
		fontSize: 10,
		fontWeight: 'bold',
		color: Skin.colors.TEXT_COLOR,
		flex:1,
		textAlign: 'center'
	}
});
