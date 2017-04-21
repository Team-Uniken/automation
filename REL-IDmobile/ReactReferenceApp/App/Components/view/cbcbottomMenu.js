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
					{this.buildboxes(this.state.active)}
				</View>
			);
		}
		return null;
	}

	buildboxes(active){
		var buildout = [];
		for (let i=1; i < 6; i++) {
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
								<Text style={[Skin.botmenu.icon,{color:Skin.colors.TEXT_COLOR}]}>{this.props.list[i]['icon']}</Text>
								<Text style={[Skin.botmenu.title,{color:Skin.colors.TEXT_COLOR}]}>{this.props.list[i]['title']}</Text>
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
								<Text style={[Skin.botmenu.title,{color:Skin.colors.PRIMARY}]}>{this.props.list[i]['title']}</Text>
							</View>
						</TouchableHighlight>
					</View>
	 			);

	 		}
		}
		return buildout;
	}

	handleClick(i) {
		//console.log(this);
		//console.log(i);
		//console.log({id:this.props.list[i].link});
//		this.props.navigator.push({id:this.props.list[i].link});
  		/*
  		var routeStack = this.props.navigator.state.routeStack;
  		routeStack.push({id:this.props.list[i].link});
  		this.props.navigator.immediatelyResetRouteStack(routeStack);
    	/* */
    	//this.props.navigator.push({id:this.props.list[i].link});
  	}
 };


BottomMenu.propTypes = {
    list: React.PropTypes.object,
    active: React.PropTypes.number
};
BottomMenu.defaultProps = {
    list: {
		1:{
			icon:'\ue901',
			title:'ACCOUNTS',
			link: 'Accounts',
		},
		2:{
			icon:'\ue903',
			title:'PAY BILLS',			
			link: 'PayBills',
		},
		3:{
			icon:'\ue902',
			title:'DEPOSITS',				
			link: 'Deposits',
		},
		4:{
			icon:'\ue908',
			title:'FIND BRANCH',				
			link: 'FindBranch',
		},
		5:{
			icon:'\ue904',
			title:'CONTACT',				
			link: 'Contact',
		},
    },
    active: 1
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
		marginTop:-10,
		flex:1,
	},
	boxwraphover:{
		flexDirection:'column',
		marginTop:-10,
		flex:1,
	},
	box:{
		flex: 1,
		backgroundColor: '#146cc0',
	},
	boxhover:{
		backgroundColor: Skin.colors.PRIMARY,
		flex: 1,
	},
	wrap:{
		flexDirection:'row',
		height: 80
	},
	icon:{
		fontFamily: Skin.ACC_FONT,
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
