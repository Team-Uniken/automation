/*
    CSS classes which are common to all screens will be defined over here.
*/

// ALWAYS NEED
'use strict';

const React = require('react-native');
// const Skin = require('./MainStyleSheet');
// const styles = Skin.styles;
const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const MAX_WIDTH = 300;
const MAX_HEIGHT = 600;
const max = {
  width: (SCREEN_WIDTH > MAX_WIDTH) ? MAX_WIDTH : SCREEN_WIDTH,
  height: (SCREEN_HEIGHT > MAX_HEIGHT) ? MAX_HEIGHT : SCREEN_HEIGHT,
};

// Open Links
const open = {
  BRANCH_SEARCH_LINK: 'https://www.google.com/maps/search/atms/@40.6913134,-74.0725296,13z/data=!3m1!4b1',
  WEBSITE_LINK: 'http://www.uniken.com',
};

// Called
const { StyleSheet, Dimensions, PixelRatio } = React;


// Colors
const DARK_PRIMARY = '#2579A2'; // '#0277BD'; //
const BACK_GRAY = '#f2f2f2';
const PRIMARY = '#4FADD8'; // '#03A9F4';// 03A9F4

const LIGHT_PRIMARY = '#BCE0F2'; // '#B3e5FC';//
const TEXT_COLOR = '#FFFFFF';
const ACCENT = '#f18F01';
const POSITIVE_ACCENT = '#92D050';
const PRIMARY_TEXT = '#212121';

const SECONDARY_TEXT = '#727272';
const DIVIDER_COLOR = '#b6b6b6';
const NAV_BAR_TINT = '#FFFFFF'
const MENU_TXT_COLOR = '#2579A2';
const ICON_COLOR = '#FFFFFF';


const PRIMARY_RGB = hexToRgb(PRIMARY).r + ',' + hexToRgb(PRIMARY).g + ',' + hexToRgb(PRIMARY).b;
const DARK_PRIMARY_RGB = hexToRgb(DARK_PRIMARY).r + ',' + hexToRgb(DARK_PRIMARY).g + ',' + hexToRgb(DARK_PRIMARY).b;
const LIGHT_PRIMARY_RGB = hexToRgb(LIGHT_PRIMARY).r + ',' + hexToRgb(LIGHT_PRIMARY).g + ',' + hexToRgb(LIGHT_PRIMARY).b;
const PRIMARY_TEXT_RGB = hexToRgb(PRIMARY_TEXT).r + ',' + hexToRgb(PRIMARY_TEXT).g + ',' + hexToRgb(PRIMARY_TEXT).b;
const TEXT_COLOR_RGB = hexToRgb(TEXT_COLOR).r + ',' + hexToRgb(TEXT_COLOR).g + ',' + hexToRgb(TEXT_COLOR).b;


const BACKGROUND_COLOR = '#fff';
const BUTTON_BACKGROUND_COLOR = PRIMARY;
const BORDER_COLOR = PRIMARY;
const TITLE_COLOR = '#fff';
const BLACK_TEXT_COLOR = '#000';
const ERROR_TEXT_COLOR = '#CC0000';
const BUTTON_TEXT_COLOR = '#fff';

const APPROVE_BUTTON_COLOR = '#92D050';
const REJECT_BUTTON_COLOR = '#800000';
const FRAUD_BUTTON_COLOR = '#212121';
// Fonts
const CORE_FONT = 'Century Gothic';
const ICON_FONT = 'icomoon';

// Speeds
const SPEED = 0.4; // 0.8
const LOADSPEED = 0.3; // 0.3

// Icons
const icon = {
  temporary: '\ue924',
  permanent: '\ue06b',
  hamburger: '\ue2cb',
  settings: '\ue2cb',
};

// Titles
const text = {
  PASSWORD_BUTTON_TEXT: 'SUBMIT',
  USERNAME_BUTTON_TEXT: 'LOGIN',
  LINK_1_TEXT: 'Branches',
  LINK_1_ICON: 't',
  LINK_1_LINK: '',
  LINK_2_TEXT: 'Help',
  LINK_2_ICON: '\ue050',
  LINK_2_LINK: '',
  LINK_3_TEXT: 'Website',
  LINK_3_ICON: '\ue2b1',
  LINK_3_LINK: '',
};


const colors = {
  DARK_PRIMARY,
  DARK_PRIMARY_RGB,
  BACK_GRAY,
  PRIMARY,
  PRIMARY_RGB,
  LIGHT_PRIMARY,
  TEXT_COLOR,
  TEXT_COLOR_RGB,
  ACCENT,
  POSITIVE_ACCENT,
  PRIMARY_TEXT,
  PRIMARY_TEXT_RGB,
  SECONDARY_TEXT,
  DIVIDER_COLOR,
  NAV_BAR_TINT,
  MENU_TXT_COLOR,
  ICON_COLOR,
  REPPLE_COLOR: '#E0E0E0',
  HINT_COLOR: '#8F8F8F',
  BLACK_TEXT_COLOR: BLACK_TEXT_COLOR,
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


const customeStyle = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 22,
    color: TITLE_COLOR,
    marginTop: 12,
    fontWeight: 'bold',
    width: SCREEN_WIDTH - 96,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title1: {
    fontSize: 22,
    color: TITLE_COLOR,
    marginTop: 12,
    fontWeight: 'bold',
    width: SCREEN_WIDTH,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  remember: {
    color: BLACK_TEXT_COLOR,
    fontSize: 16,
    opacity: 0.7,
    margin: 16,
    width: SCREEN_WIDTH - 80,
  },
  images: {
    width: 24,
    height: 24,
    margin: 12,
    opacity: 0.7,
  },
    attempt: {
    fontSize: 16,
    color: TEXT_COLOR,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
  },
  wrap: {
    position: 'absolute',
    top: 10,
    bottom: 0,
    left: 0,
    right: 0,
    width: 50,
    height: 50,
  },

  input: {
    textAlign: 'center',
    fontFamily: 'Century Gothic',
    fontSize: 16,
    height: 56,
    color: '#000',
    textAlignVertical: 'top',
    alignItems: 'center',
    opacity: 0.7,
  },
  roundcorner: {
    height: 48,
    width: 280,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: SCREEN_WIDTH / 2 - 140,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  roundcornerbutton: {
    height: 48,
    width: 280,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: SCREEN_WIDTH / 2 - 140,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 30,
    backgroundColor: BUTTON_BACKGROUND_COLOR,
  },
  roundcornerinput: {
    height: 48,
    width: 280,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: SCREEN_WIDTH / 2 - 140,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  note: {
    textAlign: 'center',
    marginTop: 16,
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    opacity: 0.4,
    width: SCREEN_WIDTH,
  },
  errortext: {
    textAlign: 'center',
    marginTop: 16,
    color: ERROR_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    opacity: 0.7,
    width: SCREEN_WIDTH,
    height: 16,
  },
  text1: {
    textAlign: 'center',
    marginTop: 16,
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    opacity: 0.7,
    width: SCREEN_WIDTH,
  },
  text2: {
    marginTop: 16,
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    opacity: 0.75,
    width: SCREEN_WIDTH,
  },
  text3: {
    textAlign: 'center',
    marginTop: 16,
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    opacity: 0.9,
    width: SCREEN_WIDTH,
  },
  text4: {
    textAlign: 'center',
    marginTop: 16,
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 34,
    width: SCREEN_WIDTH,
  },
  button: {
    textAlign: 'center',
    marginTop: 12,
    height: 48,
    color: BUTTON_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  div: {
    marginTop: 16,
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
    height: 1,
    opacity: 0.6,
  },
  div1: {
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
    height: 1,
    opacity: 0.6,
  },
  connectionprofile: {
    width: 48,
    height: 48,
    position: 'absolute',
    top: 16,
    right: 8,
  },
  connectionprofileimage: {
    width: 24,
    height: 24,
    margin: 12,
  },
});


const questionrow = StyleSheet.create({
  que: {
    flex: 1,
    marginTop: 16,
    width: SCREEN_WIDTH,
    height: 150,
    backgroundColor: '#dbdbdb',
  },
  customerow: {
    backgroundColor: PRIMARY,
    marginTop: 2,
    width: SCREEN_WIDTH,
  },
  questyle: {
    fontSize: 16,
    color: '#fff',
    opacity: 1,
    height: 40,
    marginTop: 6,
    width: SCREEN_WIDTH,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
});




const appointmentrow = StyleSheet.create({
  customerow: {
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
  },
  row: {
    margin: 4,
    flexDirection: 'row',
  },
  col: {
    marginRight: 20,
    flexDirection: 'column'
  },
  floatbutton: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: PRIMARY,
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  plus: {
    width: 24,
    height: 24,
    margin: 16,
  },
  date: {
    fontSize: 20,
    color: BLACK_TEXT_COLOR,
    width: SCREEN_WIDTH / 2,
    textAlign: 'left',
    opacity: 0.7,
  },
  time: {
    fontSize: 20,
    color: BLACK_TEXT_COLOR,
    width: SCREEN_WIDTH / 2 - 16,
    textAlign: 'right',
    marginRight: 16,
    opacity: 0.7,
  },
  locatontext: {
    fontSize: 16,
    color: BLACK_TEXT_COLOR,
    width: SCREEN_WIDTH,
    opacity: 0.5,
  },
  locationimage: {
    width: 18,
    height: 18,
    marginTop: 4,
    opacity: 0.5,
  },

  msg: {
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    opacity: 0.4,
    width: SCREEN_WIDTH,
    marginLeft: 24,
  },
  div1: {
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
    height: 1,
    opacity: 0.6,
  },
});


const notification = StyleSheet.create({
  customerow: {
    backgroundColor: '#fff',
    width: SCREEN_WIDTH-32,
    marginTop:20,
    marginLeft:16,
    marginRight:16,
  },
    container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    height:200,
    width:300
  },
  row: {
    flexDirection: 'row',
        width: SCREEN_WIDTH-32,

  },
    amountrow: {
    flexDirection: 'row',
        width: SCREEN_WIDTH-32,

  },
    text: {
    margin: 14,
  },
  col: {
    marginRight: 20,
    flexDirection: 'column'
  },
   col1: {
    marginRight: 20,
     width: SCREEN_WIDTH-167,
    flexDirection: 'column',
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BLACK_TEXT_COLOR,
    width: 140,
    textAlign: 'left',
    opacity:1,
    marginLeft:8,
    marginTop:8,
    backgroundColor:'transparent',

  },
  time: {
    fontSize: 16,
    color: BLACK_TEXT_COLOR,
    textAlign: 'right',
    width: SCREEN_WIDTH-188,
    opacity:0.6,
     marginRight:8,
    marginTop:8,
    backgroundColor:'transparent',
  },
  body: {
    fontSize: 16,
     width: SCREEN_WIDTH-167,
    color: BLACK_TEXT_COLOR,
    opacity: 0.6,
  },
    dot: {
    fontSize: 16,
     width:15,
    color: BLACK_TEXT_COLOR,
     marginLeft:8,
    opacity:0.6,
  },
   body2: {
    fontSize: 16,
    marginRight:32,
     width: SCREEN_WIDTH-71,
    color: BLACK_TEXT_COLOR,
    opacity: 0.6,
  },
   bold: {
    fontSize: 24,
    color: BLACK_TEXT_COLOR,
    opacity:1,
    fontWeight: 'bold', 
    marginLeft:8,
  },
    htmlstyle: {
    fontSize: 20,
    color: BLACK_TEXT_COLOR,
    width: SCREEN_WIDTH-32,
    opacity:1,
    marginLeft:8,
  },
  
  buttontext: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    opacity:1,
  },
   confirmbutton: {
    width:(SCREEN_WIDTH-32)/3,
    height:56,
    backgroundColor:APPROVE_BUTTON_COLOR,
  },
   denybutton: {
    width:(SCREEN_WIDTH-32)/3,
    height:56,
    backgroundColor:REJECT_BUTTON_COLOR,
  },
    fraudbutton: {
    width:(SCREEN_WIDTH-32)/3,
    height:56,
    backgroundColor:FRAUD_BUTTON_COLOR,
  },
    approvebutton: {
    width:(SCREEN_WIDTH-32)/2,
    height:56,
    backgroundColor:APPROVE_BUTTON_COLOR,
  },
    rejectbutton: {
    width:(SCREEN_WIDTH-32)/2,
    height:56,
    backgroundColor:REJECT_BUTTON_COLOR,
  },
});

const addappointment = StyleSheet.create({
  row: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16,
    height: 48,
  },
  msgrow: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,
    height: 172,
  },
  col: {
    width: SCREEN_WIDTH,
    marginTop: 16,
    flexDirection: 'column'
  },
  textstyle: {
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    width: 100,
    opacity: 0.6,
  },
  msgtextstyle: {
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    marginTop: 16,
    width: 100,
    opacity: 0.6,
  },
  edittextstyle: {
    color: BLACK_TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    width: SCREEN_WIDTH - 100,
    opacity: 0.6,
  },
  input: {
    color: BLACK_TEXT_COLOR,
    height: 140,
    fontSize: 16,
    marginTop: 0,
    marginRight: 8,
    width: SCREEN_WIDTH - 132,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
    opacity: 0.6,

  },
  border: {
    borderWidth: 1,
    marginTop: 8,
    marginRight: 16,
    borderColor: PRIMARY,
  },
  datestyle: {
    position: 'absolute',
    top: 12,
    bottom: 0,
    left: 100,
    right: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  branchstyle: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

//Positions
const coreStyle = StyleSheet.create({

  logo_rid: {
    fontFamily: 'icomoon',
  },
  logo_i: {
    position: 'absolute',
    fontSize: 89,
    width: 160,
    marginLeft: 31 + leftrid,
    marginTop: 31,
    color: LIGHT_PRIMARY,
    //backgroundColor: 'rgba(70,0,0,0.5)',

  },
  logo_r: {
    position: 'absolute',
    fontSize: 120,
    width: 160,
    marginLeft: leftrid,
    color: TEXT_COLOR,
  //backgroundColor: 'rgba(70,0,0,0.5)',
  },
  logo_d: {
    position: 'absolute',
    fontSize: 120,
    width: 160,
    marginLeft: 62 + leftrid,
    color: DARK_PRIMARY,
  //backgroundColor: 'rgba(70,0,0,0.5)',
  },
  logo_relid_wrap: {
    alignItems: 'center',
    top: 380,
  },
  logo_relid: {
    fontFamily: 'icomoon',
    fontSize: 21,
    marginLeft: 22,
    width: 160,
    color: TEXT_COLOR,
    backgroundColor: 'transparent',
  //backgroundColor: 'rgba(0,100,0,0.5)',
  },
  load_text_wrap: {
    top: 450,
    alignItems: 'center',
  },
  load_text: {
    color: TEXT_COLOR,
    fontFamily: 'Century Gothic',
    fontSize: 20,
    position: 'absolute',
    width: 200,
    left: ((SCREEN_WIDTH - 200) / 2),
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
  //backgroundColor: 'rgba(100,100,0,0.5)',
  },
});

const PatternLockStyle = StyleSheet.create({
   patternlockview: {
     marginTop:SCREEN_HEIGHT/2-200,
     width: 270,
     height: 270,
   },
     button: {
    height: 48,
    width: 48,
    marginTop: 16,
  },
     attempt: {
    fontSize: 16,
    color: TEXT_COLOR,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 16,
  },
});

const ConnectionProfile = StyleSheet.create({
  branchstyle: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 350 / 2,
    left: SCREEN_WIDTH / 2 - 300 / 2,
    width: 270,
    height: 170
  },

  DeviceListView: {
    height: SCREEN_HEIGHT - 100,
    justifyContent: 'center',
    backgroundColor: 'transparent',

  },
  button: {
    height: 48,
    width: 48,
    opacity: 0.6,
    justifyContent: "center",
    marginTop: 4,
  },

  images: {
    width: 18,
    height: 18,
    margin: 16,
  },
  customerow: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'transparent',
  },
  selectederow: {
  flexDirection: 'row',
  height: 56,
  backgroundColor: '#dbdbdb',
  },
});



// ======================================================================================
const progStyle = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,20,40,0.95)'
  },
  progressView: {
    top: 200,
    width: 250,
    height: 10,
    left: (SCREEN_WIDTH - 250) / 2,
  },
  warning: {
    top: 190,
    fontFamily: CORE_FONT,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 22,
    textAlign: 'center',
    height: 35,
  }
});

const logStyle = StyleSheet.create({
  wrap: {
    flexDirection: 'column',
    flex: 1,
    position: 'relative'
  },
  abs: {
    position: 'absolute',
  },
  top_wrap: {
    flex: 2,
    //backgroundColor: 'red',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'column',
  },
  mid_wrap: {
    flex: 2,
    //backgroundColor: PRIMARY,
    position: 'relative',
    alignItems: 'center',
  },
  bot_wrap: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  input_wrap: {
    width: 270,
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  textinput_wrap: {
    flex: 1,
    flexDirection: 'row',
  },
  textinput: {
    //fontFamily: CORE_FONT,
    flex: 1,
    height: 50,
    fontSize: 22,
    paddingLeft: 10,
    color: TEXT_COLOR,
    textAlign: 'center',
    backgroundColor: 'rgba(' + DARK_PRIMARY_RGB + ',0.54)',
  },
  button: {
    height: 60,
    backgroundColor: TEXT_COLOR,
    flex: 1,
  },
  button_text: {
    backgroundColor: 'transparent',
    fontSize: 22,
    marginTop: 12,
    textAlign: 'center',
    color: PRIMARY,
    fontWeight: 'bold',
  },
  buttonWrap: {
    top: 15,
    width: 280,
    left: ((SCREEN_WIDTH - 280) / 2),
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'center',
  },

  warning: {
    fontFamily: CORE_FONT,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 22,
    textAlign: 'center',
    height: 35,
  },
  openlink_wrap: {
    backgroundColor: DARK_PRIMARY,
    width: 80,
    height: 80,
    flexDirection: 'column',
  },
  openlink_text: {
    color: TEXT_COLOR,
    textAlign: 'center',
    fontSize: 13,
    flex: 1,
  },
  openlink_icon: {
    color: TEXT_COLOR,
    fontFamily: 'icomoon',
    flex: 2,
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    fontSize: 33,
  }
});


const leftrid = 0;

const loadStyle = StyleSheet.create({
  rid_wrap: {
    alignItems: 'center',
  //backgroundColor: 'rgba(50,250,250,0.5)',
  },
  rid_center: {
    height: 120,
    width: 120,
  //backgroundColor: 'rgba(0,50,200,0.8)',
  },
  logo_rid: {
    fontFamily: 'icomoon',
  },
  logo_i: {
    position: 'absolute',
    fontSize: 89,
    marginLeft: 31 + leftrid,
    marginTop: 31,
    color: LIGHT_PRIMARY,
  //backgroundColor: 'rgba(70,0,0,0.5)',
  },
  logo_r: {
    position: 'absolute',
    fontSize: 120,
    marginLeft: leftrid,
    color: '#FFFFFF',
  //backgroundColor: 'rgba(70,0,0,0.5)',
  },
  logo_d: {
    position: 'absolute',
    fontSize: 120,
    marginLeft: 62 + leftrid,
    color: DARK_PRIMARY,
  //backgroundColor: 'rgba(70,0,0,0.5)',
  },
  relid_wrap: {
    alignItems: 'center',
    top: 205,

  },
  relid: {
    fontFamily: 'icomoon',
    fontSize: 21,
   // marginLeft: 31 + leftrid,
    marginLeft: 47,
    width: 170,
    flex: 1,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  //backgroundColor: 'rgba(0,100,0,0.5)',
  },
  text_wrap: {
    top: 250,
    alignItems: 'center',
    //backgroundColor: 'red',
    height: 100,
  },
  text_center: {
    //backgroundColor: 'black',
    alignItems: 'center',
    width: 200,
  },
  text: {
    color: '#FFFFFF',
    textAlign: 'center',
    width: 200,
    //fontFamily: CORE_FONT,
    fontSize: 20,
    position: 'absolute',
    fontWeight: 'bold',
  //textAlign: 'center',
  //alignItems: 'center',
  //backgroundColor: 'rgba(100,100,0,0.5)',
  },
});


const transforms = {
  FromTheRight: {
    opacity: {
      value: 1.0,
      type: 'constant',
    },
    transformTranslate: {
      from: {
        x: Dimensions.get('window').width,
        y: 0,
        z: 0
      },
      to: {
        x: 0,
        y: 0,
        z: 0
      },
      min: 0,
      max: 1,
      type: 'linear',
      extrapolate: true,
      round: PixelRatio.get(),
    },
    translateX: {
      from: Dimensions.get('window').width,
      to: 0,
      min: 0,
      max: 1,
      type: 'linear',
      extrapolate: true,
      round: PixelRatio.get(),
    },
    scaleX: {
      value: 1,
      type: 'constant',
    },
    scaleY: {
      value: 1,
      type: 'constant',
    },
  },
  ToTheLeft: {
    transformTranslate: {
      from: {
        x: 0,
        y: 0,
        z: 0
      },
      to: {
        x: -Dimensions.get('window').width,
        y: 0,
        z: 0
      },
      min: 0,
      max: 1,
      type: 'linear',
      extrapolate: true,
      round: PixelRatio.get(),
    },
    opacity: {
      value: 1.0,
      type: 'constant',
    },

    translateX: {
      from: 0,
      to: -Dimensions.get('window').width,
      min: 0,
      max: 1,
      type: 'linear',
      extrapolate: true,
      round: PixelRatio.get(),
    }
  }
};


const controlStyle = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
    flex: 1,
  //color: '#ffffff',
  },
  shadow: {
    width: 300,
    height: 300,
    shadowOffset: {
      width: 10,
      height: 10
    }
  },
  menuItem: {
    color: '#ffffff',
    fontFamily: CORE_FONT,
    marginTop: 15,
    marginBottom: 15,
  },
  menuBorder: {
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#222222',
    marginLeft: 20,
  },
  touch: {
    paddingLeft: 20
  },
  controlHeader: {
    color: '#ffffff',
    fontFamily: CORE_FONT,
    paddingTop: 30,
    fontSize: 30,
    paddingBottom: 50,
    width: SCREEN_WIDTH - 90,
    textAlign: 'center',
  }
});

const statusBarStyle = StyleSheet.create({
  default: {
    backgroundColor: DARK_PRIMARY,
    height: 20,
    width: SCREEN_WIDTH
  }
});

const nav = {
  icon: {
    fontFamily: ICON_FONT,
    fontSize: 30,
    color: TEXT_COLOR
  }

};



const activationStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgimage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  bgcolorizer: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(' + PRIMARY_RGB + ',0.85)',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  bgbase: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(' + PRIMARY_RGB + ',1)',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  maincontainer: {
    flex: 1,
  },
  centering_wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrap: {
    flexDirection: 'column',
    width: max.width,
    justifyContent: 'flex-start',
  },
  fullscreen:{
    width:max.width,
    height:SCREEN_HEIGHT-100,
  },
  counter: {
    fontSize: 14,
    color: TEXT_COLOR,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 20,
    color: TEXT_COLOR,
  },
  info: {
    fontSize: 16,
    color: TEXT_COLOR,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 20,
  },
  input_wrap: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  textinput_wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'rgba(' + DARK_PRIMARY_RGB + ',0.7)',
  },
  textinput: {
    flex: 1,
    fontSize: 22,
    color: TEXT_COLOR,
    textAlign: 'center',
  },
  textinput_lead: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: TEXT_COLOR,
  },
  buttontext: {
    flex: 1,
    fontSize: 22,
    color: PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topGroup: {
//     height: 400,
   //  backgroundColor: 'red',
     justifyContent: 'flex-end',
     flexDirection: 'column',
  },
});

module.exports = {
  coreStyle,
  logStyle,
  progStyle,
  loadStyle,
  transforms,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  customeStyle,
  appointmentrow,
  notification,
  addappointment,
  questionrow,
  ConnectionProfile,
  PatternLockStyle,
  nav,
  open,
  spd: SPEED,
  loadspd: LOADSPEED,
  controlStyle,
  activationStyle,
  colors,
  statusBarStyle,
  text,
  font: {
    ICON_FONT,
    CORE_FONT,
  },
  icon,
};

