import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions, View } from 'react-native';
import firebase from 'firebase';
import Modal from 'react-native-modal';

const screen = Dimensions.get('screen');

class IngredientBar extends Component {
  constructor(props) {
      super(props);

      this.state = { onPress: props.onPress, deleteModalVisible: false, recipeKey: props.recipeKey, ingredientKey: props.ingredientKey, longPress: props.longPress, isOn: props.isOn, name: props.name, quantity: props.quantity, unit: props.unit};
};

        // onLongPress = async () => {
        //     this.setState({deleteModalVisible: true});
           
        //     // let user = await firebase.auth().currentUser.uid;
        //     // try{
        //     //     console.log("Trying delete")
        //     //     await firebase.database().ref("/users/"+user+"/recipes/"+props.recipeKey).remove();
        //     // }  catch{(error) => {
        //     //     console.log(error);
        //     // }}
        // }

        
        

    render() {
        return (
            <View>
            <TouchableOpacity onPress={this.state.onPress} onLongPress={this.state.longPress} style={styles.bar}>
              <Text style={styles.nameText}>{this.state.name}</Text>
              <Text style={styles.quantityText}>{this.state.quantity}</Text>
              <Text style={styles.unitText}>{this.state.unit}</Text>
            </TouchableOpacity>
            {/* <Modal isVisible={this.state.deleteModalVisible} style={styles.modal}>
                <View>
                    <Text>Delete Ingredient?</Text>
                    <TouchableOpacity onPress={this.deleteIngredient}><Text>Yes</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.cancelDeletion}><Text>No</Text></TouchableOpacity>
                </View>
            </Modal> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        width: screen.width-20,
        backgroundColor: '#6B5589',
        // height: Math.floor(screen.height/10)
    },
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
    nameText: {
        flex: 1,
        textAlign: 'left',
        paddingLeft: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14

    },
    quantityText: {
        flex: 1,
        textAlign: 'center',
        paddingLeft: 10,
        color: 'white',
        fontSize: 14

    },
    unitText: {
        flex: 1,
        textAlign: 'right',
        paddingRight: 10,
        color: 'white',
        fontSize: 14
    }
});

export default IngredientBar;
