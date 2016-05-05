var React = require('react-native');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;


var CORE_FONT = 'Century Gothic';
var NAV_BAR_TINT = '#FFFFFF'
var NAV_SHADOW_BOOL = true;
var MENU_TXT_COLOR = '#2579A2';
var MENU_HVR_COLOR = 'rgba(13, 23, 38, 1.0)';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';

var {
  Dimensions,
  View,
  Text,
  Navigator,
  StyleSheet,
  TouchableHighlight,
      Image,
} = React;

var styles = StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    flex: 1,
    //color: '#ffffff',
  },
  row: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'row',
            height: 96,

  },
  col: {
    marginRight:20,
            flexDirection:'column'
  },
  image: {
    width: 48,
    height: 48
  },
  A:{backgroundColor: '#2A799F'},
  B:{backgroundColor: '#267196'},
  C:{backgroundColor: '#226082'},
  D:{backgroundColor: '#205877'},
  E:{backgroundColor: '#1B4A69'},
  F:{backgroundColor: '#183F5B'},
  G:{backgroundColor: '#163651'},
  H:{backgroundColor: '#122941'},
  I:{backgroundColor: '#082340'},
  icon:{
    color: ICON_COLOR,
    fontFamily: ICON_FAMILY,
    fontSize: 48,
    marginTop: 8,
    marginBottom: 4,
    height: 60,
    width:Dimensions.get('window').width/3,

    textAlign: 'center',

    //backgroundColor: 'rgba(100,0,70,0.5)'
  },
  iconText:{
    color: ICON_COLOR,
    fontFamily: CORE_FONT,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    marginBottom: 4,

    width:Dimensions.get('window').width/3,

  },
});

class QbankOptions extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <View style={styles.container}>
      <View style={styles.row}>

  <TouchableHighlight
            onPress={()=>{
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>
          <View style={styles.col,styles.I}>
     <Text style={styles.icon}>(</Text>
     <Text style={styles.iconText}>Wiki</Text>
   </View>
          </TouchableHighlight>
      <TouchableHighlight
            onPress={()=>{
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>
         <View style={styles.col,styles.H}>
   <Text style={styles.icon}>)</Text>
   <Text style={styles.iconText}>CRM</Text>
 </View>
          </TouchableHighlight>
            <TouchableHighlight
            onPress={()=>{
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>

 <View style={styles.col,styles.G}>

 <Text style={styles.icon}>n</Text>
 <Text style={styles.iconText}>QuickBank</Text>
</View>
          </TouchableHighlight>



             </View>
             <View style={styles.row}>
             <TouchableHighlight
            onPress={()=>{
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>

 <View style={styles.col,styles.F}>
             <Text style={styles.icon}>o</Text>
             <Text style={styles.iconText}>Email</Text>
           </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={()=>{
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>

<View style={styles.col,styles.E}>
           <Text style={styles.icon}>q</Text>
           <Text style={styles.iconText}>ATMs</Text>
         </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={()=>{
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>
  <View style={styles.col,styles.D}>
         <Text style={styles.icon}>z</Text>
         <Text style={styles.iconText}>Dashboard</Text>
       </View>
          </TouchableHighlight>




             </View>
                <View style={styles.row}>
                       <TouchableHighlight
            onPress={()=>{
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>


                <View style={styles.col,styles.C}>
                <Text style={styles.icon}>}</Text>
                <Text style={styles.iconText}>Website</Text>
              </View>
          </TouchableHighlight>

                 <TouchableHighlight
            onPress={()=>{
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>
    <View style={styles.col,styles.B}>
              <Text style={styles.icon}>v</Text>
              <Text style={styles.iconText}>Chat</Text>
            </View>
          </TouchableHighlight>

                 <TouchableHighlight
            onPress={()=>{

              
           }
            }
            style={[styles.grid]} activeOpacity={0.8} underlayColor={MENU_HVR_COLOR}>
 <View style={styles.col,styles.A}>
            <Text style={styles.icon}>(</Text>
            <Text style={styles.iconText}>Calender</Text>
          </View>
          </TouchableHighlight>



                </View>
      </View>
    )
  }
};

module.exports = QbankOptions
