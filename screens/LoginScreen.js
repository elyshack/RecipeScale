import React, { Component } from 'react';
import { StatusBar, View, Image, Text, TextInput, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import Spinner from "../components/Spinner";
import DynamicInput from "../components/DynamicInput";
import RButton from "../components/RButton";


screen = Dimensions.get('screen');

class LoginScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    state = { email: '', password: '', error: '', loading: false };

    handlePasswordChange = (typedText) => {
        this.setState({password:typedText});
    }

    handleEmailChange = (typedText) => {
        this.setState({email:typedText});
    }

    onButtonPress() {
        const { email, password } = this.state;
        this.setState({ error: '', loading: true });

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(this.onLoginSuccess.bind(this))
                .catch((error) => {
                    console.log(error);
                    this.setState({ error: "Login attempt failed.", loading: false });
                });
        });
    }

    onLoginFail() {
        this.setState({ error: 'Authentication Failed.', loading: false });
    }

    onLoginSuccess = async () => {
        this.setState({
            email: '',
            password: '',
            loading: false,
            error: ''
        });
        const user = await firebase.auth().currentUser;
        console.log(user);
        if (user !== null)
        {
            await this.props.userLoad(user);
            this.setState({userId: user.uid});
        }
            
        //await AsyncStorage.setItem('accessToken', user.accessToken);
        //await AsyncStorage.setItem('refreshToken', user.refreshToken);

        this.props.navigation.navigate('Home');
    }

    renderButton() {
        return (
          <RButton flex={1} onPress={this.onButtonPress.bind(this)}>
              LOG IN
          </RButton>
        );
    }
    renderCreateAccount() {
        if (this.state.loading) {
            return <Spinner size="small" />; }

        return (
        <RButton flex={1} onPress={() => this.props.navigation.navigate('Registration')}>
        CREATE ACCOUNT
         </RButton>
        );
    }

    navigateToRegistrationScreen = () => {
        this.props.navigation.navigate('Registration');
    }

    render() {
        return (
            <KeyboardAvoidingView behavior='position'>
            <StatusBar barStyle="dark-content"/>
            <DismissKeyboard>
                <View style={styles.mainContainer}>
                    <View style ={styles.logo}>
                        <Image style={styles.logoImage} source={require('../assets/logotext.png')}/>
                        <Text style={styles.smalltext}>@elyshack | @bellsarian</Text>
                        <Image style={styles.image} source={require('../assets/scalelogo.png')}/>
                    </View>

                    <View style={[{flex: 1}]}>
                    <View style={styles.formStyle}>
                        <DynamicInput placeholderList={[
                            {placeholder: 'Email',
                                inputContainerStyle: 'loginInput',
                                inputStyle: "loginText",
                                autoCapitalize: "none",
                                spellCheck: false,
                                stateLabel: "email",
                                iconStyle: "MCIcon",
                                iconName: "email-variant",
                                iconColor: "white",
                                iconSize: 22,
                                onChange: this.handleEmailChange,
                                textColor: 'white'
                                },
                            
                            {placeholder: 'Password',
                                secureTextEntry: true,
                                inputContainerStyle: 'loginInput',
                                inputStyle: "loginText",
                                stateLabel: "password",
                                returnKeyType: "done",
                                autoCorrect: false,
                                autoCapitalize: "none",
                                iconStyle: "MCIcon",
                                iconName: "lock",
                                iconColor: "white",
                                iconSize: 22,
                                onChange: this.handlePasswordChange},
                            ]}
                        />    
                        </View>

                    <Text style={styles.errorTextStyle}>
                        {this.state.error}
                    </Text>
                    <View style={styles.buttonGroup}>
                    {this.renderButton()} 
                    {this.renderCreateAccount()}
                    </View>
                   </View>

                </View>
            </DismissKeyboard>
            </KeyboardAvoidingView>
        )
    }
}

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

);

const styles = StyleSheet.create({
    smalltext: {
        textAlign: 'center',
        fontSize: 11.5,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10
    },
    bigtext: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white'
    },
    mainContainer: {
        height: '100%',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#445689'
    },
    image: {
        width: null,
        height: Math.floor(screen.height/5),
        resizeMode: 'contain',
        marginBottom: 50
        },
    logo: {
        flex: 1.5,
        justifyContent: 'flex-start',
        fontSize: 40,
        fontWeight: 'bold',
        width: null,
        resizeMode: 'contain',
        height: '33%',
        marginBottom: '5%',
        // borderWidth: 3,
        // borderColor: 'green'
    },
    logoImage: {
        alignSelf: 'center',
        width: Math.floor(screen.width/1.5),
        resizeMode: 'contain',
    },

    testBorder: {
        borderColor: '#0ac45555',
        borderWidth: 2 },
    formStyle: {
        flex: 1,
        paddingVertical: 25,
    },
    input2: {
        height: 50,
        backgroundColor: '#ffffff',
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
        marginTop: 10 },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

const button = StyleSheet.create({
    buttonContainer: {
       backgroundColor: 'white',
       paddingVertical: 20,
       paddingHorizontal: 20,
       borderRadius: 30,
       width: 330,
    },
    buttonText: {
        textAlign: 'center',
        color: '#445689',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const mapStateToProps = state => {
    return { user: state.user, userId: state.userId };
}

export default connect(mapStateToProps, actions)(LoginScreen);