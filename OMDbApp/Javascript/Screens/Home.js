import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  NetInfo,
  Dimensions,
  Keyboard,
} from 'react-native';
import * as api from '../API/API';
import mockData from '../API/mock';
import * as responseTypes from '../API/ResponseTypes';

const {width, height} = Dimensions.get('window');

export default class Home extends Component{

  static navigationOptions = ({navigation}) => ({
      title: 'Home',
      headerStyle: {
        backgroundColor: 'rgba(185,18,29,0.8)',
      },
      headerTintColor: 'white',
    })

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  customiseStringFormat(string) 
  {
    const firstCapitalLetter = string.charAt(0).toUpperCase() + string.slice(1);
    const searchString = firstCapitalLetter.replace(' ', '+');
    return searchString;
  }

  searchUserInput(searchText) {
    if(this.state.searchText === ''){
      Alert.alert('Please enter text to search');
      return;
    }
    this.fetchMethod(this.customiseStringFormat(searchText));
    /*  Future enhancement  */
    // this.checkInternetConnectivity();
  }

  checkInternetConnectivity() {
    /*  Future enhancement  */
    // NetInfo.isConnected.fetch().then(isConnected => {
    //   if(isConnected){
    //     this.fetchMethod();
    //   }
    //   else{
    //     Alert.alert('Please check internet connection');
    //   }
    // });
  }

  fetchMethod(searchText) {
    api.makeFetchRequest(searchText, (responseType, response) => {
      this.handleAPIRespose(responseType, response)
    });
  }

  handleAPIRespose(responseType, response) {
    if(responseType === responseTypes.SUCCESS) {
      if(response.Response === 'False'){
        Alert.alert('No data available.');
        return;
      }
      this.navigateToDetailView(response);
    }
    if(responseType === responseTypes.FAILURE) {
      Alert.alert('Fail to get data from server.')
    }
  }

  navigateToDetailView(response) {
    const { navigate } = this.props.navigation;
    Keyboard.dismiss();
    navigate('Detail',response);
    this.setState({ searchText: '' });
  }

  render() {
    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
        <View style={styles.fieldContainer}>
          <Text style={styles.title}>
            {'Open Movie Database'}
          </Text>
          <TextInput
            placeholder={'Search any Movie or Tv-Series'}
            style={styles.searchTextInput}
            value={this.state.searchText}
            onChangeText={(text)=>{
              this.setState({searchText: text});
            }}
            returnKeyType={'done'}
            autoCapitalize={'words'}
            underlineColorAndroid={'transparent'}
            selectionColor={'white'}
            placeholderTextColor={'rgba(230,230,230,0.4)'}
            onSubmitEditing={()=>{
              /* Call API */
              // this.searchUserInput(this.state.searchText);
              this.navigateToDetailView(mockData);
            }}
          />
          <View style={styles.searchTouchableView}>
            <TouchableOpacity 
              style={styles.searchTouchable}
              onPress={()=> {
                /* Call API */
                // this.searchUserInput(this.state.searchText);
                this.navigateToDetailView(mockData);
              }}
            >
              <Text style={styles.searchTouchableText}>Search</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.detailText}>
            {'The OMDb API is a RESTful web service to obtain movie information, all content and images on the site are contributed and maintained by our users.'}
          </Text>
        </View>
      </View>
    );
}
}

const styles = StyleSheet.create({
  rightButton: {
    width: 25,
    height: 25,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(199,59,73)',
  },
  fieldContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 20.0,
    color: 'rgba(245,245,245,0.9)',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  searchTextInput: {
    height: 40,
    marginLeft: 15,
    width: width - 30,
    marginTop: 20,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: 'white',
    color: 'white',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  searchTouchableView: {
    width: 200,
    height: 40,
    marginTop: 10,
    backgroundColor: 'rgba(185,18,29,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
  },
  searchTouchable: {
    width: 200,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTouchableText: {
    fontSize: 16.0,
    color: 'rgb(245,245,245)',
    fontFamily: 'Helvetica-Bold',
  },
  detailText: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 17.0,
    color: 'rgba(245,245,245,0.8)',
    fontFamily: 'Helvetica'
  }
});