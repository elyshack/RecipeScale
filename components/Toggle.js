import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FlipToggle from 'react-native-flip-toggle-button';

class Toggle extends Component {
  constructor(props) {
      super(props);

      this.state = { isOn: props.isOn };
};

    render() {
        return (
            <View>
              <FlipToggle
                value={this.props.isOn || false}
                buttonWidth={50}
                buttonHeight={25}
                buttonRadius={50}
                buttonOffColor={this.props.buttonOffColor}
                sliderOffColor={this.props.sliderOffColor}
                buttonOnColor={this.props.buttonOnColor}
                sliderOnColor={this.props.sliderOnColor}
                onToggle={this.props.onToggle}
              />
            </View>
        );
    }
}

export default Toggle;
