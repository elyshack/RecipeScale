import React, { Component } from 'react';
import {View, Text, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity, Vibration, KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import RHeader from '../components/RHeader';
import RButton from '../components/RButton';
import DynamicInput from '../components/DynamicInput';
import Footer from '../components/Footer';
import Spinner from "../components/Spinner";
import firebase from 'firebase';



const screen = Dimensions.get('screen');

class RegistrationScreen extends Component {
    static navigationOptions = {
        header: null,
    };


    state = { name: '', email: '', password: '', password_confirm: '', error: '', loading: false };

    onButtonPress() {
        const { name, email, password_confirm, password } = this.state;
        this.setState({ error: '', loading: true });

        if ( !(password == '' || email == '' || name == '')) {

          if(!(!email.includes('@') || !email.includes('.'))){

            if(!(name.length > 35)){
              
              if(password == password_confirm ){
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(this.onRegisterSuccess.bind(this))
                .catch(error => {
                    if(error.code =="auth/email-already-in-use"){
                      this.setState({error: "Email is already in use.", loading: false});
                    } else{
                      console.log(error);
                      this.setState({error: "Registration failed.", loading: false});
                    }
                  });
                });
              } else {
                  Vibration.vibrate(1000)
                  this.setState({ error: "Passwords must match.", loading: false });
              }
            } else{
              Vibration.vibrate(1000)
              this.setState({ error: "Name must be 35 or fewer characters.", loading: false });
            }
          }
          else{
            Vibration.vibrate(1000)
            this.setState({ error: "Incorrect email format.", loading: false });
          }
        }
        else{
          Vibration.vibrate(1000)
          this.setState({ error: "Fields cannot be blank.", loading: false });
        }
    }

    // will be looking at doing catches for onButtonPress for each error such as email, matching passwords,
    // and any other check
    onRegisterFail() {
        this.setState({ error: 'Registration failed.', loading: false });
    }


    onRegisterSuccess = async () => {
        const user = await firebase.auth().currentUser;

        await firebase.database().ref('users/' + user.uid).set({
          fullName: this.state.name
        });

        if (user !== null)
            this.props.userLoad(user);

        this.setState({
          name: '',
          email: '',
          password: '',
          password_confirm: '',
          loading: false,
          error: ''
        });

        this.props.navigation.navigate('Home');
    }

    renderButton(){
        if (this.state.loading) {
            return <Spinner size="small" />; }

        return (
          <View style={form.buttonView} flex={1} paddingHorizontal={28} paddingBottom={28}>
            <RButton viewStyle = {{alignSelf: 'center'}} propStyle={{width: Math.floor(screen.width/2), alignSelf: 'center'}}flex={1} onPress={this.onButtonPress.bind(this)}>
                CONTINUE
            </RButton>
          </View>
        );
    }

    handleNameChange = (typedText) => {
        this.setState({name:typedText});
    }

    handleEmailChange = (typedText) => {
        this.setState({email:typedText});
    }

    handlePasswordChange = (typedText) => {
        this.setState({password:typedText});
    }

    handlePasswordConfirmChange = (typedText) => {
        this.setState({password_confirm:typedText});
    }

    navigateToRecipeList = () => {
      this.props.navigation.navigate('RecipeList');
  }

    render() {
        return (
          // <KeyboardAvoidingView flex={1} behavior='padding'>
            <DismissKeyboard>
            <View flex={1} style={styles.mainContainer}>
              <View flex={2} paddingLeft={48}>
                <RHeader >Create Account</RHeader>
              </View>
              <View style={form.formStyle}>
                  <DynamicInput placeholderList={[
                      {placeholder: 'Full Name',
                        inputContainerStyle: 'regScreenInput',
                        autoCorrect: false,
                        autoCapitalize: "words",
                        stateLabel: "name",
                        onChange: this.handleNameChange,
                        isRequired: true},
                      {placeholder: 'Email',
                        inputContainerStyle: 'regScreenInput',
                        autoCorrect: false,
                        autoCapitalize: "none",
                        stateLabel: "email",
                        spellcheck: false,
                        onChange: this.handleEmailChange,
                        isRequired: true,},
                      {placeholder: 'Password',
                        inputContainerStyle: 'regScreenInput',
                        secureTextEntry: true,
                        autoCorrect: false,
                        stateLabel: "password",
                        onChange: this.handlePasswordChange,
                        isRequired: true,},
                      {placeholder: 'Confirm Password',
                        inputContainerStyle: 'regScreenInput',
                        secureTextEntry: true,
                        returnKeyType: 'done',
                        autoCorrect: false,
                        stateLabel: "password_confirm",
                        onChange: this.handlePasswordConfirmChange,
                        isRequired: true,},
                      ]}
                  />
                </View>

                <Text style={form.errorTextStyle}>
                    {this.state.error}
                </Text>

                <KeyboardAvoidingView style={form.buttonView} behavior='padding'>
                  {this.renderButton()}
                </KeyboardAvoidingView>
                <View flex={2}>
                  <Footer/>
                </View>
                
            </View>
            </DismissKeyboard>
            /* </KeyboardAvoidingView> */
        )
    }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    height: '100%',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#445689'
},
bigText: {
  color: 'white'
}


})

const form = StyleSheet.create({

    formStyle: {
      flex: 4,
      paddingHorizontal: 40,
      justifyContent: 'space-around',

    },
    text: {
      color: 'white'
    },
    errorTextStyle: {
        fontSize: 12,
        alignSelf: 'center',
        color: '#E23737',
        marginTop: 10
    },
    buttonView: {

    },
    button: {
      alignSelf: 'center',

    }
});



const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

);
const mapStateToProps = state => {
  return { user: state.user };
}

export default connect(mapStateToProps, actions)(RegistrationScreen);
