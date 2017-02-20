/*
 *Custome Search component.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {View, Text, Image, TouchableOpacity } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';

/*
 Custome View
 */
import Input from './input';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SearchiconHeight: 48,
      searchiconWidth: 48,
      SearchHeight: 48,
      searchWidth: 48,
      SearchoffHeight: 0,
      searchoffWidth: 0,
    };
  }

  searchclick() {
    this.setState({
      SearchoffHeight: 48,
      searchoffWidth: Skin.SCREEN_WIDTH,
      SearchHeight: 48,
      searchWidth: Skin.SCREEN_WIDTH,
      SearchiconHeight: 0,
      searchiconWidth: 0,
    });
  }

  doSearch() {

    this.setState({
      SearchoffHeight: 0,
      searchoffWidth: 0,
      SearchHeight: 48,
      searchWidth: 48,
      SearchiconHeight: 48,
      searchiconWidth: 48,
    });
    //   alert('doSearch');
  }

  render() {
    return (
      <View style={{
        backgroundColor: 'transperant', marginRight: 16, position: 'absolute', top: 0, bottom: 0,
        width: this.state.searchWidth, height: this.state.SearchHeight, right: 0,
      }}>
        <View style={{
          flexDirection: 'column', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
          width: this.state.searchoffWidth, height: this.state.SearchoffHeight,
          marginTop: 12,
          position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        }}>
          <Input
            value={this.props.value}
            styleInputView={{ backgroundColor: '#fff' }}
            placeholder={'Search'}
            ref={'Search'}
            keyboardType={'default'}
            returnKeyType={'next'}
            enablesReturnKeyAutomatically={true}
            autoFocus={false}
            autoCorrect={false}
            autoComplete={false}
            autoCapitalize={true}
            onChange={this.props.onChange}
            onSubmitEditing={() => {
              this.doSearch();
              this.props.onSubmitEditing();
            } }
            focusLost={true}
            onFocusLost={() => {
              this.doSearch();
            } }
            />
        </View>
        <TouchableOpacity style={{
          flexDirection: 'column', backgroundColor: 'transperant', alignItems: 'center', justifyContent: 'flex-end',
          height: this.state.SearchiconHeight, width: this.state.searchiconWidth,
          marginTop: 8,
          position: 'absolute', top: 0, bottom: 0, right: 0, marginRight: 30,
        }}
          underlayColor={Skin.baseline.button.underlayColor}
          activeOpacity={Skin.baseline.button.activeOpacity}
          onPress={() => {
            this.searchclick();
            this.refs.Search.focus();
          } }
          >
          <Image
            style={{ backgroundColor: 'transperant', height: 24, width: 24, marginBottom: 14 }}
            source={require('../../img/search.png') }
            resizeMode='stretch' />
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = Search;
  //  <Search
  //         value={this.state.search}
  //         onChange={this.onSearchChange.bind(this) }
  //         onSubmitEditing={this.performesearch.bind(this) }
  //         />