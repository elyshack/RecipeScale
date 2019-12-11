import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

const RButton = ({ onPress, children, propStyle, viewStyle }) => {
    return (
        <View style={[styles.viewStyle, viewStyle]}>
          <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, propStyle]}>
              <Text style={styles.buttonText}>
                  {children}
              </Text>
          </TouchableOpacity>
        </View>
    );
};

const styles = {
    buttonContainer: {
       backgroundColor: '#2699FB',
       borderRadius: 5,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 3 },
       shadowOpacity: 0.3,
       shadowRadius: 2,
       height: 48,
       justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: "white",
        fontSize: 12,
        // fontFamily: 'circular-std-bold',
        height: 12
    },
    viewStyle: {
        width: '50%',
        paddingHorizontal: 10,
        paddingBottom: 25,
        paddingTop: 5,
      }
  };

export default RButton;
