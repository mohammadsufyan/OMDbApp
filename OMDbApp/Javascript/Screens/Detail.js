import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const FavoriteEmpty = require('../Images/favorite_empty.png');
const FavoriteFilled = require('../Images/favorite_filled.png');

let detailObject = null;

export default class Detail extends Component{

  static navigationOptions = ({navigation}) => ({
      title: 'Detail Screen',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'rgba(0,0,0,0.8)',
      },
    });

  constructor(props) {
    super(props);
    detailObject = this;
    this.state = {
      data: props.navigation.state.params,
      isFavorite: false,
    };
  }

  componentWillMount() {
    this.getDetilsFromStorage();
  }

  async saveDataToStorage(dataArray) {
    const savingData = JSON.stringify(dataArray);
    try {
      await AsyncStorage.setItem('mediaData', savingData);
      this.getDetilsFromStorage();
    } catch (error) {
      // Error saving data
      Alert.alert('Problem in saving favorites.')
    }
  }

  favoriteButtonClicked() {
    if (this.state.isFavorite) {
      Alert.alert('Already in Favorites', 'Do you want to remove it from Favorite List',[
        {text: 'Delete', onPress: () => {
          this.removeFavoritesFromStorage();
        }},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: true });
    } else {
      Alert.alert('Add to Favorites', '',[
        {text: 'Add', onPress: () => {
          this.saveToDetailsToFavorite();
        }},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: false });
    }
  }

  async saveToDetailsToFavorite() {
    try {
      let data = await AsyncStorage.getItem('mediaData');
      if (data !== null){
        let mediaData;
        if (data.length === 2) {
          mediaData = [];
        } else {
          mediaData = JSON.parse(data);
        }
        mediaData.push(this.state.data);
        const savingData = JSON.stringify(mediaData);
        try {
          await AsyncStorage.setItem('mediaData', savingData);
          await this.getDetilsFromStorage();
        } catch (error) {
          // Error saving data
          Alert.alert('Problem in saving favorites.')
        }
      }
      else {
        let dataArray = [];
        dataArray.push(this.state.data);
        const savingData = JSON.stringify(dataArray);
        try {
          await AsyncStorage.setItem('mediaData', savingData);
          // this.getDetilsFromStorage();
        } catch (error) {
          // Error saving data
          Alert.alert('Problem in saving favorites.')
        }
        
      }
    } catch (error) {
      Alert('error in operation.');
    }
  }

  async getDetilsFromStorage() {
    try {
      const value = await AsyncStorage.getItem('mediaData');
      if (value !== null){
        // We have data!!
        let mediaData = JSON.parse(value);
        if (await this.checkCurrentMediaDataAvailableInStorage(mediaData)) {
          this.setState({isFavorite: true});
        } else {
          this.setState({isFavorite: false});
        }
      }
      else {
        this.setState({isFavorite: false});
      }
    } catch (error) {
      Alert.alert('Error in fetching data')
    }
  }

  checkCurrentMediaDataAvailableInStorage(storageData) {
    for (let index in storageData) {
      if(storageData[index].imdbID === this.state.data.imdbID){
        return true;
      }
    }
    return false;
  }

  async removeFavoritesFromStorage() {
    try {
      const value = await AsyncStorage.getItem('mediaData');
      if (value !== null){
        // We have data!!
        let mediaData = JSON.parse(value);

        for (let index in mediaData) {
          if(mediaData[index].imdbID === this.state.data.imdbID){
            mediaData.splice(index, 1);
          }
        }
        const savingData = JSON.stringify(mediaData);
        try {
          await AsyncStorage.setItem('mediaData', savingData).ca
          this.getDetilsFromStorage();
        } catch (error) {
          // Error saving data
          Alert.alert('Problem in saving favorites.')
        }
      }
    } catch (error) {
      Alert.alert('Error in fetching data')
    }
  }

  renderTitleView(){
    return(
      <View style={styles.titleView}>
        <Image source={{uri: this.state.data.Poster}} style={styles.poster}/>
        <View style={styles.titleRightView}>
          <Text style={styles.title}>{this.state.data.Title}</Text>
          <Text style={styles.yearText}>{this.state.data.Year}, {this.state.data.Runtime}</Text>
          <Text style={styles.yearText}>{this.state.data.Genre}</Text>
          <Text style={styles.rating}>{this.state.data.imdbRating} *</Text>
          { this.favoriteButton() }
        </View>
      </View>
    )
  }

  favoriteButton() {
    return(
      <View style={styles.rightButton}>
        <TouchableOpacity 
          style={styles.flexOne}
          onPress={()=> {
            this.favoriteButtonClicked();
          }}
        >
          <Image style={styles.flexOne} source={this.state.isFavorite ? FavoriteFilled : FavoriteEmpty} />
        </TouchableOpacity>  
      </View>
    )
  }

  renderInformation(header, text) {
    return(
      <View style={styles.informationView}>
        <Text style={styles.informationHeader}>{header}</Text>
        <Text style={styles.informationText}>{text}</Text>
      </View>
    );
  }

  getViewFromHeader(header) {
    switch(header){
      case 'Plot':
        return this.renderInformation(header, this.state.data.Plot)
      case 'Actors':
        return this.renderInformation(header, this.state.data.Actors)
      case 'Director':
        return this.renderInformation(header, this.state.data.Director)
      case 'Language':
        return this.renderInformation(header, this.state.data.Language)
      case 'Writer':
        return this.renderInformation(header, this.state.data.Writer)
      case 'Production':
        return this.renderInformation(header, this.state.data.Production)
      default:
      return null;
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.detailContainer}>
          <ScrollView>
            {this.renderTitleView()}
            {this.getViewFromHeader('Plot')}
            {this.getViewFromHeader('Actors')}
            {this.getViewFromHeader('Director')}
            {this.getViewFromHeader('Language')}
            {this.getViewFromHeader('Writer')}
            {this.getViewFromHeader('Production')}
          </ScrollView>
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
    backgroundColor: 'rgb(0,0,0)',
  },
  detailContainer: {
    flex: 1,
    marginTop: 3,
  },
  titleView: {
    flex: 1,
    flexDirection: 'row',
  },
  poster: {
    marginLeft: 20,
    width: 150,
    height: 250,
  },
  titleRightView: {
    height: 250,
    padding: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 22.0,
    marginRight: 5,
    color: 'white',
    fontFamily: 'Helvetica',
  },
  yearText: {
    marginTop: 5,
    marginRight: 5,
    fontSize: 16.0,
    color: 'rgb(150,150,150)',
    fontFamily: 'Helvetica',
  },
  rating: {
    marginTop: 5,
    fontSize: 16.0,
    marginRight: 5,
    color: 'white',
    fontFamily: 'Helvetica',
  },
  informationView: {
    borderColor: 'rgb(150,150,150)',
    borderBottomWidth: 0.75,
    padding: 20,
  },
  informationHeader: {
    fontSize: 18.0,
    color: 'white',
    fontFamily: 'Helvetica',
  },
  informationText: {
    marginTop: 5,
    fontSize: 16.0,
    color: 'rgb(150,150,150)',
    fontFamily: 'Helvetica',
  },
  searchTextInput: {
    height: 40,
    marginRight: 15,
    marginLeft: 15,
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
    fontSize: 20.0,
    color: 'rgb(245,245,245)',
    fontFamily: 'Helvetica-Bold',
  },
  detailText: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 17.0,
    color: 'rgba(245,245,245,0.9)',
    fontFamily: 'Helvetica'
  }
});
