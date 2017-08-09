/*
    CSS classes which are common to all screens will be defined over here.
*/

// ALWAYS NEED
'use strict';

import Config from 'react-native-config'

const React = require('react');
import ReactNative,{Platform} from 'react-native';
// const Skin = require('./MainStyleSheet');
// const styles = Skin.styles;
const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const MAX_WIDTH = 300;
const MAX_HEIGHT = 600;
const LANGUAGE = 'en'

const BLACK = '#000000'
const WHITE = '#FFFFFF'
//////customization changes for NWD//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const THEME_COLOR = Config.THEME_COLOR
const CLIENT_TITLE_TEXT = Config.CLIENT_TITLE_TEXT
const DASHBOARD_MENU_TITLE = Config.DASHBOARD_MENU_TITLE
const SPINNER_COLOR = Config.SPINNER_COLOR
const LOGO = Config.LOGO
const LOGO_COLOR = Config.LOGO_COLOR

const INPUT_BD_COLOR = Config.INPUT_BD_COLOR
const INPUT_BG_COLOR = Config.INPUT_BG_COLOR
const INPUT_TEXT_COLOR = Config.INPUT_TEXT_COLOR

const BUTTON_BG_COLOR = Config.BUTTON_BG_COLOR
const BUTTON_TEXT_COLOR = Config.BUTTON_TEXT_COLOR
const BUTTON_UNDERLAY_COLOR = Config.BUTTON_UNDERLAY_COLOR

const BOTTOM_MENU_SELECT_BG = Config.BOTTOM_MENU_SELECT_BG

const INPUT_PLACEHOLDER_COLOR = Config.INPUT_PLACEHOLDER_COLOR

const LOAD_SCREEN_IMAGE = Config.LOAD_SCREEN_IMAGE
const STATUS_BAR_TINT_COLOUR = Config.STATUS_BAR_TINT_COLOUR

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const load = {
  OVERLAY_BG_RGB: 'rgba(255,255,255,1)',
  OVERLAY_SPINNER_COLOR: SPINNER_COLOR,
  BG_COLOR_RGB: '255,255,255',
  BG_COLOR_OPACITY: '0.9',
  LOAD_SEQUENCE_TEXT_COLOR: '#3b3b3b'
}

const VIEW_WIDTH = SCREEN_WIDTH - 50;


const PLACEHOLDER_TEXT_COLOR_RGB = 'rgba(59,59,59,0.5)' //255,255,255,0.7
const DEV_BIND_ICON_TEXT_COLOR_RGB = 'rgba(0,0,0,0.5)' //255,255,255,0.7
const DEV_BIND_TYPE_TEXT_COLOR_RGB = 'rgba(0,0,0,0.5)' //255,255,255,0.7
const max = {
  width: (SCREEN_WIDTH > MAX_WIDTH) ? MAX_WIDTH : SCREEN_WIDTH,
  height: (SCREEN_HEIGHT > MAX_HEIGHT) ? MAX_HEIGHT : SCREEN_HEIGHT,
};
module.exports.magicwidth = (SCREEN_WIDTH > 350) ? SCREEN_WIDTH * 52 / 75 : SCREEN_WIDTH - 32

// Open Links
const open = {
  BRANCH_SEARCH_LINK: 'https://www.google.com/maps/search/atms/@40.6913134,-74.0725296,13z/data=!3m1!4b1',
  WEBSITE_LINK: 'http://www.uniken.com',
};

// Called
const {StyleSheet, Dimensions, PixelRatio} = ReactNative;
const {Component} = React;



// Colors
const DARK_PRIMARY = '#909090'; // '#0277BD'; //
const BACK_GRAY = '#f3f3f3';
const PRIMARY = '#e9e9e9'; // '#03A9F4';// 03A9F4

const LIGHT_PRIMARY = '#BCE0F2'; // '#B3e5FC';//
const TEXT_COLOR = '#FFFFFF';
const ACCENT = '#fdbf2c';
const POSITIVE_ACCENT = '#6cb939';
const NEGATIVE_ACCENT = '#d9292d';
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


const login = {
  TEXT_INPUT_BG_RGB: '231,231,231',
  TEXT_INPUT_BG_OPACITY: '1',
  TEXT_INPUT_COLOR: '#3b3b3b',
  BUTTON_TEXT_COLOR: '#ffffff',
  BUTTON_BG: '#6a7e39',
  BUTTON_UNDERLAY: '#3b3b3b',
  OPEN_LINK_BG: '#e7e7e7',
  OPEN_LINK_TEXT_COLOR: '#3b3b3b',
  OPEN_LINK_ICON_COLOR: '#3b3b3b',
  PLACEHOLDER_TEXT_COLOR_RGB: '59,59,59',
  PLACEHOLDER_TEXT_OPACITY: '0.7',
  CONNECTION_BUTTON_BG: Config.THEME_COLOR,
  CONNECTION_BUTTON_ICON_COLOR: '#FFF',
  CONNECTION_BUTTON_UNDERLAY: '#3b3b3b',
  WARNING_TEXT_COLOR: '#3b3b3b',
}

const main = {
  STATUS_BAR_BG: Config.STATUS_BAR_BG,
  BACKGROUND_COLOR: '#F9F9F9',
  BOTTOM_MENU_BG: '#3b3b3b',
  BOTTOM_MENU_COLOR: '#B0B0B0',
  BOTTOM_MENU_UNDERLAY: '#3b3b3b',
  BOTTOM_MENU_SELECT_BG: '#e7e7e7',
  BOTTOM_MENU_SELECT_COLOR: '#3b3b3b',
  BOTTOM_MENU_SELECT_UNDERLAY: '#e7e7e7',
  BOTTOM_MENU_HIGHLIGHT_COLOR_RGB: '176,176,176',
  BOTTOM_MENU_HIGHLIGHT_OPACITY: '1',
  NAVBAR_TINT: '#ffffff',
  NAVBAR_BG: '#ffffff',
  TITLE_COLOR: THEME_COLOR
}

const admin = { MENU_TITLE: DASHBOARD_MENU_TITLE, MENU_FONT: 'Times New Roman' }

const list = module.exports.list = { listHeaderColor: '#3b3b3b' }

const BACKGROUND_COLOR = '#fff';
const BUTTON_BACKGROUND_COLOR = PRIMARY
const BORDER_COLOR = PRIMARY
const TITLE_TEXT_COLOR = '#000'
const TITLE_COLOR = TITLE_TEXT_COLOR
const TITLE_BG_COLOR = '#ffffff'
const BLACK_TEXT_COLOR = '#000'
const ERROR_TEXT_COLOR = '#CC0000'




const LIGHT_TEXT_COLOR = '#929292'
const BOTTOM_MENU_BG = '#b72e2d'
const BOTTOM_MENU_COLOR = '#fff'
const BOTTOM_MENU_UNDERLAY = '#a73834'
const BOTTOM_MENU_SELECT_COLOR = '#ffffff'
const BOTTOM_MENU_SELECT_UNDERLAY = '#a73834'
const APPROVE_BUTTON_COLOR = '#92D050';
const REJECT_BUTTON_COLOR = '#800000';
const FRAUD_BUTTON_COLOR = '#212121';
// Fonts
const CORE_FONT = 'Century Gothic';
const ICON_FONT = Config.ICON_FONT;
const LOGO_FONT = Config.LOGO_FONT;

const ACC_FONT = 'account';

// Speeds
const SPEED = 0.4; // 0.8
const LOADSPEED = 0.3; // 0.3

// Icons
module.exports.icon = {
  temporary: '\ue8b5',
  permanent: '\ue000',
  hamburger: '\ue3c7',
  user: '\ue7ff',
  settings: "\u2699",
  logo: LOGO,
  wechat: '\ue935',
  facebook: '\ue932',
  iProov: '\ue932',
  password: '\ue7ff',
  touchid: '\ue90d',
  close: '\ue5cd',
  check: '\ue5ca',
  pattern: 'P',
  store: '\ue563',
  gift: '\ue8b1',
  timer: '\ue425',
  bell:'\ue7f4',
  refresh:'\ue41a',
  forward:'\ue037'
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
  NEGATIVE_ACCENT,
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
  BUTTON_BG_COLOR: BUTTON_BG_COLOR
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function shadeColor2(color, percent) {
  var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

text = {
  en: {
    test: 'test',
    '0': {
      '1': {
        subtitle: 'Welcome to ' + CLIENT_TITLE_TEXT,
        need_to_register_button: 'I need to register',
        already_member: 'I\'m already a member',
        prompt: '',
      },
      '2': {
        subtitle: 'Welcome to ' + CLIENT_TITLE_TEXT,
        prompt: 'Select a login',
        credTypes: {
          'facebook': {
            key: 'facebook',
            label: 'Facebook'
          },
          'wechat': {
            key: 'wechat',
            label: 'WeChat'
          },
          'touchid': {
            key: 'touchid',
            label: 'TouchID'
          },
          'pattern': {
            key: 'pattern',
            label: 'Pattern'
          },
          'password': {
            key: 'password',
            label: 'Password'
          },
          'iProov': {
            key: 'iProov',
            label: 'iProov'
          },
        }
      }
    },
    '1': {
      '1': {
        submit_button: 'Submit',
      },
      '4': {
        submit_button: 'Submit',
      }
    },
    '2': {
      '1': {
        subtitle: 'Welcome to ' + CLIENT_TITLE_TEXT,
        submit_button: 'Submit',
      },
      '2': {
        subtitle: 'Welcome to ' + CLIENT_TITLE_TEXT,
        submit_button: 'Submit',
        textinput_placeholder: 'Enter Password',
      }
    },

    PASSWORD_BUTTON_TEXT: 'SUBMIT',
    USERNAME_BUTTON_TEXT: 'LOGIN',
    LINK_1_TEXT: 'Branches',
    LINK_1_ICON: ' t',
    LINK_1_LINK: '',
    LINK_2_TEXT: 'Help',
    LINK_2_ICON: '\ue050',
    LINK_2_LINK: '',
    LINK_3_TEXT: 'Website',
    LINK_3_ICON: '\ue2b1',
    LINK_3_LINK: '',
  }
}

module.exports.text = text.en
module.exports.baseline = {
  button: {
    base: StyleSheet.create({
      base: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
        width: 260,
        borderRadius: 8,
        marginBottom: 27,
        backgroundColor: BUTTON_BG_COLOR,
      }
    }).base,
    text: StyleSheet.create({
      text: {
        fontSize: 18,
        color: BUTTON_TEXT_COLOR,
        textAlign: 'center',
        textAlignVertical: 'center',
      }
    }).text,
    underlayColor: BUTTON_UNDERLAY_COLOR,
    activeOpacity: 0.8,
  },
  select: {
    base: {
      //backgroundColor: '#ffff00',
      padding: 0,
    },
    select: {
      borderWidth: 0,
      height: 46,
      width: 260,
      backgroundColor: INPUT_BG_COLOR,
      paddingLeft: 10,
      paddingTop: 3,
      alignSelf: 'center',
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
    },
    selectText: {
      alignSelf: 'center',
      alignItems: 'center',
      fontSize: 18,
      textAlign: 'left',
      color: INPUT_TEXT_COLOR,
      flex: 1,
    }
  },
  textinput: {
    base: {
      textAlign: 'left',
      height: 46,
      width: 260,
      paddingLeft: 10,
      paddingTop: 3,
      backgroundColor:Platform.OS=='ios' ? INPUT_BG_COLOR : (Platform.Version >= 23?shadeColor2(INPUT_BG_COLOR,-0.012):shadeColor2(INPUT_BG_COLOR,-0.050)),
      color: INPUT_TEXT_COLOR,
      flex: 1,
      fontSize: 18,
    },
    verificationQue: {
      textAlign: 'left',
      height: 46,
      width: 260,
      paddingLeft: 10,
      paddingTop: 3,
      backgroundColor: INPUT_BG_COLOR,
      color: INPUT_TEXT_COLOR,
      fontSize: 18,
    },
    placeholderTextColor: INPUT_PLACEHOLDER_COLOR,
    wrapfocus: {
      borderBottomColor: INPUT_BD_COLOR,
      backgroundColor: '#141414'
    },
    wrap: {
      borderColor: 'transparent',
      borderBottomWidth: 3,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      width: 260,
      flexDirection: "row",
      alignItems: "stretch",
      marginBottom: 12,
    }
  },
  checkbox: {
    base: {
      width: 24,
      height: 24,
      margin: 13,
      marginLeft: 0,
      marginRight: 20,
      borderWidth: 2,
      borderColor: BUTTON_BG_COLOR,
      borderRadius: 0,
      //backgroundColor: "rgb(248,231,28)"
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      alignSelf: 'center',
      fontSize: 18,
      textAlign: 'left',
      flex: 1,
    },
    selectedColor: 'transparent',
    defaultColor: 'transparent',
    check: {
      color: BUTTON_BG_COLOR,
      fontFamily: ICON_FONT,
      fontSize: 20,
    },
  },
  text_link_no_underline: {
    color: BUTTON_BG_COLOR,
    fontSize: 12,
    textAlign: 'center'
  }
}




module.exports.layout0 = {
  wrap: {
    container: {
      flex: 1,
      justifyContent: "center",
    },
  },
  smalltext: {
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'left',
    color: BUTTON_BG_COLOR,
    fontSize: 15,
  },
  devname: {
    paddingLeft: 8,
    borderWidth: 0,
    width: 260,
    fontSize: 18,
    minHeight: 48,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: INPUT_BG_COLOR,
    color: INPUT_PLACEHOLDER_COLOR,
  },
  top: {
    container: {
      flex: 46,
      justifyContent: "flex-end",
      alignItems: "center"
    },
    icon: {
      //marginTop: (SCREEN_HEIGHT - 100) / 8,
      //width: SCREEN_WIDTH,
      color: LOGO_COLOR,
      textAlign: 'center',
      fontSize: 80,
      //backgroundColor: '#50ae3c',
      marginBottom: 26,
      fontFamily: LOGO_FONT,
    },
    subtitle: {
      //width: VIEW_WIDTH,
      textAlign: 'center',
      color: BLACK_TEXT_COLOR,
      fontSize: 20,
      height: 32,
      //backgroundColor: PRIMARY,
    },
    prompt: {

      textAlign: 'center',
      color: LIGHT_TEXT_COLOR,
      fontSize: 15,
      //backgroundColor: DARK_PRIMARY,
    },
    attempt: {
      marginBottom: 10,
      marginTop: 60,
      textAlign: 'center',
      color: BUTTON_BG_COLOR,
      fontSize: 15,
    }
  },
  bottom: {
    container: {
      flex: 54,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    loginbutton: {
      subtitle: {
        color: BLACK_TEXT_COLOR,
        marginTop: 0,
        textAlign: 'center',
      },
      base: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginBottom: 3,
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
      },
      icon: {
        fontFamily: ICON_FONT,
        color: BUTTON_TEXT_COLOR,
        fontSize: 45,
      },
      wrap: {
        flexDirection: 'row',
        height: 110,
      }
    }
  }
}



module.exports.layout1 = {
  termandcondition: {
    backgroundColor: WHITE,
    position: 'absolute',
    top: 40,
    bottom: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 120,
  },
  wrap: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: 'center',
  },
  statusbar: {},
  title: {
    wrap: {
      //backgroundColor: '#ae0000',
      //flex: 12,
      minHeight: 76,
      zIndex: 100,
      //alignItems: 'center',
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 26,
      justifyContent: "space-between",
      //backgroundColor: "rgba(255,186,186,1)"
    },
    button: {
      width: 50,
      textAlign: 'center',
      fontSize: 20,
      paddingTop: 15,
      color: BUTTON_BG_COLOR,
      fontFamily: ICON_FONT,
      //backgroundColor: "rgba(165,255,250,1)" 
    },
    crosshighlight: {
      width: 48,
      height: 48,
      //backgroundColor: "rgba(165,255,250,1)" 
    },
    base: {
      color: TITLE_TEXT_COLOR,
      fontSize: 19,
      textAlign: 'center',
      width: SCREEN_WIDTH - 100,
      paddingTop: 12,
      //    backgroundColor: TITLE_BG_COLOR
      //    backgroundColor: "rgba(80,188,28,1)"
    }
  },
  content: {
    scrollwrap: {
      flexDirection: 'column',
      //backgroundColor: "rgba(10,20,132,1)",
    },
    wrap: {
      flex: 1,
      alignItems: 'center',
      //backgroundColor: "rgba(203,255,132,1)",
    },
    container: {
      width: 260,
      flex: 1,
      //backgroundColor: "rgba(203,45,102,1)",
    },
    camera: {
      prompt: {
        textAlign: 'center',
        color: WHITE,
        fontSize: 18,
        minHeight: 24,
        height: 48,
      },
      wrap: {
        width: SCREEN_WIDTH,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
        //backgroundColor: "rgba(203,45,102,1)",
      },
      boxwrap: {
        flex: 60,
        //backgroundColor: '#ffaaff',
        flexDirection: 'column',
        //alignItems: 'center',
        justifyContent: 'center',
      },
      box: {
        borderWidth: 2,
        borderColor: BUTTON_BG_COLOR,
        flex: 60,
        alignSelf: 'center',
      }
    },
    code: {
      wrap: {
        flex: 15,
        minHeight: 50,
      },
      input: {
        backgroundColor: 'rgba(100,100,100,0.5)',
        marginBottom: 0,
        flex: 1,
        color: WHITE
      },
      placeholderTextColor: 'rgba(255,255,255,0.8)',
    },
    top: {
      container: {
        flex: 53,
        justifyContent: "flex-end",
        //backgroundColor: '#00ff00'
      },
      text: {
        fontSize: 21,
        color: BLACK,
        textAlign: 'center',
        marginBottom: 22,
      }
    },
    bottom: {
      container: {
        flex: 47,
        justifyContent: "flex-start",
        //backgroundColor: '#00ffff'
      },
    },
    slider: {
      text: {
        textAlign: 'center',
        fontSize: 18,
      },
      base: {
        //backgroundColor: "rgba(255,164,164,1)",
        //color: '#ff0000'
        marginTop:3,
        height: 30,
      },
      minimumTrackTintColor: Platform.OS === "android"?(Platform.Version >= 23?"#000000":"#808080"):BUTTON_BG_COLOR,
      maximumTrackTintColor: Platform.OS === "android"?BUTTON_BG_COLOR:INPUT_BG_COLOR,
    }
  },
  bottom: {
    wrap: {
      flex: 22,
      //height: 50,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      marginBottom:20
      //backgroundColor: "rgba(155,199,255,1)"
    },
    container: {
      width: 260,
      paddingTop: 5,
      //backgroundColor: "rgba(50,107,180,1)"
    },
    button: {
      width: 260,
    alignSelf:'center'
    },
    footertext: {
      color: BUTTON_BG_COLOR,
      fontSize: 15,
      textAlign: 'center',
      textDecorationLine: 'underline',
    }
  }
}

const layout2 = module.exports.layout2 = Object.assign(module.exports.layout1, {
})

const navbar = module.exports.navbar = {
  title: {
    color: TITLE_TEXT_COLOR,
    style: {
      fontSize: 18,
    },
    titleStyle: {
       color: LOGO_COLOR,
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'normal',
      //backgroundColor: '#50ae3c',
      fontFamily: LOGO_FONT,
    },
    titleText:{
      color:'white',
      textAlignVertical: 'center',
      backgroundColor: '#146cc0',
      alignSelf:'center',
      textAlign:'center',
      fontSize: 18,
      letterSpacing: 0.5,
      fontWeight: '500',
      width:SCREEN_WIDTH,
      height:30,
     
    }

  },
  base: {
    height: 57
  },
  bgcolor: BACKGROUND_COLOR,
  icon: {
    color: BUTTON_BG_COLOR,
  },
  statusBar: {
    tint: BACKGROUND_COLOR,
    light: false,
  }
}

const layout3 = module.exports.layout3 = {
  bbgcolor: WHITE,
  split: {
    bottom: {
      flex: 1,
      backgroundColor: WHITE,
    },
    top: {
      wrap: {
        flex: 1,
      },
      bg: {
        //height: SCREEN_HEIGHT,
        //width: SCREEN_WIDTH,
        resizeMode: 'cover',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
      }
    }
  },
  navbar: {
    backgroundColor: BACKGROUND_COLOR,
  },
  listheader: {
    wrap: {
      flex: 1,
      alignItems: 'center',
    },
    text: {
      color: BLACK, //list.listHeaderColor,
      paddingBottom: 5,
      paddingTop: 10,
      backgroundColor: BACKGROUND_COLOR,
    },
    rowwrap: {
      width: SCREEN_WIDTH * 4 / 5,
    },
  },
  row: {
    rowwrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      fontFamily: ICON_FONT,
      fontSize: 27,
    },
    iconwrap: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 5,
      paddingRight: 20,
    },
    namewrap: {
      flex: 3,
      marginBottom: 10
    },
    nametext: {
      flex: 1,
      fontSize: 13,
      color: PRIMARY_TEXT,
      marginBottom: 5
    },
    numtext: {
      fontSize: 10,
      color: ('rgba(' + PRIMARY_TEXT_RGB + ',0.54)'),
      paddingTop: 0,
    },
    border: {
      height: 1,
      backgroundColor: '#eae9e9'
    },
    totalwrap: {
      flex: 2,
      padding: 7,
    },
    baltext: {
      fontSize: 16,
      textAlign: 'right',
      flex: 1,
      color: BLACK
    },
    ptstext: {
      fontSize: 12,
      textAlign: 'right',
      paddingTop: 9,
      flex: 1,
      color: ('rgba(' + PRIMARY_TEXT_RGB + ',0.54)'),
    },
  },
  botmenu: {
    color: {
      hover: BOTTOM_MENU_SELECT_COLOR,
      nohover: BOTTOM_MENU_COLOR
    },
    boxwrap: {
      flexDirection: 'column',
      marginTop: 0,
      flex: 1,
    },
    bar: {
      hover: {
        backgroundColor: 'transparent',
        height: 0
      },
      nohover: {
        backgroundColor: 'transparent',
        height: 0
      }
    },
    box: {
      underlay: BOTTOM_MENU_UNDERLAY,
      hover: {
        flex: 1,
        backgroundColor: BOTTOM_MENU_SELECT_BG,
      },
      nohover: {
        backgroundColor: BOTTOM_MENU_BG,
        flex: 1,
      }
    },
    wrap: {
      flexDirection: 'row',
      height: 66,

    },
    inboxwrap: {
      flex: 1,
      flexDirection: 'column'
    },
    icon: {
      fontFamily: ICON_FONT,
      fontSize: 28,
      marginTop: 7,
      color: BOTTOM_MENU_COLOR,
      flex: 2,
      textAlign: 'center'
    },
    title: {
      fontSize: 13,
      color: BOTTOM_MENU_COLOR,
      flex: 1,
      textAlign: 'center'
    }
  }
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
    borderColor: WHITE,
    backgroundColor: WHITE,
    borderRadius: 30,
  },
  roundcornerbutton: {
    height: 48,
    width: 280,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: SCREEN_WIDTH / 2 - 140,
    borderWidth: 1,
    borderColor: WHITE,
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
    backgroundColor: WHITE,
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
    backgroundColor: BLACK,
    height: 1,
    opacity: 0.6,
  },
  div1: {
    width: SCREEN_WIDTH,
    backgroundColor: BLACK,
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
    color: WHITE,
    opacity: 1,
    height: 40,
    marginTop: 6,
    width: SCREEN_WIDTH,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
});


const AccountActivationStep = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WHITE,
    opacity: 1,
    marginTop: 16,
    width: SCREEN_WIDTH,
    textAlign: 'left',
    marginLeft: 8,
    textAlignVertical: 'center',
  },
  compulsory_chlng_name: {
    fontSize: 16,
    color: WHITE,
    opacity: 1,
    marginTop: 4,
    width: SCREEN_WIDTH,
    marginLeft: 24,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  optional_chlng_name: {
    fontSize: 16,
    color: WHITE,
    opacity: 1,
    marginLeft: 16,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  seprator: {
    width: SCREEN_WIDTH,
    backgroundColor: WHITE,
    height: 2,
    opacity: 1,
  },
  title: {
    fontSize: 24,
    color: WHITE,
    opacity: 1,
    height: 40,
    marginTop: 8,
    marginBottom: 8,
    width: SCREEN_WIDTH - 32,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});



const appointmentrow = StyleSheet.create({
  customerow: {
    backgroundColor: WHITE,
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
    backgroundColor: BLACK,
    height: 1,
    opacity: 0.6,
  },
});


const notification = StyleSheet.create({
  customerow: {
    backgroundColor: WHITE,
    width: SCREEN_WIDTH - 32,
    marginTop: 20,
    marginLeft: 16,
    marginRight: 16,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    height: 200,
    width: 300
  },
  row: {
    flexDirection: 'row',
    width: SCREEN_WIDTH - 32,

  },
  notificationButton: {
    flexDirection: 'row',
    width: SCREEN_WIDTH - 32,
  },
  amountrow: {
    flexDirection: 'row',
    width: SCREEN_WIDTH - 32,

  },
  text: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 14,
  },
  col: {
    marginRight: 20,
    flexDirection: 'column'
  },
  col1: {
    marginRight: 20,
    flex: 7,
    flexDirection: 'column',
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BLACK_TEXT_COLOR,
    width: 188,
    textAlign: 'left',
    opacity: 1,
    marginLeft: 8,
    marginTop: 8,
    backgroundColor: 'transparent',

  },
  time: {
    fontSize: 16,
    color: BLACK_TEXT_COLOR,
    textAlign: 'right',
    width: SCREEN_WIDTH - 236,
    opacity: 0.6,
    marginRight: 8,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  body: {
    fontSize: 16,
    color: BLACK_TEXT_COLOR,
    opacity: 0.6,
  },
  dot: {
    fontSize: 16,
    width: 15,
    color: BLACK_TEXT_COLOR,
    marginLeft: 8,
    opacity: 0.6,
  },
  body2: {
    fontSize: 16,
    marginRight: 32,
    width: SCREEN_WIDTH - 71,
    color: BLACK_TEXT_COLOR,
    opacity: 0.6,


  },
  bold: {
    fontSize: 22,
    width: SCREEN_WIDTH - 48,
    color: BLACK_TEXT_COLOR,
    opacity: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 8,
  },
  amountContainer: {
    justifyContent: 'flex-end',
    flex: 3,
  },
  htmlstyle: {
    fontSize: 20,
    color: BLACK_TEXT_COLOR,
    width: SCREEN_WIDTH - 32,
    opacity: 1,
    marginLeft: 8,
  },

  buttontext: {
    fontSize: SCREEN_WIDTH <= 320 ? 18 : 20,
    color: WHITE,
    textAlign: 'center',
    opacity: 1,
  },
  confirmbutton: {
    /* width:(SCREEN_WIDTH-32)/3,
     
     height:56,*/
    flex: 1,
    backgroundColor: APPROVE_BUTTON_COLOR,
    margin:2,
  },
  denybutton: {
    /* width:(SCREEN_WIDTH-32)/3,
     
     height:56,*/
    flex: 1,
    backgroundColor: REJECT_BUTTON_COLOR,
    margin:2,
  },
  fraudbutton: {
    /* width:(SCREEN_WIDTH-32)/3,
     
     height:56,*/
    flex: 1,
    backgroundColor: FRAUD_BUTTON_COLOR,
    margin:2,
  },
  approvebutton: {
    /* width:(SCREEN_WIDTH-32)/2,
     height:56, */
    flex: 1,
    backgroundColor: APPROVE_BUTTON_COLOR,
    margin:2,
  },
  rejectbutton: {
    /*width:(SCREEN_WIDTH-32)/2,
    height:56, */
    flex: 1,
    backgroundColor: REJECT_BUTTON_COLOR,
    margin:2,
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
    backgroundColor: WHITE,
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
    marginTop: 20,
    width: 270,
    height: 270,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEXT_COLOR,
    height: 60,
    width: 270,
    marginTop: 16,
  },
  errorMsg: {
    fontSize: 15,
    color: BUTTON_BG_COLOR,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 16,
  },
  operationMsg: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    textAlign: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    margin: 16,
  },
  patternLockParentContainer: {
    height: SCREEN_HEIGHT - 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternLockChildContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

const ConnectionProfile = StyleSheet.create({
  branchstyle: {
    backgroundColor: WHITE,
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
  switchview: {
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
    backgroundColor: 'rgba(' + login.TEXT_INPUT_BG_RGB + ',0.54)',
  },
  button: {
    height: 60,
    backgroundColor: login.BUTTON_BG,
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
    color: WHITE,
    //backgroundColor: 'rgba(70,0,0,0.5)',
  },
  logo_r: {
    position: 'absolute',
    fontSize: 120,
    marginLeft: leftrid,
    color: WHITE,
    //backgroundColor: 'rgba(70,0,0,0.5)',
  },
  logo_d: {
    position: 'absolute',
    fontSize: 120,
    marginLeft: 62 + leftrid,
    color: WHITE,
    //backgroundColor: 'rgba(70,0,0,0.5)',
  },
  relid_wrap: {
    alignItems: 'center',
    top: SCREEN_HEIGHT / 4 + 5,

  },
  relid: {
    fontFamily: 'icomoon',
    fontSize: 21,
    // marginLeft: 31 + leftrid,
    marginLeft: 47,
    width: 170,
    flex: 1,
    color: WHITE,
    backgroundColor: 'transparent',
    //backgroundColor: 'rgba(0,100,0,0.5)',
  },
  text_wrap: {
    top: SCREEN_HEIGHT / 3,
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
    color: load.LOAD_SEQUENCE_TEXT_COLOR,
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
    color: WHITE,
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
    color: WHITE,
    fontFamily: admin.MENU_FONT,
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


const linkStyle = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginTop: 5,
    padding: 5,
    textDecorationLine: 'underline',
    color: 'white',
    fontSize: 15
  }
});























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
  loadertext: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2,
    fontSize: 16,
    width: SCREEN_WIDTH,
    color: TEXT_COLOR,
    opacity: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 10
  },
  warning_text: {
    fontSize: 16,
    color: login.WARNING_TEXT_COLOR,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 8,
    height: 20
  },
  bgcolorizer: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(' + load.BG_COLOR_RGB + ',' + load.BG_COLOR_OPACITY + ')',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  bgbase: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(' + load.BG_COLOR_RGB + ',1)',
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
  fullscreen: {
    width: max.width,
    height: SCREEN_HEIGHT - 100,
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
    color: load.TITLE_COLOR,
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
    backgroundColor: 'rgba(' + login.TEXT_INPUT_BG_RGB + ',' + login.TEXT_INPUT_BG_OPACITY + ')',
  },
  textinput: {
    flex: 1,
    fontSize: 22,
    color: login.TEXT_INPUT_COLOR,
    textAlign: 'center',
    backgroundColor: null,
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
    backgroundColor: login.BUTTON_BG,
  },
  buttontext: {
    flex: 1,
    fontSize: 22,
    color: login.BUTTON_TEXT_COLOR,
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


const collection = {
  coreStyle,
  logStyle,
  progStyle,
  loadStyle,
  transforms,
  CLIENT_TITLE_TEXT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  THEME_COLOR,
  PLACEHOLDER_TEXT_COLOR_RGB,
  DEV_BIND_ICON_TEXT_COLOR_RGB,
  DEV_BIND_TYPE_TEXT_COLOR_RGB,
  BLACK_TEXT_COLOR,
  customeStyle,
  AccountActivationStep,
  appointmentrow,
  notification,
  addappointment,
  questionrow,
  ConnectionProfile,
  BUTTON_BG_COLOR,
  PatternLockStyle,
  nav,
  open,
  load,
  main,
  login,
  VIEW_WIDTH,
  admin,
  list,
  ACC_FONT,
  spd: SPEED,
  loadspd: LOADSPEED,
  controlStyle,
  activationStyle,
  linkStyle,
  colors,
  statusBarStyle,
  font: {
    ICON_FONT,
    CORE_FONT,
    ACC_FONT,
    LOGO_FONT,
  },
  color:{
    LOGO_COLOR,
  },
  LOAD_SCREEN_IMAGE,
  STATUS_BAR_TINT_COLOUR,
};

module.exports = Object.assign(module.exports, collection);
