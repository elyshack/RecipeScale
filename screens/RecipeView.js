import React, { Component } from 'react';
import { View, Image, Text, TextInput, StatusBar, Dimensions, ScrollView,
    Animated, // Component we are using is prepackaged with React nNtive
    StyleSheet, TouchableWithoutFeedback, AsyncStorage, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Input } from 'react-native-elements';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import { SafeAreaView } from 'react-navigation';
import Toggle from '../components/Toggle';
import Modal from "react-native-modal";
import IngredientBar from '../components/IngredientBar';
import DynamicInput from '../components/DynamicInput';


const screen = Dimensions.get('screen');


const testIngredients = [
    {name: "ing1", quantity: 21, unit: 'cups'},
    {name: "ing2", quantity: 5.5, unit: 'teaspoons'},
    {name: "ing3", quantity: 2, unit: ' – '},
    {name: "ing4", quantity: .25, unit: 'lbs'}

]

class RecipeView extends Component {
    static navigationOptions = {
        header: null,
    };

    
    state = {
        data: [], 
        userId: null, 
        opacityValue: new Animated.Value(0), 
        distanceValue: new Animated.Value(0),
        isOn: true,
        leftColor: 'grey',
        rightColor: 'white',
        recipeKey: '',
        newIngredientIsVisible: false,
        tempNewIng: '',
        tempNewQuantity: '',
        tempNewUnit: ''
    }


    loadFromDatabase = async () => {
        this.setState({data: []});

        let recipeKey = this.props.navigation.getParam('key');        
        let recipeName = this.props.navigation.getParam('name');

        userId = await firebase.auth().currentUser.uid;        

        IngredientsArray = [];
        // attempt to pull recipes from database
        try{
        var ingredientQuery = await firebase.database().ref("/users/"+userId+"/recipes/"+recipeKey+"/ingredients");

        await ingredientQuery.once("value").then(function(snapshot){
            snapshot.forEach(childSnapshot => {
                var ingredientKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log("child data:" + childData.name)
                var obj = {
                    key: ingredientKey,
                    name: childData.name,
                    quantity: childData.quantity,
                    unit: childData.unit
                };

                IngredientsArray.push(obj)
            });
        });
        } catch (err){
            console.log(err + "DIDNT WORK");
        }
        console.log("ingredient data: " + IngredientsArray);

        this.setState({data: IngredientsArray, name: recipeName});

    }

    componentWillMount = async () => {
        this.loadFromDatabase();
    }

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

    // navigateToRecipeList = () => {
    //     this.props.navigation.navigate('RecipeList');
    // }


    toggleNewIngredientModal = () => this.setState({ newIngredientIsVisible: !this.state.newIngredientIsVisible });


    returnUserUID = async () => {
        console.log(this.state.userId);
    }

    renderIngredients = () => {
        return (
            this.state.data.map((c, index) =>
            <View key={index}>
                <IngredientBar
                    name={c.name}
                    quantity={c.quantity}
                    unit={c.unit}
                    ingredientKey={c.key}
                    recipeKey = {this.props.navigation.getParam('key')}
                    />
            </View>
        ));
    }

    // Handle ingredient name input on new ingredient modal
    newIngChange = (name) =>{
        console.log(name);
        this.setState({tempNewIng: name});
    }

    // Handle quantity input on new ingredient modal
    newQuantityChange = (quan) =>{
        console.log(quan);
        this.setState({tempNewQuantity: quan});
    }

    // Handle unit input on new ingredient modal
    newUnitChange = (unit) =>{
        console.log(unit);
        this.setState({tempNewUnit: unit});
    }

    // Handle cancel on new ingredient modal
    newIngCancel = () =>{
        this.setState({tempNewIng: '', tempNewQuantity: '', tempNewUnit: ''});
        this.toggleNewIngredientModal();
    }

    // Handle create new ingredient
    createIngredient = async () =>{
        let obj = {name: this.state.tempNewIng, quantity: this.state.tempNewQuantity, unit: this.state.tempNewUnit};

            // TODO actually make this post to comment thread
        
            let recipeKey = this.props.navigation.getParam('key');        
            let recipeName = this.props.navigation.getParam('name');

            let userId = await firebase.auth().currentUser.uid;    
    
            try{
                newIngId = await firebase.database().ref("/users/"+userId+"/recipes/"+recipeKey+"/ingredients").push(obj);
            }catch{(error)=>{
                console.log(error);
            }}
    
            // Clear input fields and close modal
            this.newIngCancel();
            this.loadFromDatabase();
    }


    // Handle Toggle Switch
    onToggle = (value) =>{
        this.setState({isOn: value});
        if (value == false){
            this.setState({leftColor: 'white', rightColor: 'grey'})
        }
        else {
            this.setState({rightColor: 'white', leftColor: 'grey'})
        }
    }

    render() {
        return (
            <View style={styles.toplevel}>
            <StatusBar barStyle="light-content"/>
            <View style={styles.titleBox}>
                    <View style={{flex: 1}}>
                        <Animated.Text style={[{color: 'white', fontWeight:'bold' , fontSize: 20, opacity: this.state.opacityValue}, {left: this.state.distanceValue, top: '46%'}]}>
                            > > >
                        </Animated.Text>

                    </View>
                <Text style={[styles.bigtext]}>{this.state.name}</Text>
                <View style={{flex: 1}}/>
            </View>

            <ScrollView style={styles.scrollView}>

            {this.renderIngredients()}
            <TouchableOpacity onPress={this.toggleNewIngredientModal}>
                
            <View style={styles.optionBar} >
                        <Icon name='add-circle-outline' size={50} color="white" marginBottom={20} />
                    </View>
            </TouchableOpacity>
            </ScrollView>

            
            <View style={styles.bottomSection} onPress={this.navToRecipeView}>
                <View style={styles.optionBar} >
                    <Text style={[styles.smalltext, {color: this.state.leftColor}]}>Scale</Text>      
                    <Toggle buttonOffColor={"white"} buttonOnColor={"white"} onToggle={this.onToggle} isOn={this.state.isOn}></Toggle>
                    <Text style={[styles.smalltext, {color: this.state.rightColor}]}>Edit</Text>      
                </View>
            </View>
            

                   
            <Modal isVisible={this.state.newIngredientIsVisible}>
            <DismissKeyboard>

            <KeyboardAvoidingView style={styles.modalContainer}>
                <Text style={styles.smalltext}>Add Ingredient</Text>
                    <View style={styles.formStyle}>
                    <TextInput
                    style={styles.newIngInput}
                    placeholder="Ing. Name"
                    onChangeText = {text => this.newIngChange(text)}
                    value = {this.state.tempNewIng}
                    />
                    <TextInput
                    style={styles.newIngInput}
                    keyboardType="numeric"
                    placeholder="Quantity"
                    onChangeText = {text => this.newQuantityChange(text)}
                    value = {this.state.tempNewQuantity}
                    autoCapitalize = 'none'
                    />
                    <TextInput
                    style={styles.newIngInput}
                    placeholder="Unit"
                    onChangeText = {text => this.newUnitChange(text)}
                    value = {this.state.tempNewUnit}
                    autoCapitalize = 'none'
                    />
                    </View>
                    <View style={styles.buttons}>
                    <TouchableOpacity style={button.buttonContainer} onPress={this.newIngCancel}>
                            <Text style={styles.smalltext}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={button.buttonContainer} onPress={this.createIngredient}>
                            <Text style={styles.smalltext}>Save</Text>
                    </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
                </DismissKeyboard>

            </Modal>
           </View>
        )
    }
}
// Colors to get: onColor="grey", offColor="#7FC4FD"

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

);


const styles = StyleSheet.create({
    newIngInput: {
        flex:1,
        textAlign: 'center',
        color: 'white'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '20%',
        width: '98%',
        marginBottom: 5
    },
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
        marginRight: 10,
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
        borderColor: '#0ac45555',
        borderWidth: 2 },
    formStyle: {
        alignSelf: 'center',
        backgroundColor: "#445689",
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: Math.floor((screen.width/5)*4),
        height: Math.floor(screen.height/12),
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 10,
        borderColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
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
        marginTop: 10 },
    modalContainer: {
        height: "40%",
        backgroundColor: '#445689',
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white'
    },
});

const button = StyleSheet.create({
    buttonContainer: {
       backgroundColor: '#6B5589',
       borderRadius: 10,
       width: "45%",
       borderColor: 'white',
       borderWidth: 1,
       justifyContent: 'center',
       alignContent: 'center'
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
    return { user: state.user };
}

export default connect(mapStateToProps, actions)(RecipeView);