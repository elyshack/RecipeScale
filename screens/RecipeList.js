import React, { Component } from 'react';
import { View, Image, Text, TextInput, StatusBar, Dimensions, ScrollView,
    Animated, // Component we are using is prepackaged with React nNtive
    StyleSheet, TouchableWithoutFeedback, AsyncStorage, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import RecipeBar from '../components/RecipeBar';


const screen = Dimensions.get('screen');


class RecipeList extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    
        this.toggleDeleteRecipeModal = this.toggleDeleteRecipeModal.bind(this);
        this.navToRecipeView = this.navToRecipeView.bind(this);
      }



    // STATE. Storing opacity value
    state = {
        keyToDelete: '',
        deleteRecipeModalVisible: false,
        data: [],
        tempRecipeName: '',
        newRecipeModalVisible: false,
        userId: null,
        opacityValue: new Animated.Value(0),
        distanceValue: new Animated.Value(0)
    }


    loadFromDatabase = async () => {
        this.setState({data: []});
        console.log("COMPONENT WILL MOUNT OF RECIPE LIST");
        userId = await firebase.auth().currentUser.uid;        

        RecipesArray = [];
        // attempt to pull recipes from database
        try{
        var recipeQuery = await firebase.database().ref("/users/"+userId+"/recipes");

        await recipeQuery.once("value").then(function(snapshot){
            snapshot.forEach(childSnapshot => {
                var recipekey = childSnapshot.key;
                var childData = childSnapshot.val();

                var obj = {
                    key: recipekey,
                    name: childData.name,
                    date: childData.date
                };

                console.log(obj.key);
                RecipesArray.push(obj)
            });
        });
        } catch (err){
            console.log(err + "DIDNT WORK");
        }
        this.setState({data: RecipesArray});
      }


    componentWillMount = async () => {
      this.setState({newRecipeModalVisible: this.props.navigation.getParam('modal')}); 
      this.loadFromDatabase();
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


    navToRecipeView = (key, name) => {
        console.log("KEY!: " + key);
        this.props.navigation.navigate('RecipeView', {key: key, name: name});
    }

    returnUserUID = async () => {
        console.log(this.state.userId);
    }

    // TOGGLE DELETION MODAL
    toggleDeleteRecipeModal = (key) => {
        console.log("delete recipe modal called");
        this.setState({keyToDelete: key, deleteRecipeModalVisible: !this.state.deleteRecipeModalVisible});
    }

    // DELETE RECIPE
    deleteRecipe = async () => {
        let recipeKey = this.state.keyToDelete;
        let userId = await firebase.auth().currentUser.uid;        

        console.log("Delete recipe calld");
        userId = await firebase.auth().currentUser.uid;        
 
        try{
            console.log("Trying delete")
            await firebase.database().ref("/users/"+userId+"/recipes/"+recipeKey).remove();
        }  catch{(error) => {
            console.log(error);
        }}
        this.setState({deleteRecipeModalVisible: false});
        this.loadFromDatabase();
    }

    // CANCELED DELETE MODAL
    cancelDelete = () => {
        this.setState({deleteRecipeModalVisible: false});
    }

    renderRecipesList = () =>{
        return (
            this.state.data.slice(0).reverse().map((c, index) =>
            <View key={index}>
                <RecipeBar
                onPress={() => this.navToRecipeView(c.key, c.name)} name={c.name} date={c.date} key={c.key} 
                onLongPress={()=>this.toggleDeleteRecipeModal(c.key)}
                />
            </View>
        ));
    }

    toggleNewRecipeModal = () => this.setState({ newRecipeModalVisible: !this.state.newRecipeModalVisible });

    changeRecipeName = (name) => {
        this.setState({tempRecipeName: name});
    }

    // Handle cancel on new ingredient modal
    newRecipeCancel = () =>{
        this.setState({tempRecipeName: ''});
        this.toggleNewRecipeModal();
    }

    // Handle create new ingredient
    createRecipe = async () => {
        date = new Date();
        dateOptions = {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: '2-digit'};
        let obj = {name: this.state.tempRecipeName, date: date.toLocaleDateString("en-us", dateOptions)};

            // TODO actually make this post to comment thread
            let userId = await firebase.auth().currentUser.uid;    
    
            try{
                newIngId = await firebase.database().ref("/users/"+userId+"/recipes").push(obj);
            }catch{(error)=>{
                console.log(error);
            }}
    
            // Clear input fields and close modal
            this.newRecipeCancel();
            this.loadFromDatabase();
    }

    render() {
        return (
           <View style={styles.toplevel}>
            <StatusBar barStyle="dark-content"/>
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
                <Text style={[styles.bigtext]}>Recipes</Text>
                <View style={{flex: 1}}/>
            </View>

            <ScrollView style={styles.scrollView}>
            {this.renderRecipesList()}
            </ScrollView>
            <TouchableOpacity style={styles.bottomSection} onPress={this.toggleNewRecipeModal}>
                    <View style={styles.optionBar} >
                        <Icon name='add-circle-outline' color="white"/>
                        <Text style={styles.smalltext}>New Recipe</Text>
                    </View>
            </TouchableOpacity>

                    {/*   NEW RECIPE MODAL  */}
            <Modal isVisible={this.state.newRecipeModalVisible}l>
            <DismissKeyboard>
            <KeyboardAvoidingView style={styles.modalContainer}>
                <Text style={styles.smalltext}>New Recipe</Text>
                    <View style={styles.formStyle}>
                    <TextInput
                    style={styles.newIngInput}
                    placeholder="Recipe Name"
                    placeholderTextColor= "#d4d4d4"
                    onChangeText = {text => this.changeRecipeName(text)}
                    value = {this.state.tempRecipeName}
                    />
                    </View>
                    <View style={styles.buttons}>
                    <TouchableOpacity style={button.buttonContainer} onPress={this.newRecipeCancel}>
                            <Text style={styles.smalltext}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={button.buttonContainer} onPress={this.createRecipe}>
                            <Text style={styles.smalltext}>Save</Text>
                    </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
                </DismissKeyboard>
            </Modal>


                {/* DELETE RECIPE MODAL */}
                <Modal isVisible={this.state.deleteRecipeModalVisible} >
                    <View style={[styles.modalContainer, {justifyContent: 'space-around'}]}>
                        <Text style={styles.smalltext}>Delete Recipe?</Text>
                        <View style={styles.buttons}>
                        <TouchableOpacity style={button.buttonContainer} onPress={this.deleteRecipe}>
                                <Text style={styles.smalltext}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={button.buttonContainer} onPress={this.cancelDelete}>
                                <Text style={styles.smalltext}>No</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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
    newIngInput: {
        height: Math.floor(screen.height/20),
        width: Math.floor(screen.width/2),
        textAlign: 'center',
        color: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '20%',
        width: '98%',
        marginBottom: 5
    },
    modalContainer: {
        height: "40%",
        backgroundColor: '#445689',
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white'
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
        borderColor: '#0ac45555',
        borderWidth: 2 },
    formStyle: {
        flex: 3,
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

export default connect(mapStateToProps, actions)(RecipeList);