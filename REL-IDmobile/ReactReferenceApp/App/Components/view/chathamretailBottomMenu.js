/*
  ALWAYS NEED
*/
'use strict';

import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import Skin from '../../Skin';
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var NavigationBar = require('react-native-navbar');
import { NavigationActions } from 'react-navigation'
import Events from 'react-native-simple-events';

class BottomMenu extends React.Component{

	constructor(props){
		super(props);
		//console.log(props);
	this.state = {
			visible: this.props.bottomMenu.visible,
			active: this.props.bottomMenu.active,
		};
	}

	render() {
		if(this.state.visible){
			return (
				<View style={Skin.botmenu.wrap}>
					{this.buildboxes(this.props.bottomMenu.active)}
				</View>
			);
		}
		return null;
	}

	buildboxes(active){
		var buildout = [];
		for (let i=1; i < 5; i++) {
			//console.log(i)
			if(active == i){
				//console.log('filled '+i)
				//console.log(typeof(i))
				//console.log(typeof(active))
				buildout.push(
					<View key={'menu_'+i} style={Skin.botmenu.boxwraphover} >
						<View style={Skin.botmenu.hoverbar}>
						</View>
						<TouchableHighlight style={Skin.botmenu.boxhover} underlayColor={Skin.colors.LIGHT_PRIMARY} onPress={()=>this.handleClick(i)}>
							<View style={{flex:1,flexDirection:'column'}}>
								<Text style={[Skin.botmenu.icon,{color:Skin.colors.BUTTON_BG_COLOR}]}>{this.props.list[i]['icon']}</Text>
								<Text style={[Skin.botmenu.title,{color:Skin.colors.BUTTON_BG_COLOR,fontSize: 12}]}>{this.props.list[i]['title']}</Text>
							</View>
						</TouchableHighlight>
					</View>
				);
				//console.log(box);
				//buildout.push(box(i));
	 		}else{
	 			//console.log('empty '+i)
	 			buildout.push(
					<View key={'menu_'+i} style={Skin.botmenu.boxwrap}>
						<View style={Skin.botmenu.hoverbar_empty}>
						</View>
						<TouchableHighlight style={Skin.botmenu.box} underlayColor={Skin.colors.TEXT_COLOR} onPress={()=>this.handleClick(i)}>
							<View style={{flex:1,flexDirection:'column'}}>
								<Text style={[Skin.botmenu.icon,{color:Skin.colors.PRIMARY}]}>{this.props.list[i]['icon']}</Text>
								<Text style={[Skin.botmenu.title,{color:Skin.colors.PRIMARY,fontSize: 12}]}>{this.props.list[i]['title']}</Text>
							</View>
						</TouchableHighlight>
					</View>
	 			);

	 		}
		}
		return buildout;
	}

	handleClick(i) {
//    this.props.navigator.navigate(this.props.list[i].link)
//    Events.trigger('registerDrawer');
    Events.trigger('tabChanged',i);
  	}
 };


BottomMenu.propTypes = {
    list: React.PropTypes.object,
    active: React.PropTypes.number
};
BottomMenu.defaultProps = {
    list: {
		1:{
			icon:'\ue903',
			title:'Shop',
			link: 'Shop',
		},
		2:{
			icon:'\ue9bb',
			title:'My List',			
			link: 'My List',
		},
		3:{
			icon:'\ue93f',
			title:'Wallet',				
			link: 'Wallet',
		},
		4:{
			icon:'\ue971',
			title:'Account',				
			link: 'Account',
		}
    },
    active: 1
};

module.exports = BottomMenu;



Skin.botmenu = StyleSheet.create({
	hoverbar:{
		backgroundColor: 'rgba('+Skin.colors.PRIMARY_RGB+',0.25)',
		height: 0
	},
	hoverbar_empty:{
		backgroundColor: 'transparent',
		height: 10
	},
	boxwrap:{
		flexDirection:'column',
		marginTop:-10,
		flex:1,
	},
	boxwraphover:{
		flexDirection:'column',
		marginTop:0,
		flex:1,
	},
	box:{
		flex: 1,
		backgroundColor: Skin.colors.BUTTON_BG_COLOR,
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
		fontFamily: Skin.font.LOGO_FONT,
		fontSize: 25,
		paddingTop: 15,
		color: Skin.colors.TEXT_COLOR,
		flex:2,
		textAlign:'center'
	},
	title:{
		fontSize: 10,
		fontWeight: 'bold',
		marginBottom:10,
		height:30,
		color: Skin.colors.TEXT_COLOR,
		flex:1,
		textAlign: 'center'
	}
});