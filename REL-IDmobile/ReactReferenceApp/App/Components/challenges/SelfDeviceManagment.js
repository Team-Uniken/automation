
var React = require('react-native');
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
  TouchableHighlight
} = React;

var status;
var styles = StyleSheet.create({
                               container: {
                               flex: 1,
                               flexDirection: 'row',
                               justifyContent: 'center',
                               alignItems: 'center',
                               backgroundColor: '#F5FCFF',
                               padding: 10
                               },
                               container1: {
                               flex: 1,
                               flexDirection: 'row',
                               paddingTop:1,
                               backgroundColor: '#F5FCFF',
                               paddingLeft:10
                               },
                               thumbnail: {
                               width: 53,
                               height: 81,
                               marginRight: 10
                               },
                               rightContainer: {
                               flex: 0
                               },
                               separator: {
                               height: 1,
                               backgroundColor: '#000000'
                               },
                               title: {
                               fontSize: 20,
                               marginBottom: 8
                               },
                               formInput: {
                               height: 36,
                               padding: 10,
                               marginRight: 5,
                               marginBottom: 5,
                               marginTop: 5,
                               flex: 1,
                               fontSize: 18,
                               borderWidth: 1,
                               borderColor: "#555555",
                               borderRadius: 8,
                               color: "#555555"
                               },
                               button: {
                               height: 25,
                               width: 25,
                               marginLeft:10,
                               backgroundColor: "#F5FCFF",
                               borderColor: "#555555",
                               borderWidth: 1,
                               borderRadius: 8,
                               marginTop: 1,
                               justifyContent: "center"
                               },
                               buttonText: {
                               fontSize: 8,
                               color: "#000000",
                               alignSelf: "center"
                               },
                               author: {
                               color: '#656565'
                               },
                               
                               leftLabels:{textAlign: 'left',
                                            fontSize:14,
                                            color: '#2579a2',
                                            width:150,
                                            margin:12,
                               },
                               
                               rightLabels:{textAlign: 'left',
                                             fontSize:14,
                                             color: '#2579a2',
                                             margin:12,
                               },
                               listView:{marginTop:20,}
                               });


class testDemo extends Component {

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
  }
  
  render() {
    return (
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderBook.bind(this)}
            style={styles.listView}
            />
            );
  }


  renderBook(book) {
    return (
            <TouchableHighlight>
            <View>
            <View style={styles.container}>
            
            <TextInput
            placeholder="Device Name"
            onChange={(event) => this.setState({username: event.nativeEvent.text})}
            style={styles.formInput}
            value={this.state.username} />
            <TouchableHighlight onPress={() => this.onEditPressed(book) } style={styles.button}>
            <Text style={styles.buttonText}>E</Text>
            </TouchableHighlight>
            
            <TouchableHighlight onPress={() => this.onDeletePressed(book) } style={styles.button}>
            <Text style={styles.buttonText}>D</Text>
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
            style={{textAlign: 'right',
            fontSize:14,
            color: '#2579a2',
            margin:12,
            paddingBottom:15,
            }}
            >Permanent</Text>
            </View>

            
            <View style={styles.separator} />
            </View>
            </TouchableHighlight>
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

//AppRegistry.registerComponent('testDemo', () => testDemo);

