/*
    CSS classes which are common to all screens will be defined over here.
*/
'use strict';

var React = require('react-native');

var {StyleSheet} = React;

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;
var TEXT_COLOR = '#000';
var BUTTON_TEXT_COLOR = '#fff';
var BACKGROUND_COLOR = '#fff';
var STATUS_BAR_COLOR = '#1976d2';
var TOOL_BAR_COLOR = '#2196F3';


module.exports = {
  SCREEN_WIDTH : SCREEN_WIDTH,
	SCREEN_HEIGHT : SCREEN_HEIGHT,
	TEXT_COLOR : TEXT_COLOR,
	BUTTON_TEXT_COLOR : BUTTON_TEXT_COLOR,
	BACKGROUND_COLOR : BACKGROUND_COLOR,
}
