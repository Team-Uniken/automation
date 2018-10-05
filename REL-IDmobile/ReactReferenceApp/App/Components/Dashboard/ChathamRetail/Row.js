import React from 'react'
import Skin from '../../../Skin';

import { StyleSheet, Dimensions, Platform, Image, View, Text } from 'react-native';
const Row = (props) => (
  <View style={{ flexDirection: 'column', height: 60 }}>
    <View style={{ flexDirection: 'row', height: 60,alignItems:'center'}}>
      <Text style={styles.listIcons}>{props.image}
      </Text>

      <Text style={{
        fontSize: 16, alignSelf: 'center', marginLeft: 20,
        fontWeight: '600', color:'black'
      }}>{props.title}</Text>

    </View>
    <View style={{ backgroundColor: 'gray', height: 0.7, marginLeft: 75 }}></View>
  </View>
)

const styles = StyleSheet.create({
  listIcons:{
    fontFamily: Skin.font.LOGO_FONT,
    fontSize: 30,
    width:30,
    height:30,
    marginLeft: 25,
    alignSelf: 'center',
    color:Skin.BUTTON_BG_COLOR,
    textAlign:'center'
  }});


export default Row