import React, { PureComponent } from 'react';
import { View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

export default class CardView extends PureComponent {
  render() {
    const localStyle = {
      backgroundColor: this.props.color,
      shadowColor: 'black',
      shadowOffset: {
        width: this.props.cardElevation,
        height: this.props.cardElevation,
      },
      shadowOpacity: 0.2,
      elevation: this.props.cardElevation,
      borderRadius: this.props.cornerRadius,
      shadowRadius: this.props.cardElevation,
    };

    if (this.props.onPress) {

      return (
        <TouchableHighlight
          underlayColor={this.props.pressedColor}
          style={[localStyle, this.props.style]}
          onPress={this.props.onPress}>
          <View style={this.props.style}>{this.props.children}</View>
        </TouchableHighlight>
      );
    } else {
      return <View
        underlayColor={this.props.pressedColor}
        style={[localStyle, this.props.style]}
      >
        <View style={this.props.style}>{this.props.children}</View>
      </View>
    }

  }
}
CardView.propTypes = {
  cardElevation: PropTypes.number,
  cornerRadius: PropTypes.number,
  onPress: PropTypes.func,
};

CardView.defaultProps = {
  cardElevation: 4,
  cornerRadius: 2,
  color: 'white',
  pressedColor: '#E7E7E7',
};
