import React from 'react'
import { StyleSheet, Dimensions, Platform, Image, View, Text } from 'react-native';
const Row = (props) => (
    <View style={{ flexDirection: 'column',height:50}}> 
  <View style={{ flexDirection: 'row',height:50}}> 
   <Image source={props.image} style={{width:20,height:20,alignSelf: 'center',marginLeft:25}}>  
    </Image>
 
  <Text style={{ fontSize: 18,alignSelf: 'center',marginLeft:20,
    fontWeight: 'bold',}}>{props.title}</Text> 
   
   
  </View>
  <View style={{backgroundColor: 'gray', height: 0.5,marginLeft:75}}></View>
  </View>
)

export default Row