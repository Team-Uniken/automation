
var React = require('react-native');
var ToolBar = require('./ToolBar');
var TEXTCOLOR = '#A9A9A9';

var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

var FAKE_BOOK_DATA = [
                      {volumeInfo: {title: 'Row number 1', authors: "J. D. one", imageLinks: {thumbnail: 'http://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'}}},
                      {volumeInfo: {title: 'Row number 2', authors: "J. D. two", imageLinks: {thumbnail: 'http://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'}}},
                      {volumeInfo: {title: 'Row number 3', authors: "J. D. three", imageLinks: {thumbnail: 'http://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'}}},
                      {volumeInfo: {title: 'Row number 4', authors: "J. D. four", imageLinks: {thumbnail: 'http://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'}}},
                      {volumeInfo: {title: 'Row number 5', authors: "J. D. Five", imageLinks: {thumbnail: 'http://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'}}},
                      {volumeInfo: {title: 'Row number 6', authors: "J. D. Six", imageLinks: {thumbnail: 'http://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'}}}

                      ];

var {
  Image,
  StyleSheet,
  Text,
  View,
  Component,
  ListView,
  AppRegistry,
  TextInput,
  TouchableHighlight,
  Dimensions,
  AsyncStorage,
} = React;

var status;
var styles = StyleSheet.create({
                               container: {
                               flex: 1,
                               flexDirection: 'row',
                               marginRight:16,
                               },
                               maincontainer: {
                                   flex: 1,
                                    backgroundColor: 'rgba(8,26,60,0.9)'
                               },
                               container1: {
                               flex: 1,
                               flexDirection: 'row',
                               paddingTop:1,
                               paddingLeft:10
                               },
                               thumbnail: {
                               width: 53,
                               height: 81,
                               marginRight: 10
                               },

                               formInput: {
                               height: 48,
                               flex: 1,
                               fontSize: 16,
                               marginLeft:16,
                               marginRight:16,
                               color: "#555555"
                               },
                               button: {
                               height: 48,
                               width: 48,
                               opacity:0.4,
                               justifyContent: "center"
                               },


                               leftLabels:{textAlign: 'left',
                                            fontSize:16,
                                            color: TEXTCOLOR,
                                            width:160,
                                            margin:4,
                               },

                               rightLabels:{textAlign: 'left',
                                             fontSize:16,
                                             color: TEXTCOLOR,
                                             margin:4,
                               },
                               images: {
                                 width: 18,
                                 height: 18,
                                 margin:16,

                               },
                               customerow:
                               {
                               },
                               separator:
                               {
                                 height:2,
                                 margin:8,
                                 backgroundColor:TEXTCOLOR,
                               },
                               input: {
                                 fontFamily: 'Century Gothic',
                                 backgroundColor: 'rgba(255,255,255,0.1)',
                                 width:Dimensions.get('window').width-154,
                                 marginLeft:16,
                                 marginRight:8,
                                 height: 56,
                                 fontSize:16,
                                 color: 'rgba(255,255,255,1)',
                               },
                               listView:{margin:8,}
                               });


class Device extends Component {

  constructor(props) {
    super(props);
    this.state = {
    dataSource: new ListView.DataSource({
                                        rowHasChanged: (row1, row2) => row1.guid !== row2.guid
                                        }),
      username: "",
    };
  }

  componentDidMount() {
    status = 'created';
    var books = FAKE_BOOK_DATA;
    this.setState({
                  dataSource: this.state.dataSource.cloneWithRows(books)
                  });
    AsyncStorage.getItem("userId").then((value) => {
        ReactRdna.getRegisteredDeviceDetails(value, (response) => { });
    }).done();
    
  }

  render() {
    return (
      <View style={styles.maincontainer}>
      <ToolBar navigator={this.props.navigator} title="Device"/>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderBook.bind(this)}
      style={styles.listView}
      />
      </View>

            );
  }


  renderBook(book) {
    return (
      <View style={styles.customerow}>

            <View style={styles.container}>
                <TextInput
                placeholder="Device Name"
                	placeholderTextColor={'rgba(255,255,255,0.5)'}
                	style={styles.input}
                 />
            <TouchableHighlight onPress={() => this.onEditPressed(book) } style={styles.button}>
              <Image source={require('image!edit')} style={styles.images} />
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.onDeletePressed(book) } style={styles.button}>
              <Image source={require('image!delete')} style={styles.images} />
            </TouchableHighlight>
            </View>

            <View style={styles.container1}>
            <Text
            style={styles.leftLabels}
            >Status:</Text>
            <Text
            style={styles.rightLabels}
            >Active</Text>
            </View>

            <View style={styles.container1}>
            <Text
            style={styles.leftLabels}
            >Created On:</Text>
            <Text
            style={styles.rightLabels}
            >Jan 2015 Active</Text>
            </View>

            <View style={styles.container1}>
            <Text
            style={styles.leftLabels}
            >Last Login On:</Text>
            <Text
            style={styles.rightLabels}
            >March 2015 Active</Text>
            </View>

            <View style={styles.container1}>
            <Text
            style={styles.leftLabels}
            >Last Login Status:</Text>
            <Text
            style={styles.rightLabels}
            >Success</Text>
            </View>

            <View style={styles.container1}>
            <Text
            style={styles.leftLabels}
            >Queued For Deleting:</Text>
            <Text
            style={styles.rightLabels}>Permanent</Text>
            </View>
            <View style={styles.separator}/>
            </View>
            );
  }

  onEditPressed(book) {
    var title = book.volumeInfo.title;
    alert('Edit button of '+title);
  }

  onDeletePressed(book) {
    var title = book.volumeInfo.title;
    alert('Delete button of '+title);
  }
}
module.exports = Device;
