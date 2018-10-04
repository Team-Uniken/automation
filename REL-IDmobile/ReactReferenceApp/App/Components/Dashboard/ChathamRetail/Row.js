import React from 'react'
import { StyleSheet, Dimensions, Platform, Image, View, Text } from 'react-native';
const Row = (props) => (
  <View style={{ flexDirection: 'column', height: 60 }}>
    <View style={{ flexDirection: 'row', height: 60 }}>
      <Image source={props.image} style={{ width: 20, height: 20, alignSelf: 'center', marginLeft: 25 }}>
      </Image>

      <Text style={{
        fontSize: 16, alignSelf: 'center', marginLeft: 20,
        fontWeight: '600', color:'black'
      }}>{props.title}</Text>

    </View>
    <View style={{ backgroundColor: 'gray', height: 1, marginLeft: 75 }}></View>
  </View>
)

export default Row