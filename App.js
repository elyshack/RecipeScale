import React from 'react';
import firebase from 'firebase';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Icon } from 'react-native-elements';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import HomeScreen from './screens/Home';
import RecipeList from './screens/RecipeList';
import RecipeView from './screens/RecipeView';


export default class App extends React.Component {
  componentWillMount() {
    console.disableYellowBox = true;
    YellowBox.ignoreWarnings(['Setting a timer']);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
      }
    };
    firebase.initializeApp({
      apiKey: "AIzaSyC1gElULDbIAt2fealoozomJNn7wbbcYTI",
      authDomain: "recipescale.firebaseapp.com",
      databaseURL: "https://recipescale.firebaseio.com/",
      projectId: "recipescale",
      storageBucket: "recipescale.appspot.com",
      messagingSenderId: "624441255421"
    });
    global.apiKey = 'AIzaSyC1gElULDbIAt2fealoozomJNn7wbbcYTI';

  }

  render() {

    const AppStack = createStackNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            headerMode: 'none'
          }
        },
        RecipeList: {
          screen: RecipeList,
          navigationOptions: {
            headerTitle: 'Recipe List'
          }
        },
        RecipeView: {
          screen: RecipeView,
          navigationOptions: {
            headerMode: 'none'
          }
        },
      }
    );

    const AuthStack = createStackNavigator(
      {
        Login: LoginScreen,
        Registration: RegistrationScreen
      },
      {
        headerMode: 'screen'
      }
    );

    const AppContainer = createAppContainer(createSwitchNavigator(
      {
        App: AppStack,
        Auth: AuthStack,
      },
      {
        initialRouteName: 'Auth',
        headerMode: 'none'
      }
    ));


    return (
      <Provider store={store}>
        <AppContainer/>
      </Provider>
    );
  }
}