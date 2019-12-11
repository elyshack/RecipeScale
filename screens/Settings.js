import React, { Component } from 'react';
import { View, Image, Text, TextInput, StatusBar, Dimensions, ScrollView,
    Animated, // Component we are using is prepackaged with React nNtive
    StyleSheet, TouchableWithoutFeedback, AsyncStorage, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import { SafeAreaView } from 'react-navigation';
import RecipeBar from '../components/RecipeBar';

const screen = Dimensions.get('screen');

class Settings extends Component {
    static navigationOptions = {
        header: null,
    };
    // STATE. Storing opacity value
    state = {data: [], userId: null, opacityValue: new Animated.Value(0), distanceValue: new Animated.Value(0)}
    componentWillMount = async () => {
        console.log("COMPONENT WILL MOUNT OF SETTINGS");
        userId = await firebase.auth().currentUser.uid;        
        RecipesArray = [];
        // attempt to pull recipes from database
        try{
        
        } catch (err){
            console.log(err + "DIDNT WORK");
        }
    }
    // Lifecycle function (Runs after component is confirmed to have been mounted)
    componentDidMount = () => {
        Animated.loop( // Starts overall animation loop, with other nested animations inside
            Animated.parallel([ //Animates multiple animations at once
                Animated.sequence([ // Animates the following two animations sequentially (1.2 seconds total)
                    Animated.timing(this.state.opacityValue,{ // Fade in to max opacity (1)
                        toValue: 1,
                        duration: 600 //.6 seconds
                    }),
                    Animated.timing(this.state.opacityValue,{ // Fade out to no opacity (0)
                        toValue: 0,
                        duration: 600 // .6 seconds fade out
                    }),
                 ]),
                Animated.timing(this.state.distanceValue, { // Going from x value of 0 to x value of 40
                    toValue: 40,
                    duration: 1200 // Animation takes 1.2 seconds total, like the above animation group
                })
            ]),
            {
                iterations: -1 // Can set number of times animation loops. -1 means infinite.
              }
        ).start();
    }
    returnUserUID = async () => {
        console.log(this.state.userId);
    }
    // renderSettingsList = () =>{
    //     return (
    //         this.state.data.map((c, index) =>
    //         <View key={index}>
    //             <RecipeBar name={c.name} date={c.date} key={c.key} />
    //         </View>
    //     ));
    // }
    render() {
        return (
           <View style={styles.toplevel}>
            <StatusBar barStyle="light-content"/>
            <View style={styles.titleBox}>
                    <View style={{flex: 1}}>
                        {/* Animated text component. You can also use Animated.View for View components, and a few others. */}
                        {/* Using state-stored values in the style is how the animation works. */}
                        {/* Opacity and left are drawing on the stored values in the state */}
                        {/* Left just sets the distance of the component from the left side */}
                        <Animated.Text style={[{color: 'white', fontWeight:'bold' , fontSize: 20, opacity: this.state.opacityValue}, {left: this.state.distanceValue, top: '46%'}]}>
                            > > >
                        </Animated.Text>
                    </View>
                <Text style={[styles.bigtext]}>Settings</Text>
                <View style={{flex: 1}}/>
            </View>
            <ScrollView style={styles.scrollView}>
                <TouchableOpacity style={styles.bar}>
                <Text style={styles.nameText}>User Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bar}>
                <Text style={styles.nameText}>Help</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bar}>
                <Text style={styles.nameText}>About Me</Text>
                </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={styles.bottomSection} onPress={this.navToRecipeView}>
                    <View style={styles.optionBar} >
                        <Text style={styles.nameText}>Logout</Text>
                    </View>
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
    titleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: screen.width,
        marginTop: 20,
        marginBottom: 30,
        backgroundColor: "#445689"
    },
    bottomSection: {
        height: '11%',
        alignContent: 'center',
        justifyContent: 'center',
        width: screen.width,
        borderTopWidth: 1,
        borderTopColor: 'white',
        backgroundColor: '#6B5589',
    },
    scrollView:{
    },
    recipeContainer: {
        justifyContent: 'flex-start',
    },
    animationView: {
        width: 50,
        height: '10%'
    },
    optionGroup: {
        height: '25%',
        justifyContent: 'space-between'
    },
    optionBar: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        width: '50%',
    },
    logOutBar: {
        backgroundColor: '#7FC4FD',
        height: '12%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    bigtext: {
        alignSelf: 'center',
        marginTop: '9%',
        marginBottom: '3%',
        color: "white",
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
        color: 'white',
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
        borderColor: '#0AC45555',
        borderWidth: 2 },
    formStyle: {
        flex: 2,
        justifyContent: 'space-around', },
    input2: {
        height: 50,
        backgroundColor: '#FFFFFF',
        //marginBottom: 25,
        borderWidth: 2,
        borderColor: '#B8BEC1',
        borderRadius: 15,
        color: '#B8BEC1',
        paddingHorizontal: 10, },
    input1: {
        height: 50,
        backgroundColor: '#FFFFFF',
        marginBottom: 25,
        borderWidth: 2,
        borderColor: '#B8BEC1',
        borderRadius: 15,
        color: '#B8BEC1',
        paddingHorizontal: 10, },
    errorTextStyle: {
        fontSize: 12,
        alignSelf: 'center',
        color: '#E23737',
        marginTop: 10 
    },
        bar: {
            backgroundColor: "#445689",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: screen.width-20,
            height: Math.floor(screen.height/12),
            marginVertical: 5,
            marginHorizontal: 5,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'white'
        },
        nameText: {
            paddingLeft: 10,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 30
        },
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
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
const mapStateToProps = state => {
    return { user: state.user };
}
export default connect(mapStateToProps, actions)(Settings);