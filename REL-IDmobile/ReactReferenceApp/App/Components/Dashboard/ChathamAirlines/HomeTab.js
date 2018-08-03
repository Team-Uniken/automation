/*
 * it shows Notifications
 */
"use strict";
/*
 ALWAYS NEED
 */
import React, { Component } from "react";
import ReactNative from "react-native";
import moment from "moment";

/*
 Required for this js
 */
import Events from "react-native-simple-events";
import {
  StyleSheet,
  Text,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  Alert,
  Platform,
  Image,
  ScrollView
} from "react-native";
import { NativeModules, NativeEventEmitter } from "react-native";
import Modal from "react-native-simple-modal";
import TouchID from "react-native-touch-id";
import Util from "../../Utils/Util";
import Main from "../../Container/Main";
import { Card } from "react-native-elements";
/*
 Use in this js
 */
import Skin from "../../../Skin";

/*
 INSTANCES
 */
const SCREEN_WIDTH = require("Dimensions").get("window").width;
const NotificationAction = {
  ACCEPT: "accept",
  REJECT: "reject",
  FRAUD: "fraud",
  CLICK: "click",
  HIDE: "hide",
  CHANGELANG: "changelang"
};

export default class NotificationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parseMessage: ""
    };
  }
  componentDidMount() {}

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    var today = new Date();
    var currentDate = moment(Date(today)).format("DD/MM/YYYY");
    var nextDate = moment(today, "DD-MM-YYYY")
      .add(1, "days")
      .format("DD-MMM-YYYY");
    var nextDate1 = moment(today, "DD-MM-YYYY")
      .add(2, "days")
      .format("DD-MMM-YYYY");
    var array = Main.dnaUserName.split(".");
    var name;
    if (array.length > 1) {
      name = array[0].charAt(0).toUpperCase() + array[0].slice(1);
    } else {
      name = Main.dnaUserName;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Welcome Back, {name}</Text>
        <ScrollView>
        <Card style={styles.upgrade} title="MY PROFILE">
          <View style={styles.cards}>
            <View key={1} style={styles.user}>
              <Text style={styles.upd_text}>{"STATUS LEVEL"}</Text>

              <Text style={styles.name}>{"GOLD"}</Text>
              <Image
                style={styles.image}
                resizeMode="cover"
                source={require("../../../img/gold.png")}
              />
            </View>

            <View style={styles.user}>
              <Text style={styles.upd_text}>{"MILES BALANCE"}</Text>
              <Image
                style={styles.counterimage}
                resizeMode="cover"
                source={require("../../../img/counter.jpg")}
              />
            </View>
          </View>
        </Card>

        <Card style={styles.upgrade} title="UPCOMING RESERVATIONS">
          <Text style={styles.upd_text}>Confirmation Number: 3963823 </Text>
          <View style={styles.cards}>
            <View key={1} style={styles.user}>
              <Text style={styles.upd_text}>{" EWR"}</Text>

              <Image
                style={styles.image}
                resizeMode="cover"
                source={require("../../../img/depart_color.png")}
              />
              <Text style={styles.name}>{nextDate}</Text>
              <Text style={styles.name}>{"11:10 PM"}</Text>
            </View>

            <View style={styles.user}>
              <Text style={styles.upd_text}>{" DUB"}</Text>

              <Image
                style={styles.image}
                resizeMode="cover"
                source={require("../../../img/arrive_color.png")}
              />
              <Text style={styles.name}>{nextDate1}</Text>
              <Text style={styles.name}>{"10:50 AM"}</Text>
            </View>
          </View>
        </Card>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  customerow: {
    backgroundColor: Skin.color.WHITE,
    flex: 1,
    paddingTop: 8,
    paddingRight: 8,
    paddingLeft: 8,
    marginTop: 20,
    width: SCREEN_WIDTH - 32,
    alignSelf: "center"
  },

  title: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "transparent"
  },
  titleView: {
    height: 50,
    margin: 10,
    backgroundColor: "transparent"
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "transparent"
  },

  viewBox: {
    width: 80,
    height: 80,
    padding: 5,
    justifyContent: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: Skin.THEME_COLOR,
    backgroundColor: "transparent",
    borderWidth: 1
  },
  row: {
    flexDirection: "row",
    alignSelf: "center"
  },
  lngRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap"
  },
  rowMultiLang: {
    flexDirection: "row"
  },
  col: {
    flexDirection: "column"
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    height: 200,
  },
  notificationButton: {
    backgroundColor: "transparent",
    height: 50,
    flex: 1,
    flexDirection: "row"
  },
  amountrow: {
    flexDirection: "row",
    width: SCREEN_WIDTH - 32
  },
  text: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: Skin.BLACK_TEXT_COLOR,
    width: 188,
    flex: 3,
    textAlign: "left",
    opacity: 1,
    backgroundColor: "transparent"
  },
  time: {
    fontSize: 16,
    color: Skin.BLACK_TEXT_COLOR,
    textAlign: "right",
    opacity: 0.6,
    flex: 2,
    backgroundColor: "transparent"
    //width: SCREEN_WIDTH - 230,
  },
  body: {
    fontSize: 16,
    color: Skin.BLACK_TEXT_COLOR,
    opacity: 0.6
  },
  dot: {
    fontSize: 16,
    width: 15,
    color: Skin.BLACK_TEXT_COLOR,
    opacity: 0.6
  },
  body2: {
    fontSize: 16,
    marginRight: 32,
    width: SCREEN_WIDTH - 71,
    color: Skin.BLACK_TEXT_COLOR,
    opacity: 0.6
  },
  bold: {
    fontSize: 22,
    width: SCREEN_WIDTH - 32 - 48,
    color: Skin.BLACK_TEXT_COLOR,
    opacity: 1,
    textAlign: "right",
    fontWeight: "bold"
  },
  amountContainer: {
    justifyContent: "flex-end",
    flex: 3
  },
  htmlstyle: {
    fontSize: 20,
    color: Skin.BLACK_TEXT_COLOR,
    width: SCREEN_WIDTH - 32,
    opacity: 1
  },

  buttontext: {
    fontSize: SCREEN_WIDTH <= 320 ? 18 : 20,
    color: Skin.color.WHITE,
    textAlign: "center",
    opacity: 1
  },
  confirmbutton: {
    /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.APPROVE_BUTTON_COLOR
  },
  denybutton: {
    /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.REJECT_BUTTON_COLOR
  },
  fraudbutton: {
    /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.FRAUD_BUTTON_COLOR
  },
  approvebutton: {
    /* width:(SCREEN_WIDTH-32)/2,
         height:56, */
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.APPROVE_BUTTON_COLOR
  },
  rejectbutton: {
    /*width:(SCREEN_WIDTH-32)/2,
        height:56, */
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.REJECT_BUTTON_COLOR
  },
  user: {
    textAlign: "center",
    justifyContent: "center"
  },
  upd_text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
    textAlign: "center"
  },
  containerConflict: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "#ecf0f1"
  },

  cards: {
    flexDirection: "row",
    color: "#34495e",
    justifyContent: "space-between"
  },
  name: {
    color: "#34495e",
    textAlign: "center",
    alignSelf: "center"
  },
  paragraph: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  },
  upgrade: {
    flexDirection: "row",
    color: "#34495e",
    justifyContent: "space-between"
  },
  image: {
    height: 50,
    width: 50,
    alignSelf: "center"
  },
  counterimage: {
    height: 50,
    width: 140
  }
});
