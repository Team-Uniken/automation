'use strict';
/*
    NEED
 */
import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Main';

/*
  Instantiaions
*/
const {
	View,
	Text,
} = React;


export default class PayBillsScene extends React.Component{
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
