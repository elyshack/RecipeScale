import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';



const  screen = Dimensions.get('screen');

class RecipeBar extends Component {
  constructor(props) {
      super(props);

      this.state = { isOn: props.isOn, name: props.name, date: props.date, recipe: props.recipe, recipeKey: props.key, onPress: props.onPress };
};

        // onLongPress = async () => {
        //     console.log("Delet recipe calld");
        //     let user = await firebase.auth().currentUser.uid;

        //     try{
        //         console.log("Trying delete")
        //         await firebase.database().ref("/users/"+user+"/recipes/"+props.recipeKey).remove();
        //     }  catch{(error) => {
        //         console.log(error);
        //     }}
        // }


    render() {
        console.log("KEY: " +this.state.recipeKey);
        return (
            <TouchableOpacity  onPress={this.state.onPress} onLongPress={this.onLongPress} style={styles.bar}>
              <Text style={styles.nameText}>{this.state.name}</Text>
              <Text style={styles.dateText}>{this.state.date}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    bar: {
        alignSelf: 'center',
        backgroundColor: "#445689",
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: screen.width-20,
        height: Math.floor(screen.height/12),
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'
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
    nameText: {
        textAlign: 'center',
        paddingLeft: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14

    },
    dateText: {
        textAlign: 'center',
        paddingRight: 10,
        color: 'white',
        fontSize: 14
    }
});

const mapStateToProps = state => {
    return { user: state.user };
}

export default connect(mapStateToProps, actions)(RecipeBar);