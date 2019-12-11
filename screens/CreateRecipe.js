import React, { Component } from 'react';
import { View, Image, Text, TextInput, StatusBar, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import { SafeAreaView } from 'react-navigation';

class RecipeList extends Component {
    static navigationOptions = {
        header: null,
    };

    state = {userId: null}

    componentWillMount = async () => {
      
    }

    componentDidMount = async () => {

    }

    returnUserUID = async () => {
        console.log(this.state.userId);
    }

    render() {
        return (
           <SafeAreaView style={styles.toplevel}>
            <StatusBar barStyle="dark-content"/>
            <View>
                <Text style={styles.bigtext}>Recipes</Text>
            </View>

            <View style={styles.optionGroup}>
                <TouchableOpacity style={styles.optionBar} onPress={this.returnUserUID}>
                    <Icon name='add-circle-outline' color="white"/>
                    <Text style={styles.smalltext}>New Recipe</Text>
                </TouchableOpacity>
            </View>

           </SafeAreaView>
        )
    }
}

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

);

const styles = StyleSheet.create({
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
        backgroundColor: '#7FC4FD',
        height: '12%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    bigtext: {
        alignSelf: 'center',
        marginTop: '10%',
        color: 'white',
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
    },
    colorbox: {
        borderWidth: 10
    },
    smalltext: {
        marginLeft: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
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
        backgroundColor: "#2699FB"
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

export default connect(mapStateToProps, actions)(RecipeList);