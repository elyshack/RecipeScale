import React, { Component } from 'react';
import { View, Image, Text, Dimensions, TextInput, StatusBar, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import { SafeAreaView } from 'react-navigation';

import Spinner from '../components/Spinner';




const screen = Dimensions.get('screen');

class HomeScreen extends Component {
    static navigationOptions = {
        header: null,

    };


    logOut = async () =>{
        this.props.logOut();
        await AsyncStorage.setItem('logged', 'false');
        this.props.navigation.navigate('Login');
    }

    navigateToRecipeList = () => {
        this.props.navigation.navigate('RecipeList', {modal: false});
    }

    navigateToNewRecipe = () => {
        this.props.navigation.navigate('RecipeList', {modal: true});
    }

    returnUserUID = async () => {
        userId = await firebase.auth().currentUser.uid;
        console.log(userId);
    }

    render() {
        return (
           <View style={styles.toplevel}>
            <StatusBar barStyle="dark-content"/>
            <View style={styles.titleBar}>
            <Text style={styles.bigtext}>RecipeScale</Text>
            </View>

            <View style={styles.optionGroup}>
                <TouchableOpacity style={styles.optionBar} onPress={this.navigateToNewRecipe}>
                    <Icon name='add-circle-outline' color="white"/>
                    <Text style={styles.smalltext}>New Recipe</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionBar} onPress={this.navigateToRecipeList}>
                    <Icon name='format-list-bulleted' color="white"/>
                    <Text style={styles.smalltext}>Recipe List</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionBar}>
                    <Icon name='settings' color="white"/>
                    <Text style={styles.smalltext}>Settings</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logOutBar} onPress={this.logOut}>
                <Text style={styles.logoutText}> LOG OUT </Text>
            </TouchableOpacity>
           </View>
        )
    }
}

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

);

const styles = StyleSheet.create({
    // icon: {
    //     color="#36C8EE"
    // },
    optionGroup: {
        height: '25%',
        justifyContent: 'space-between'
    },
    optionBar: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        width: '50%'
    },
    logOutBar: {
        borderTopWidth: 1,
        borderTopColor: 'white',
        backgroundColor: '#6B5589',
        height: '11%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    titleBar:{
        height: Math.floor(screen.height/7),
        backgroundColor: "#445689",
        justifyContent: 'flex-end',
    },
    bigtext: {
        marginTop: '10%',
        marginBottom: '3%',
        color: 'white',
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
    },
    logoutText:{
        marginLeft: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: "white"
    },
    colorbox: {
        borderWidth: 10
    },
    smalltext: {
        marginLeft: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: "white"
    },
    nameText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'
    },
    image: {
        width: null,
        resizeMode: 'contain',
        height: '50%',
        },
    toplevel: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "#445689"
    },
    mainContainer: {
        flexGrow: 1,
        height: '100%',
        justifyContent: 'space-between',
        padding: 20 },
    logo: {
        width: null,
        resizeMode: 'contain',
        height: '33%',
        marginTop: '25%' },
    button: {
        alignSelf: 'flex-end' },
    redirect: {
        alignSelf:'flex-end' },
    testBorder: {
        borderColor: '#0ac45555',
        borderWidth: 2 },
    formStyle: {
        flex: 2,
        justifyContent: 'space-around', },
    input2: {
        height: 50,
        backgroundColor: '#ffffff',
        //marginBottom: 25,
        borderWidth: 2,
        borderColor: '#B8BeC1',
        borderRadius: 15,
        color: '#B8BeC1',
        paddingHorizontal: 10, },
    input1: {
        height: 50,
        backgroundColor: '#ffffff',
        marginBottom: 25,
        borderWidth: 2,
        borderColor: '#B8BeC1',
        borderRadius: 15,
        color: '#B8BeC1',
        paddingHorizontal: 10, },
    errorTextStyle: {
        fontSize: 12,
        alignSelf: 'center',
        color: '#E23737',
        marginTop: 10 }
});

const button = StyleSheet.create({
    buttonContainer: {
       backgroundColor: '#ED7248',
       paddingVertical: 20,
       paddingHorizontal: 20,
       borderRadius: 30,
       width: 330,
    },
    buttonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const mapStateToProps = state => {
    return { user: state.user, number: state.number };
}

export default connect(mapStateToProps, actions)(HomeScreen);