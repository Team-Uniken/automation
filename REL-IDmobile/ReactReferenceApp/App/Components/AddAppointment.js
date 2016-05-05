
import DatePicker from 'react-native-datepicker';

var React = require('react-native');

var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';

var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StyleSheet,
	Image,
	Dimensions,
	TextInput,
	Animated,
} = React;

var MENU_HVR_COLOR = 'rgba(13, 23, 38, 1.0)';

var message;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'rgba(8,26,60,0.9)'
	},

	toolbarrow: {
						flexDirection:'row',
						backgroundColor: '#fff',
						width:Dimensions.get('window').width,
	},
	row: {
		backgroundColor:'#122941',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'row',
            marginTop: 16,
						height:48,
  },
	msgrow: {
		backgroundColor:'#122941',
						justifyContent: 'center',
						flexDirection:'row',
						marginTop: 16,
						height:172,
	},

  col: {
		width:Dimensions.get('window').width,
		marginTop: 16,
    flexDirection:'column'
  },
	textstyle:{
    color: TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    width:100,
  },
	msgtextstyle:{
		color: TEXT_COLOR,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		marginTop:16,
		width:100,


	},
	edittextstyle:{
		color: TEXT_COLOR,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		width:Dimensions.get('window').width-100,
	},
	input:{
		color: TEXT_COLOR,
		height:140,
		fontSize: 16,
		marginTop:16,
		marginRight:16,
		width:Dimensions.get('window').width-116,
		textAlignVertical: 'top',

	},

	button: {
		fontFamily: 'Century Gothic',
		backgroundColor: 'transparent',
		height: 48,
		fontSize: 16,
		marginTop: 12,
		color: MIDBLUE,
	},
	buttonWrap: {
		height:48,
		margin:8,
		width: 100,
		backgroundColor: 'rgba(255,255,255,1)',
		alignItems: 'center',
	},
	datestyle: {
	position: 'absolute',
	top: 12,
	bottom: 0,
	left: 100,
	right: 0,
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,
	},
});



class AddAppointment extends React.Component{
	state = {
    date:this.props.url.date,
    time: this.props.url.time,
    location:this.props.url.location,

  }
  componentDidMount() {
    message = this.props.url.msg
  }

	render() {
		return (
			<View style={styles.container}>
			<View style={styles.toolbarrow}>
			<Text
				style={{fontSize:22,color: '#2579a2',margin:12,fontWeight: 'bold', width:Dimensions.get('window').width-80,}}
			>{this.props.title}</Text>
			<TouchableHighlight
				onPress={()=>{
								this.props.navigator.pop();
				}}
				underlayColor={'#FFFFFF'}
				activeOpacity={0.6}
			>
				<Text
					style={{textAlign: 'right',fontSize:24,color: '#2579a2',margin:12,}}
				>X</Text>
			</TouchableHighlight>
			</View>
			<View style={styles.row}>
		<Text style={styles.textstyle}> Date : </Text>
		<Text style={styles.edittextstyle}>{this.state.date}</Text>
		<Animated.View style={[styles.datestyle,{opacity:0}]}>
		<DatePicker
						 style={{width: 200}}
						 date={this.state.date}
						 mode="date"
						 format="YYYY-MM-DD"
						 minDate="2016-05-03"
						 maxDate="2018-12-31"
						 onDateChange={(date) => {this.setState({date: date})}}
					 />

		</Animated.View>
		</View>

		<View style={styles.row}>
	<Text style={styles.textstyle}> Time : </Text>
	<Text style={styles.edittextstyle}>{this.state.time}</Text>
	<Animated.View style={[styles.datestyle,{opacity:0}]}>
	<DatePicker
           style={{width: 200}}
           date={this.state.time}
           mode="time"
           format="HH:mm"
           onDateChange={(time) => {this.setState({time: time})}}
         />

	</Animated.View>
	</View>
	<View style={styles.row}>
	<Text style={styles.textstyle}> Location : </Text>
	<TextInput style={styles.edittextstyle}
	returnKeyType={'next'}
	placeholder={this.state.location}
	placeholderTextColor={'#dbdbdb'}></TextInput>

	</View>

	<View style={styles.msgrow}>
	<Text style={styles.msgtextstyle}> Message : </Text>
	<TextInput
	returnKeyType={'next'}
	placeholder={'Enter Message'}
	placeholderTextColor={'#dbdbdb'}
	style={styles.input}
	multiline ={true}
	>
	</TextInput>

</View>

<View style={{flexDirection:'row',}}>
<TouchableHighlight
style={styles.buttonWrap}
underlayColor='#C7C7C7'
activeOpacity={1}
onPress={()=>{
}}
>
<Text style={styles.button}>
{this.props.url.buttontext}</Text>
</TouchableHighlight>

</View>
			</View>
		);
	}
};

module.exports = AddAppointment;
